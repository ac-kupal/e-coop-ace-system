import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { currentUserOrThrowAuthError } from "@/lib/auth";
import { createCoopSchema } from "@/validation-schema/coop";
import { routeErrorHandler } from "@/errors/route-error-handler";

export const GET = async (req: NextRequest) => {
  try {
    await currentUserOrThrowAuthError();

    const cooperatives = await db.coop.findMany({
      include: {
        branches: true,
      },
    });

    return NextResponse.json(cooperatives);
  } catch (e) {
    return routeErrorHandler(e, req);
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const currentUser = await currentUserOrThrowAuthError();

    const data = createCoopSchema.parse(await req.json());

    const cooperative = await db.coop.create({
      data: {
        ...data,
        createdBy: currentUser.id,
        updatedBy: currentUser.id,
      },
    });

    return NextResponse.json(cooperative);
  } catch (e) {
    return routeErrorHandler(e, req);
  }
};
