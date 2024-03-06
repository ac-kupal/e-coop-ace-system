import { NextRequest, NextResponse } from "next/server"

import { routeErrorHandler } from "@/errors/route-error-handler"
import { eventIdParamSchema } from "@/validation-schema/api-params"
import { revokeClaimAuth } from "../service"

type TParams = { params : { id : number }}

export const DELETE = async ( req : NextRequest, { params } : TParams ) => {
    try{
        const { id } = eventIdParamSchema.parse(params);

        const response = NextResponse.json("Revoked");
        revokeClaimAuth(response)
        
        return response;
    }catch(e){
        return routeErrorHandler(e, req)
    }
}