import db from "@/lib/database"
import { NextRequest, NextResponse } from "next/server";

import { currentUserOrThrowAuthError } from "@/lib/auth";
import { routeErrorHandler } from "@/errors/route-error-handler"
import { eventIncentiveParamsSchema, updateIncentiveSchema } from "@/validation-schema/incentive";

type TParams = { params: { id: number, incentiveId : number } }

export const PATCH = async ( req : NextRequest, { params } : TParams ) => {
    try{
        const user = await currentUserOrThrowAuthError();

        const { id : eventId, incentiveId } = eventIncentiveParamsSchema.parse(params);

        const { data : unparsedData } = await req.json();
        const data = updateIncentiveSchema.parse(unparsedData);

        const updatedIncentives = await db.incentives.update({
            where : { eventId, id : incentiveId },
            data : {
                ...data,
                updatedBy : user.id
            } 
        })
        
        return NextResponse.json(updatedIncentives);
    }catch(e){
        return routeErrorHandler(e, req.method);
    }
}
