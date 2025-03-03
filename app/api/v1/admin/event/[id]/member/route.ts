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


export const PATCH = async (req: NextRequest, { params }: TParams) => {
    try {
        const data = await req.json();
        const eventId = Number(params.id);
        validateId(eventId);

        if (!Array.isArray(data)) {
            throw new Error("Invalid data format, expected an array.");
        }

        const updates = data.map((member: {passbookNumber: string, eventId:String}) => ({
            where: {
                eventId_passbookNumber: {
                    eventId,
                    passbookNumber: member.passbookNumber.toUpperCase(),
                },
            },
            data: {
                picture: generateUserProfileS3URL(member.passbookNumber.toUpperCase()),
            },
        }));

        const updatedMembers = await db.$transaction(
            updates.map((update) => db.eventAttendees.update(update))
        );

        return NextResponse.json(updatedMembers);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

