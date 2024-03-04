import db from "@/lib/database"
import { routeErrorHandler } from "@/errors/route-error-handler";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { eventIdParamSchema } from "@/validation-schema/commons";
import { NextRequest, NextResponse } from "next/server";
import { eventAndIncentiveParamSchema } from "@/validation-schema/api-params";

type TParams = { params : { id : number, incentiveId : number }}

// all asignee for this specific incentive
export const GET = async (req: NextRequest, { params }: TParams) => {
    try{
        const { id : eventId, incentiveId } = eventAndIncentiveParamSchema.parse(params)

        const currentUser = await currentUserOrThrowAuthError();
        
        const incentiveAssigned = await db.incentiveAssigned.findMany({
            where : {
                eventId, 
                userId : currentUser.id,
                deleted : false
            }
        })

        return NextResponse.json(incentiveAssigned)
    }catch(e){
        return routeErrorHandler(e, req)
    }
}