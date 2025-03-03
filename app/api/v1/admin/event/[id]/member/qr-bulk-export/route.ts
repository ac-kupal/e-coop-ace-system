import sharp from "sharp";
import QRCode from "qrcode";
import archiver from "archiver";
import { PassThrough } from "stream";
import { NextRequest, NextResponse } from "next/server";

import { TFolderUploadGroups } from "@/types";
import { uploadFile } from "@/services/s3-upload";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventPbBulkExportRequestSchema } from "@/types/qr-pb-bulk-export";

export const maxDuration = 300;

type TParams = { params: { id: number } };

const generateQRWithTextPNG = async (
    passbookNumber: string,
    dimension: number,
    showPbNumberText: boolean
) => {
    if (!showPbNumberText) {
        return QRCode.toBuffer(passbookNumber, { width: dimension, margin: 1 });
    }

    const qrBuffer = await QRCode.toBuffer(passbookNumber, {
        width: dimension,
        margin: 1,
    });

    const textHeight = 60;
    const finalHeight = dimension + textHeight;

    const textOverlay = Buffer.from(
        `<svg width="${dimension}" height="${textHeight}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${dimension}" height="${textHeight}" fill="white"/>
            <text x="50%" y="50%" font-size="36" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="black">${passbookNumber}</text>
        </svg>`
    );

    return sharp({
        create: {
            width: dimension,
            height: finalHeight,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 1 },
        },
    })
        .composite([
            { input: qrBuffer, top: 0, left: 0 },
            { input: textOverlay, top: dimension, left: 0 },
        ])
        .png({ compressionLevel: 9, quality: 80 })
        .toBuffer();
};

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const searchParams = new URL(req.url).searchParams;
        const base64Options = searchParams.get("options") ?? "";
        const decodedString = Buffer.from(base64Options, "base64").toString(
            "utf-8"
        );

        const { passbookNumbers, batchId, options } =
            await eventPbBulkExportRequestSchema.parseAsync(
                JSON.parse(decodedString)
            );

        const zipStream = new PassThrough();
        const archive = archiver("zip", { zlib: { level: 9 } });

        archive.pipe(zipStream);

        for (const passbookNumber of passbookNumbers) {
            const qrBuffer = await generateQRWithTextPNG(
                passbookNumber,
                options?.dimension ?? 300,
                options?.showPbNumberText ?? false
            );
            archive.append(qrBuffer, { name: `${passbookNumber}.png` });
        }

        await archive.finalize();

        const chunks: Uint8Array[] = [];

        await new Promise<void>((resolve, reject) => {
            zipStream.on("data", (chunk: Buffer) =>
                chunks.push(new Uint8Array(chunk))
            );
            zipStream.on("end", resolve);
            zipStream.on("error", reject);
        });

        const zipBuffer = Buffer.concat(chunks);
        const zipFileName = `Event_${params.id}_PB_QRCode_Batch_${batchId}.zip`;

        const fileUrl = await uploadFile(
            zipBuffer,
            zipFileName,
            "downloadables" as TFolderUploadGroups,
            "application/zip"
        );

        return NextResponse.json({ url: fileUrl });
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};
