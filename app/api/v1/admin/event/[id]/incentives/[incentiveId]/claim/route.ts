import db from "@/lib/database"
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server"

import { currentUserOrThrowAuthError } from "@/lib/auth"
import { routeErrorHandler } from "@/errors/route-error-handler"
import { eventAndIncentiveParamSchema } from "@/validation-schema/api-params";
import { createIncentiveClaimAssistSchema } from "@/validation-schema/incentive";

type TParams = { params: { id: number; incentiveId: number } };

export const POST = async (req : NextRequest, { params } : TParams ) => {
    try{
        const { id : eventId, incentiveId } = eventAndIncentiveParamSchema.parse(params)
        const currentUser = await currentUserOrThrowAuthError();

        const data = createIncentiveClaimAssistSchema.parse(await req.json())

        const createClaims = await db.incentiveClaims.create({
            data : {
                ...data,
                eventId,
                incentiveId,
                createdBy : currentUser.id 
            } 
        })

        return NextResponse.json(createClaims);
    }catch(e){
        if(e instanceof Prisma.PrismaClientKnownRequestError){
            if(e.code === "P2003"){
                return NextResponse.json({ message : "Can't create claim, as possibly one of these (member, event, incentive) is missing. Please reload the page and try again."}, { status : 400 })
            }
        } 
        return routeErrorHandler(e, req)
    }
}