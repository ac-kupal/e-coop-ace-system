import { validateId } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";
import db from '@/lib/database'
import { routeErrorHandler } from "@/errors/route-error-handler";
type TParams = { params: { id: number } };

//delete Position
export const DELETE = async function name(req:NextRequest,{params}:TParams) {
    try {
     const positionId = Number(params.id)
     validateId(positionId)
     const deletePosition = await db.position.delete({where:{id:positionId}})
     return NextResponse.json(deletePosition)     
     } catch (error) {
       return routeErrorHandler(error,req.method)
     }
}

//get Specific Position
export const GET = async function name(req:NextRequest,{params}:TParams) {
     
}
//update specific Position
export const PATCH = async function name(req:NextRequest,{params}:TParams) {
     
}
