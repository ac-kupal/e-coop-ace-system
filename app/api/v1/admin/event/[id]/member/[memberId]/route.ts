import { NextRequest, NextResponse } from "next/server";

import db from "@/lib/database";
import { generateUserProfileS3URL } from "@/lib/aws-s3";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { createMemberWithUploadSchema } from "@/validation-schema/member";

type TParams = { params: { id: number; memberId: string } };

export const DELETE = async function name(
    req: NextRequest,
    { params }: TParams
) {
    try {
        const memberId = params.memberId;
        const deletePosition = await db.eventAttendees.delete({
            where: { id: memberId },
        });
        return NextResponse.json(deletePosition);
    } catch (error) {
        return routeErrorHandler(error, req);
    }
};

export const PATCH = async (req: NextRequest, { params }: TParams) => {
    try {
        const data = await req.json();
        createMemberWithUploadSchema.parse(data);
        const user = await currentUserOrThrowAuthError();
        const memberData = {
            ...data,
            updatedBy: user.id,
            picture:
                data.picture && data.picture.startsWith("https://")
                    ? data.picture
                    : generateUserProfileS3URL(
                          data.passbookNumber.toUpperCase()
                      ),
        };
        const updatedMember = await db.eventAttendees.update({
            where: { id: params.memberId },
            data: memberData,
        });
        return NextResponse.json(updatedMember);
    } catch (e) {
        console.log(e);
        return routeErrorHandler(e, req);
    }
};
