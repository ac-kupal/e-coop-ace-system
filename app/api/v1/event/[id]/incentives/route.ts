import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { currentUserOrThrowAuthError } from "@/lib/auth";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdParamSchema } from "@/validation-schema/event-registration-voting";
import { createIncentiveSchema } from "@/validation-schema/incentive";

type TParams = { params: { id: number } }

export const GET = async (
  req: NextRequest,
  { params }: TParams,
) => {
  try {
    await currentUserOrThrowAuthError();
    const eventId = eventIdParamSchema.parse(params.id);

    const claimsWithClaimCount = await db.incentives.findMany({
      where: { eventId },
      include: {
        _count: {
          select: { claimed : true },
        },
      },
    });

    return NextResponse.json(claimsWithClaimCount);
  } catch (e) {
    return routeErrorHandler(e, req.method);
  }
};

export const POST = async (req :NextRequest, { params } : TParams) => {
    try{
        const user = await currentUserOrThrowAuthError();
        const eventId = eventIdParamSchema.parse(params.id);
        let { data } = await req.json();

        data = createIncentiveSchema.parse(data);

        const newIncentive = await db.incentives.create({
            data : {
                ...data, 
                eventId,
                createdBy : user.id
            }
        })

        return NextResponse.json(newIncentive)
    }catch(e){
        return routeErrorHandler(e, req.method);
    }
}
