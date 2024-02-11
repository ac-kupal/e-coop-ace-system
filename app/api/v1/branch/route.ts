import { currentUser } from "@/lib/auth";
import db from "@/lib/database"
import { createBranchSchema } from "@/validation-schema/branch";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
    try{
        const branch = await db.branch.findMany({ where : { deleted : false }, orderBy : { createdAt : "desc" }});
        return NextResponse.json(branch)
    }catch(e){
        console.error(`ERROR - [GET] - /api/v1/branch : ${e}`)
        return NextResponse.json({ message : "Internal Error : 500"}, { status : 500})
    }
}

export const POST = async (req : NextRequest) => {
    try{
        const { data } = await req.json();

        const session = await currentUser()
        if(session === null) return NextResponse.json({ message : "You are not allowed!"}, { status : 403 })
        const user = session.user

        const validation = createBranchSchema.safeParse(data);
        if(!validation.success) 
            return NextResponse.json({ message : validation.error.issues[0].message }, { status : 400 })

        const newBranch = await db.branch.create({ 
            data : { ...validation.data, createdBy : user.id } 
        })

        return NextResponse.json(newBranch)
    }catch(e){
        console.error(`ERROR - [POST] - /api/v1/branch : ${e}`)
        return NextResponse.json({ message : "Internal Error : 500"}, { status : 500 })
    }
}