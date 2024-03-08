import db from "@/lib/database";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { currentUserOrThrowAuthError } from "@/lib/auth";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdParamSchema } from "@/validation-schema/api-params";
import { createAssistedClaimSchema } from "@/validation-schema/incentive";

type TParams = { params: { id: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const { id: eventId } = eventIdParamSchema.parse(params);
        const currentUser = await currentUserOrThrowAuthError();

        const where = currentUser.role === "staff" ? { eventId, assistedById : currentUser.id } : { eventId }

        const claimMasterList = await db.incentiveClaims.findMany({
            where,
            select: {
                id: true,
                eventId: true,
                createdAt: true,
                eventAttendeeId: true,
                eventAttendee: {
                    select: {
                        passbookNumber: true,
                        firstName: true,
                        lastName: true,
                        registered: true,
                    },
                },
                incentive : {
                    select : {
                        id : true,
                        itemName : true
                    }
                },
                assistedBy: {
                    select: {
                        id: true,
                        picture: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return NextResponse.json(claimMasterList);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

export const POST = async (req: NextRequest, { params }: TParams) => {
    try {
        const { id: eventId } = eventIdParamSchema.parse(params);
        const currentUser = await currentUserOrThrowAuthError();

        const { claims } = createAssistedClaimSchema.parse(await req.json());

        const createAssistClaims = await db.incentiveClaims.createMany({
            data: claims.map((claimEntry) => ({
                ...claimEntry,
                eventId,
                assistedById: currentUser.id,
                createdBy: currentUser.id,
            })),
        });

        return NextResponse.json(createAssistClaims);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2003") {
                return NextResponse.json(
                    {
                        message:
                            "Can't create claim, as possibly one of these (member, event, incentive) is missing. Please reload the page and try again.",
                    },
                    { status: 400 }
                );
            }
        }
        return routeErrorHandler(e, req);
    }
};
