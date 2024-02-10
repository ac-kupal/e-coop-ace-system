import db from "@/lib/database"
import { createBranchSchema } from "@/validation-schema/branch";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
    try{
        const branch = await db.branch.findMany();
        return NextResponse.json(branch)
    }catch(e){
        console.error(`ERROR - [GET] - /api/v1/branch : ${e}`)
        return NextResponse.json({ message : "Internal Error : 500"})
    }
}

export const POST = async (req : NextRequest) => {
    try{
        const { data } = await req.json();
        const validation = createBranchSchema.safeParse(data);
        if(!validation.success) 
            return NextResponse.json({ message : validation.error.issues[0].message }, { status : 400 })

        const newBranch = await db.branch.create({ data : validation.data })

        return NextResponse.json(newBranch)
    }catch(e){
        console.error(`ERROR - [POST] - /api/v1/branch : ${e}`)
        return NextResponse.json({ message : "Internal Error : 500"})
    }
}