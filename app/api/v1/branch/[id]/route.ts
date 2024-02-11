import db from "@/lib/database"
import { NextRequest, NextResponse } from "next/server";

import { currentUser } from "@/lib/auth";
import { updateBranchSchema } from "@/validation-schema/branch";

type TParams = { params: { id : number } }

export const PATCH = async ( req : NextRequest, { params }: TParams ) =>{
    try{
        const id = Number(params.id); 
        const { data } = await req.json();

        const session = await currentUser()
        if(session === null) return NextResponse.json({ message : "You are not allowed!"}, { status : 403 })
        const user = session.user

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
        console.error(`ERROR - [PATCH] - /api/v1/branch/[id] : ${e}`)
        return NextResponse.json({ message : "Internal Error : 500"}, { status : 500 })
    }
}

export const DELETE = async ( req : NextRequest, { params } : TParams ) => {
    try{
        const id = Number(params.id); 
        const session = await currentUser()

        if(session === null) return NextResponse.json({ message : "You are not allowed!"}, { status : 403 })
        const user = session.user

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
        console.error(`ERROR - [PATCH] - /api/v1/branch/[id] : ${e}`)
        return NextResponse.json({ message : "Internal Error : 500"}, { status : 500 })
    }
}