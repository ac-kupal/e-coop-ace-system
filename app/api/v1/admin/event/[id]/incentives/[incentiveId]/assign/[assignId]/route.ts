import db from "@/lib/database"
import { NextRequest, NextResponse } from "next/server";

import { currentUserOrThrowAuthError } from "@/lib/auth";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { incentiveIdAndAssignIdParamSchema } from "@/validation-schema/api-params";
import { assignIncentiveSchema, updateIncentiveAssignedSchema } from "@/validation-schema/incentive";

type TParams = {
    params : {
        incentiveId : number,
        assignId : number
    }
}

export const PATCH = async (req : NextRequest, { params } : TParams ) => {
    try{
        const { assignId, incentiveId } = incentiveIdAndAssignIdParamSchema.parse(params);
        const currentUser = await currentUserOrThrowAuthError();

        const updateData = updateIncentiveAssignedSchema.parse(await req.json());

        const updatedAssigned = await db.incentiveAssigned.update({
            where : { id : assignId, incentiveId },
            data : { 
                ...updateData,
                updatedBy : currentUser.id
            } 
        })

        return NextResponse.json(updatedAssigned)
    }catch(e){
        return routeErrorHandler(e, req)
    }
}

export const DELETE = async ( req : NextRequest, { params } : TParams ) => {
    try{
        const { assignId, incentiveId } = incentiveIdAndAssignIdParamSchema.parse(params)
        await currentUserOrThrowAuthError();

        const deleteAssignEntry = await db.incentiveAssigned.delete({ where : { id : assignId, incentiveId }})
        
        return NextResponse.json("Removed assigned incentive")
    }catch(e){
        return routeErrorHandler(e, req)
    }
}