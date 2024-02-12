import db from "@/lib/database"
import { NextRequest, NextResponse } from "next/server";

import { updateBranchSchema } from "@/validation-schema/branch";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { AuthenticationError } from "@/errors/auth-error";

type TParams = { params: { id : number } }

export const PATCH = async ( req : NextRequest, { params }: TParams ) =>{
    try{
        const user = await currentUserOrThrowAuthError();
        const id = Number(params.id); 
        const { data } = await req.json();

        if(!params.id && isNaN(Number(id))) 
            return NextResponse.json({ message : "missing/invalid id on request"}, { status : 400 })

        const validation = updateBranchSchema.safeParse(data)

        if(!validation.success) 
            return NextResponse.json({ message : validation.error.issues[0].message }, { status : 400 })

        const updatedBranch = await db.branch.update({ 
            where : { id }, 
            data : {...validation.data, updatedBy : user.id } 
        })

        return NextResponse.json(updatedBranch)
    }catch(e){
        if (e instanceof AuthenticationError) return NextResponse.json({ message: e.message }, { status : 403 });

        console.error(`ERROR - [PATCH] - /api/v1/branch/[id] : ${e}`)
        return NextResponse.json({ message : "Internal Error : 500"}, { status : 500 })
    }
}

export const DELETE = async ( req : NextRequest, { params } : TParams ) => {
    try{
        const user = await currentUserOrThrowAuthError();
        const id = Number(params.id); 

        if(!params.id && isNaN(Number(id))) 
            return NextResponse.json({ message : "missing/invalid id on request"}, { status : 400 })

        const deletedBranch = await db.branch.update({ 
            where : { id }, 
            data : { 
                deleted : true, 
                deletedAt : new Date(), 
                deletedBy : user.id 
            }})

        return NextResponse.json(deletedBranch)
    }catch(e){
        if (e instanceof AuthenticationError) return NextResponse.json({ message: e.message }, { status : 403 });

        console.error(`ERROR - [PATCH] - /api/v1/branch/[id] : ${e}`)
        return NextResponse.json({ message : "Internal Error : 500"}, { status : 500 })
    }
}