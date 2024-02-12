import db from "@/lib/database"
import { NextRequest, NextResponse } from "next/server"

import { hashPassword } from "@/lib/server-utils"
import { currentUserOrThrowAuthError } from "@/lib/auth"
import { AuthenticationError } from "@/errors/auth-error"
import { updateUserSchema } from "@/validation-schema/user"
import { USER_SELECTS_WITH_NO_PASSWORD } from "@/services/user"

type TParams = { params: { id : number } }

export const GET = async(req : NextRequest, { params } : TParams) => {
    try{
        const user = await currentUserOrThrowAuthError();
        const id = Number(params.id); 

        if(!params.id && isNaN(Number(id))) 
            return NextResponse.json({ message : "missing/invalid id on request"}, { status : 400 })

        const foundUser = await db.user.findUnique({ 
            where : { id }, 
            select : USER_SELECTS_WITH_NO_PASSWORD 
        })

        if(!foundUser) return NextResponse.json({ message : "User not found"}, { status : 404 })


        return NextResponse.json(foundUser)
    }catch(e){
        if (e instanceof AuthenticationError) return NextResponse.json({ message: e.message }, { status : 403 });

        console.error(`ERROR - [PATCH] - /api/v1/user/[id] : ${e}`)
        return NextResponse.json({ message : "Internal Error : 500"}, { status : 500 })
    }
}


export const PATCH = async ( req : NextRequest, { params }: TParams ) =>{
    try{
        const user = await currentUserOrThrowAuthError();
        const id = Number(params.id); 
        const { data } = await req.json();

        if(!params.id && isNaN(Number(id))) 
            return NextResponse.json({ message : "missing/invalid id on request"}, { status : 400 })

        const validation = updateUserSchema.safeParse(data)

        if(!validation.success) 
            return NextResponse.json({ message : validation.error.issues[0].message }, { status : 400 })

        if(validation.data.password) 
            validation.data.password = await hashPassword(validation.data.password)

        const updatedBranch = await db.user.update({ 
            where : { id }, 
            data : {...validation.data, updatedBy : user.id } 
        })

        return NextResponse.json(updatedBranch)
    }catch(e){
        if (e instanceof AuthenticationError) return NextResponse.json({ message: e.message }, { status : 403 });

        console.error(`ERROR - [PATCH] - /api/v1/user/[id] : ${e}`)
        return NextResponse.json({ message : "Internal Error : 500"}, { status : 500 })
    }
}


export const DELETE = async ( req : NextRequest, { params }: TParams ) =>{
    try{
        const user = await currentUserOrThrowAuthError();
        const id = Number(params.id); 

        if(!params.id && isNaN(Number(id))) 
            return NextResponse.json({ message : "missing/invalid id on request"}, { status : 400 })

        const updatedBranch = await db.user.update({ 
            where : { id }, 
            data : { deleted : true, deletedAt : new Date(), deletedBy : user.id } 
        })
        return NextResponse.json(updatedBranch)
    }catch(e){
        if (e instanceof AuthenticationError) return NextResponse.json({ message: e.message }, { status : 403 });

        console.error(`ERROR - [DELETE] - /api/v1/user/[id] : ${e}`)
        return NextResponse.json({ message : "Internal Error : 500"}, { status : 500 })
    }
}