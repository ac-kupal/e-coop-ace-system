import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { TMemberAttendeesMinimalInfo } from "@/types";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdParamSchema } from "@/validation-schema/api-params";
import { memberAttendeeSearchSchema } from "@/validation-schema/event-registration-voting";

type TParams = { params: { id: number } };

export const POST = async (req: NextRequest, { params }: TParams) => {
    try {
        const { id: eventId } = eventIdParamSchema.parse(params);

        const { passbookNumber, nameSearch } = memberAttendeeSearchSchema.parse(
            await req.json()
        );

        let result: TMemberAttendeesMinimalInfo[] = [];

        if (passbookNumber) {
            result = await db.eventAttendees.findMany({
                select: {
                    id: true,
                    firstName: true,
                    passbookNumber: true,
                    middleName: true,
                    lastName: true,
                    contact: true,
                    picture: true,
                    registered: true,
                    voted: true,
                },
                where: {
                    eventId,
                    passbookNumber,
                },
            });
        } else if (nameSearch) {
            result = await db.eventAttendees.findMany({
                select: {
                    id: true,
                    firstName: true,
                    passbookNumber: true,
                    middleName: true,
                    lastName: true,
                    contact: true,
                    picture: true,
                    registered: true,
                    voted: true,
                },
                where: {
                    OR: nameSearch.split(" ").map(term => ({
                        OR: [
                            { firstName: { equals: term, mode: "insensitive" } },
//                            { middleName: { contains: term, mode: "insensitive" } },
                            { lastName: { equals: term, mode: "insensitive" } }
                        ]
                    }))
                },
            });
        }else{
            return NextResponse.json({ message : "passbook or name search was not provided"}, { status : 400 })
        }

        if (result.length === 0)
            return NextResponse.json(
                { message: "Not found, for verification" },
                { status: 404 }
            );

        return NextResponse.json(result);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};
