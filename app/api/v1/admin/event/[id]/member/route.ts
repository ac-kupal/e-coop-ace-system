import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { generateUserProfileS3URL } from "@/lib/aws-s3";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { generateOTP, newDate, validateId } from "@/lib/server-utils";

import { eventIdSchema } from "@/validation-schema/commons";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { createMemberWithUploadSchema } from "@/validation-schema/member";
import { TMember } from "@/types";

type TParams = { params: { id: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const eventId = eventIdSchema.parse(params.id);
        
        const eventAttendees = await db.eventAttendees.findMany({
            where: { eventId },
            include: {
                event: {
                    select: {
                        election: {
                            select: {
                                id: true,
                            },
                        },
                    },
                },
            },
            orderBy: [{ createdAt: "desc" }, { updatedAt: "desc" }],
        });
        return NextResponse.json(eventAttendees);
    } catch (e) {
        routeErrorHandler(e, req);
    }
};

export const POST = async (req: NextRequest) => {
    try {
        const data = await req.json();
        const user = await currentUserOrThrowAuthError();

        const memberData = {
            ...data,
            createdBy: user.id,
            voteOtp: generateOTP(6),
            picture:
                data.picture && data.picture.startsWith("https://")
                    ? data.picture
                    : generateUserProfileS3URL(
                          data.passbookNumber.toUpperCase()
                      ),
        };

        createMemberWithUploadSchema.parse(memberData);

        const newMember = await db.eventAttendees.create({ data: memberData });

        return NextResponse.json(newMember);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

const chunkMemberData = (array: { where: { eventId_passbookNumber: { eventId: number; passbookNumber: string; }; }; data: { picture: string; }; }[], size: number) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
        chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
};

export const PATCH = async (
    req: NextRequest,
    { params }: { params: { id: number } }
) => {
    try {
        const id = Number(params.id);
        validateId(id);
        const user = await currentUserOrThrowAuthError();

        const existingMembers = await db.eventAttendees.findMany({
            where: { eventId: id },
            select: { passbookNumber: true, eventId: true },
        });

        if (existingMembers.length === 0) {
            return NextResponse.json({ message: "No members found for update." });
        }

        const updates = existingMembers.map((member) => ({
            where: {
                eventId_passbookNumber: {
                    eventId: member.eventId,
                    passbookNumber: member.passbookNumber.toUpperCase(),
                },
            },
            data: {
                picture: generateUserProfileS3URL(member.passbookNumber.toUpperCase()),
            },
        }));

        const BATCH_SIZE = 100; // Smaller batch size to speed up execution
        const batches = chunkMemberData(updates, BATCH_SIZE);

        // ✅ Use Streaming Response
        const stream = new TransformStream();
        const writer = stream.writable.getWriter();
        const encoder = new TextEncoder();

        writer.write(encoder.encode(`Processing ${updates.length} members...\n`));

        for (const batch of batches) {
            await db.$transaction(batch.map((update) => db.eventAttendees.update(update)));
            writer.write(encoder.encode(`Batch processed: ${batch.length} members\n`));
        }

        writer.write(encoder.encode(`Update complete\n`));
        writer.close();

        return new Response(stream.readable, {
            headers: { "Content-Type": "text/plain" },
        });
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

