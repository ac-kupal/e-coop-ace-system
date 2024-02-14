import db from "@/lib/database"
import { NextRequest, NextResponse } from "next/server";

import { currentUserOrThrowAuthError } from "@/lib/auth";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { updateBranchSchema } from "@/validation-schema/branch";

type TParams = { params: { id : number } }

export const PATCH = async ( req : NextRequest, { params }: TParams ) =>{
    try{
        const user = await currentUserOrThrowAuthError();
        const id = Number(params.id); 
        const { data } = await req.json();

        if(!params.id && isNaN(Number(id))) 
            return NextResponse.json({ message : "missing/invalid id on request"}, { status : 400 })

        const validatedData = updateBranchSchema.parse(data)

        const updatedBranch = await db.branch.update({ 
            where : { id }, 
            data : {...validatedData, updatedBy : user.id } 
        })

        return NextResponse.json(updatedBranch)
    }catch(e){
        return routeErrorHandler(e, req.method)
    }
}

export const DELETE = async ( req : NextRequest, { params } : TParams ) => {
    try{
        const user = await currentUserOrThrowAuthError();
        const id = Number(params.id); 

        if(!params.id && isNaN(Number(id))) 
            return NextResponse.json({ message : "missing/invalid id on request"}, { status : 400 })

        const deletedBranch = await db.branch.update({ 
            where : { id }, 
            data : { 
                deleted : true, 
                deletedAt : new Date(), 
                deletedBy : user.id 
            }})

        return NextResponse.json(deletedBranch)
    }catch(e){
        return routeErrorHandler(e, req.method)
    }
}