import db from "@/lib/database"
import { NextRequest, NextResponse } from "next/server"
import { currentUserOrThrowAuthError } from "@/lib/auth"

import { routeErrorHandler } from "@/errors/route-error-handler"
import { eventIdParamSchema } from "@/validation-schema/commons"

type TParams = { params : { id : number }}

export const GET = async (req : NextRequest, { params } : TParams) => {
    try{
        const eventId = eventIdParamSchema.parse(params.id)
        const user = await currentUserOrThrowAuthError();

        const assignedIncentives = await db.incentives.findMany({
            where : {
                eventId,
                assigned : {
                    every : {
                        userId : user.id
                    }
                } 
            }
        })

        return NextResponse.json(assignedIncentives)
    }catch(e){
        return routeErrorHandler(e, req)
    }
}