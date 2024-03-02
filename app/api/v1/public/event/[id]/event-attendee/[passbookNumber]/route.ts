import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { routeErrorHandler } from "@/errors/route-error-handler";
import { attendeeParamsSchema } from "@/validation-schema/event-registration-voting";

type TParams = { params: { id: number; passbookNumber: string } };

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const { id : eventId, passbookNumber } = attendeeParamsSchema.parse(params);

        const memberAttendee = await db.eventAttendees.findUnique({
            select : {
                id : true,
                firstName: true,
                passbookNumber : true,
                middleName: true,
                lastName: true,
                contact: true,
                picture: true,
                registered: true,
                voted: true
            },
            where: {
                eventId_passbookNumber: {
                    eventId,
                    passbookNumber,
                },
            },
        });

        if (!memberAttendee)
            return NextResponse.json(
                { message: "Not found, for verification" },
                { status: 404 }
            );

        return NextResponse.json(memberAttendee);
    } catch (e) {
        console.error(e);
        return routeErrorHandler(e, req);
    }
};