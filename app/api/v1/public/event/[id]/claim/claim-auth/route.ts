import { NextRequest } from "next/server";
import { routeErrorHandler } from "@/errors/route-error-handler"
import { eventIdParamSchema } from "@/validation-schema/api-params"

type TParams = { params : { id : number } }

export const POST = async ( req : NextRequest, { params } : TParams) => {
    try{
        const { id } = eventIdParamSchema.parse(params);

        

    }catch(e){
        return routeErrorHandler(e, req)
    }
}