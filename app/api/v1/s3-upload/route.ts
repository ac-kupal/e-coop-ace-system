import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import { routeErrorHandler } from "@/errors/route-error-handler";

const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY ?? "",
    },
});

const uploadFile = async (file : Buffer, folder : string, filename : string) => {
    const fileBuffer = file;

    const params = { 
        Bucket : process.env.AWS_S3_BUCKET_NAME,
        Key : `${filename}`, 
        Body : fileBuffer,
        ContentType : "image/jpg"
    }

    const command = new PutObjectCommand(params);
    const result = await s3Client.send(command)
    
    return result;
}

export const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData();

        const file = formData.get("file") as File;

        if(!file){
            return NextResponse.json({message : "invalid file"}, { status : 400 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const url = uploadFile(buffer, "profile", file.name)

        return NextResponse.json(url)
    } catch (e) {
        return routeErrorHandler(e, req.method);
    }
};
