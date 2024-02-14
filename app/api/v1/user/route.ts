import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { hashPassword } from "@/lib/server-utils";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { createUserSchema } from "@/validation-schema/user";
import { USER_SELECTS_WITH_NO_PASSWORD } from "@/services/user";
import { routeErrorHandler } from "@/errors/route-error-handler";

export const GET = async (req : NextRequest) => {
    try {
        const users = await db.user.findMany({
            where: { deleted: false },
            orderBy: { createdAt: "desc" },
            select: USER_SELECTS_WITH_NO_PASSWORD,
        });
        return NextResponse.json(users);
    } catch (e) {
        return routeErrorHandler(e, req.method)
    }
};

export const POST = async (req: NextRequest) => {
    try {
        const user = await currentUserOrThrowAuthError();
        const { data } = await req.json();

        const validatedData = createUserSchema.parse(data);
        if(validatedData.password) 
            validatedData.password = await hashPassword(validatedData.password);

        const newUser = await db.user.create({
            data: { ...validatedData, createdBy: user.id },
        });

        return NextResponse.json(newUser);
    } catch (e) {
        return routeErrorHandler(e, req.method)
    }
};
