import db from "@/lib/database"
import { NextRequest, NextResponse } from "next/server";
import { createBranchSchema } from "@/validation-schema/branch";
import { currentUserOrThrowAuthError } from "@/lib/server-utils";

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
        const user = await currentUserOrThrowAuthError()

        const validation = createBranchSchema.safeParse(data);
        if(!validation.success) 
            return NextResponse.json({ message : validation.error.issues[0].message }, { status : 400 })

        const newBranch = await db.branch.create({ 
            data : { ...validation.data, createdBy : user.id } 
        })

        return NextResponse.json(newBranch)
    }catch(e){
        if (e instanceof AuthenticationError) return NextResponse.json({ message: e.message }, { status : 403 });

        console.error(`ERROR - [POST] - /api/v1/branch : ${e}`)
        return NextResponse.json({ message : "Internal Error : 500"}, { status : 500 })
    }
}