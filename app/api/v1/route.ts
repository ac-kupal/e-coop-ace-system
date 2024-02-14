import { routeErrorHandler } from "@/errors/route-error-handler";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req : NextRequest) => {
    try{
        return NextResponse.json("Okie desu 👌")
    }catch(e){
        return routeErrorHandler(e, req.method)
    }
}