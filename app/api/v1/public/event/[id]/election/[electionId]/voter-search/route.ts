import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { eventElectionParamsSchema, voterSearchParamSchema  } from "@/validation-schema/event-registration-voting";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { searchParamsEntries } from "@/lib/server-utils";
import { TMemberAttendeesMinimalInfo } from "@/types";

type TParams = { params: { id: number, electionId : number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const { id : eventId, electionId } = eventElectionParamsSchema.parse(params); 
        const entries = searchParamsEntries(new URL(req.url).searchParams);

        const { passbookNumber } = voterSearchParamSchema.parse(entries);

        const election = await db.election.findUnique({ where : { id : electionId } })

        if(!election) return NextResponse.json({ message : "Invalid election, please go back"}, { status : 400 });

        const voter : TMemberAttendeesMinimalInfo | null = await db.eventAttendees.findUnique({
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
                    passbookNumber,
                    eventId,
                },
            },
        });

        if (!voter)
            return NextResponse.json(
                { message: "voter not found, for verification" },
                { status: 404 }
            );

        return NextResponse.json(voter);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};
