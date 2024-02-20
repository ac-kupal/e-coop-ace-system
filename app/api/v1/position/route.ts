import { NextRequest, NextResponse } from "next/server";


export const POST = async (req:NextRequest) => {

     const {data} = await req.json()


     return NextResponse.json({message:"POST - ok"})
}

export const GET = async (req:NextRequest) => {
     return NextResponse.json({message:"GET - ok"})
}

export const PATCH = async (req:NextRequest) => {
     return NextResponse.json({message:"PATCH - ok"})
}

export const DELETE = async (req:NextRequest) => {
     return NextResponse.json({message:"DELETE - ok"})
}