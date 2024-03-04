import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { currentUserOrThrowAuthError } from "@/lib/auth";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdSchema } from "@/validation-schema/commons";
import { createIncentiveSchema } from "@/validation-schema/incentive";

type TParams = { params: { id: number } }

export const GET = async (
  req: NextRequest,
  { params }: TParams,
) => {
  try {
    await currentUserOrThrowAuthError();
    const eventId = eventIdSchema.parse(params.id);

    const claimsWithClaimAndAssignedCount = await db.incentives.findMany({
      where: { eventId },
      include: {
        _count: {
          select: { claimed : true, assigned : true }, 
        },
      },
    });

    return NextResponse.json(claimsWithClaimAndAssignedCount);
  } catch (e) {
    return routeErrorHandler(e, req);
  }
};

export const POST = async (req :NextRequest, { params } : TParams) => {
    try{
        const user = await currentUserOrThrowAuthError();
        const eventId = eventIdSchema.parse(params.id);
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
        return routeErrorHandler(e, req);
    }
}
