import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { routeErrorHandler } from "@/errors/route-error-handler";
import { attendeeRegisterParamsSchema, eventIdParamSchema } from "@/validation-schema/event-registration-voting";
import { isSameDay } from "date-fns";

type TParams = { params: { id: number } };

export const POST = async (req: NextRequest, { params }: TParams) => {
    try {
        const eventId = eventIdParamSchema.parse(params.id)
        const data = await req.json();

        const { passbookNumber, birthday } = attendeeRegisterParamsSchema.parse(data)
        
        const memberAttendee = await db.eventAttendees.findUnique({
            where: {
                eventId_passbookNumber: {
                    eventId,
                    passbookNumber,
                },
            },
        });

        if (!memberAttendee)
            return NextResponse.json({ message: "Not found, for verification" },{ status: 404 });

        if(!isSameDay(birthday, memberAttendee.birthday)) 
            return NextResponse.json({ message : "Wrong birthday, please try again"}, { status : 403 })

        const registered = await db.eventAttendees.update({
            where: {
                eventId_passbookNumber: {
                    eventId,
                    passbookNumber,
                },
            },
            data : {
                registered : true,
            }
        })

        return NextResponse.json(registered);
    } catch (e) {
        console.error(e);
        return routeErrorHandler(e, req.method);
    }
};