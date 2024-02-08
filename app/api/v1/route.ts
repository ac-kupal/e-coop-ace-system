import { NextRequest, NextResponse } from "next/server";

export const GET = async (req : NextRequest) => {
    try{
        return NextResponse.json("Okie desu 👌")
    }catch(e){
        console.error(`ERR : /api/v1/ - [GET] - ${e}`)
        return NextResponse.json({ message : "Internal Server Error"}, { status : 500 })
    }
}