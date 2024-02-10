import db from "@/lib/database"
import { NextResponse } from "next/server";

export const GET = async () => {
    try{
        const users = await db.branch.findMany();
        return NextResponse.json(users)
    }catch(e){
        console.error(`ERROR - [GET] - /api/v1/branch : ${e}`)
        return NextResponse.json({ message : "Internal Error : 500"})
    }
}
