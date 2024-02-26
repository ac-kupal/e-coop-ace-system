import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { eventElectionParamsSchema, voterSearchParamSchema  } from "@/validation-schema/event-registration-voting";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { searchParamsEntries } from "@/lib/server-utils";

type TParams = { params: { id: number, passbookNumber : number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const { id : eventId } = eventElectionParamsSchema.parse(params); 
        const entries = searchParamsEntries(new URL(req.url).searchParams);

        const { passbookNumber } = voterSearchParamSchema.parse(entries);

        const voter = await db.eventAttendees.findUnique({
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

        // TODO : Check if allowed to vote, depends on election settings

        return NextResponse.json(voter);
    } catch (e) {
        return routeErrorHandler(e, req.method);
    }
};
