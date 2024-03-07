import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { currentUserOrThrowAuthError } from "@/lib/auth";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { updateIncentiveSchema } from "@/validation-schema/incentive";
import { eventAndIncentiveParamSchema } from "@/validation-schema/api-params";

type TParams = { params: { id: number; incentiveId: number } };

export const PATCH = async (req: NextRequest, { params }: TParams) => {
  try {
    const user = await currentUserOrThrowAuthError();
    const { id: eventId, incentiveId } = eventAndIncentiveParamSchema.parse(params);
    
    const unparsedData = await req.json();
    console.log("REceiven", unparsedData, updateIncentiveSchema)
    const data = updateIncentiveSchema.parse(unparsedData);

    const updatedIncentives = await db.incentives.update({
      where: { eventId, id: incentiveId },
      data: {
        ...data,
        updatedBy: user.id,
      },
    });

    return NextResponse.json(updatedIncentives);
  } catch (e) {
    return routeErrorHandler(e, req);
  }
};

export const DELETE = async (req: NextRequest, { params }: TParams) => {
  try {
    const user = currentUserOrThrowAuthError();
    const { id: eventId, incentiveId } = eventAndIncentiveParamSchema.parse(params);

    const incentive = await db.incentives.findUnique({
      where: {
        id: incentiveId,
        eventId,
        claimed: {
          none: {},
        },
      },
    });

    if (!incentive)
      return NextResponse.json(
        { message: "This incentive are not removable anymore" },
        { status: 403 },
      );

    const deletedIncentive = await db.incentives.delete({ where : { id : incentiveId } })

    return NextResponse.json("Incentive deleted");
  } catch (e) {
    return routeErrorHandler(e, req);
  }
};
