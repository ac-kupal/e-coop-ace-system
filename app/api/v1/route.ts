import { NextRequest, NextResponse } from "next/server";

export const POST = async (req:NextRequest)=>{
    try {
       return NextResponse.json({message:"POST - ok"})
    } catch (error) {
        console.log(error)
    }
}