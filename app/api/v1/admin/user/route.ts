import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { hashPassword } from "@/lib/server-utils";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { createUserSchema } from "@/validation-schema/user";
import { USER_SELECTS_WITH_NO_PASSWORD } from "@/services/user";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { Role } from "@prisma/client";

export const GET = async (req: NextRequest) => {
  try {
    const currentUser = await currentUserOrThrowAuthError();

    const higherRoles: Role[] = [Role.root, Role.coop_root];

    const conditions = higherRoles.includes(currentUser.role as Role)
      ? {}
      : { branchId: currentUser.branchId };

    const users = await db.user.findMany({
      where: { deleted: false, ...conditions },
      orderBy: { createdAt: "desc" },
      select: USER_SELECTS_WITH_NO_PASSWORD,
    });
    return NextResponse.json(users);
  } catch (e) {
    return routeErrorHandler(e, req);
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const user = await currentUserOrThrowAuthError();
    const { data } = await req.json();

    const validatedData = createUserSchema.parse(data);
    if (validatedData.password)
      validatedData.password = await hashPassword(validatedData.password);

    const branch = await db.branch.findUnique({
      where: { id: validatedData.branchId },
    });

    if (!branch)
      return NextResponse.json(
        { message: "Selected branch does not exist, try again" },
        { status: 404 },
      );

    const newUser = await db.user.create({
      data: { ...validatedData, createdBy: user.id, coopId: branch.coopId },
    });

    return NextResponse.json(newUser);
  } catch (e) {
    return routeErrorHandler(e, req);
  }
};
