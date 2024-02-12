import db from "@/lib/database"
import { NextRequest, NextResponse } from "next/server"

import { hashPassword } from "@/lib/server-utils";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { AuthenticationError } from "@/errors/auth-error";
import { createUserSchema } from "@/validation-schema/user";
import { USER_SELECTS_WITH_NO_PASSWORD } from "@/services/user";

export const GET = async () => {
    try{
        const users = await db.user.findMany({ 
            where : { deleted : false },
            orderBy : { createdAt : "desc"},
            select : USER_SELECTS_WITH_NO_PASSWORD
        })
        return NextResponse.json(users)
    }catch(e){
        console.error(`ERROR - [GET] - /api/v1/user : ${e}`)
        return NextResponse.json({ message : "Internal Error : 500"})
    }
}

export const POST = async (req : NextRequest) => {
    try{
        const user = await currentUserOrThrowAuthError();
        const { data } = await req.json();

        const validation = createUserSchema.safeParse(data);

        if(!validation.success) 
            return NextResponse.json({ message : validation.error.issues[0].message }, { status : 400 })

        validation.data.password = await hashPassword(validation.data.password)

        const newUser = await db.user.create({ data : { ...validation.data, createdBy : user.id } })

        return NextResponse.json(newUser)
    }catch(e){
        if (e instanceof AuthenticationError) return NextResponse.json({ message: e.message }, { status : 403 });

        console.error(`ERROR - [POST] - /api/v1/user : ${e}`)
        return NextResponse.json({ message : "Internal Error : 500"})
    }
}
