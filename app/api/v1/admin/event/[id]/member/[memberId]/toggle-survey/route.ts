import z from "zod";
import { NextRequest, NextResponse } from "next/server";

import db from "@/lib/database";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { memberToggleSurveyedSchema } from "@/validation-schema/member";

type TParams = { params: { id: number; memberId: string } };

export const PATCH = async (req: NextRequest, { params }: TParams) => {
    try {
        await currentUserOrThrowAuthError();

        const data = await memberToggleSurveyedSchema.parseAsync(await req.json());

        const updatedMember = await db.eventAttendees.update({
            where: { id: params.memberId },
            include: {
                event: {
                    select: {
                        election: {
                            select: { id: true },
                        },
                    },
                },
            },
            data,
        });

        return NextResponse.json(updatedMember);
    } catch (e) {
        console.log(e);
        return routeErrorHandler(e, req);
    }
};
