import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { routeErrorHandler } from "@/errors/route-error-handler";
import { attendeeRegisterSchema } from "@/validation-schema/event-registration-voting";
import  { eventIdSchema } from "@/validation-schema/commons"
import { isSameDay } from "date-fns";
import { TMemberAttendeesMinimalInfo } from "@/types";

type TParams = { params: { id: number } };

export const POST = async (req: NextRequest, { params }: TParams) => {
    try {
        const eventId = eventIdSchema.parse(params.id)
        const data = await req.json();

        const { passbookNumber, birthday } = attendeeRegisterSchema.parse(data)
        
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

        const registered : TMemberAttendeesMinimalInfo = await db.eventAttendees.update({
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
            data : {
                registered : true,
            }
        })

        return NextResponse.json(registered);
    } catch (e) {
        console.error(e);
        return routeErrorHandler(e, req);
    }
};