import { NextRequest, NextResponse } from "next/server";

import { testdts } from "@/validation-schema/testzd";
import { routeErrorHandler } from "@/errors/route-error-handler";


export const POST = async (req : NextRequest) => {
    try{
        const jsons = await req.json();
        console.log("BEFORE VALIDATED", jsons)
        const validated = testdts.parse(jsons)

        console.log("AFTER VALIDATED", validated)

        return NextResponse.json(validated);
    }catch(e){
        return routeErrorHandler(e, req)
    }
}