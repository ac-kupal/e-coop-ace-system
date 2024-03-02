import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdParamSchema } from "@/validation-schema/commons";

type TParams = { params: { id: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const eventId = eventIdParamSchema.parse(params.id);

        const eventAttendees = await db.eventAttendees.findMany({
            where: { eventId, registered: true },
            include: {
                registeredBy: {
                    select: {
                        id: true,
                        picture: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return NextResponse.json(eventAttendees);
    } catch (e) {
        routeErrorHandler(e, req.method);
    }
};
