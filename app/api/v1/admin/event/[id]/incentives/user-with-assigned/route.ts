import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { currentUserOrThrowAuthError } from "@/lib/auth";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdSchema } from "@/validation-schema/commons";

type TParams = { params: { id: number } }

export const GET = async (
  req: NextRequest,
  { params }: TParams,
) => {
  try {
    await currentUserOrThrowAuthError();
    const eventId = eventIdSchema.parse(params.id);

    const usersWithAssignedIncentives = await db.user.findMany({
      include: {
        assignedIncentive : {
            where : {
                eventId
            }
        }
      },
    });

    return NextResponse.json(usersWithAssignedIncentives);
  } catch (e) {
    return routeErrorHandler(e, req);
  }
};
