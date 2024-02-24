import { validateId } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";
import db from '@/lib/database'
import { routeErrorHandler } from "@/errors/route-error-handler";
import { createPositionSchema, updatePositionSchema } from "@/validation-schema/position";
import { handlePrivateRoute } from "../../hadle-private-route";
type TParams = { params: { id: number } };

//delete Position
export const DELETE = async function name(req:NextRequest,{params}:TParams) {
    try {
     await handlePrivateRoute()
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
  try {
    await handlePrivateRoute()
    const electionId = Number(params.id)
    validateId(electionId)
    const getAllPosition = await db.position.findMany({where:{electionId:electionId}});
    return NextResponse.json(getAllPosition);
 } catch (error) {
    return routeErrorHandler(error, req.method);
 }
     
}
//update specific Position
export const PATCH = async function name(req:NextRequest,{params}:TParams) {
  try {
    await handlePrivateRoute()
    const positionId = Number(params.id)
    const positionToUpdate = await req.json()
    updatePositionSchema.parse(positionToUpdate)
    validateId(positionId)
    const deletePosition = await db.position.update({
      where:{id:positionId},
       data:positionToUpdate 
    })
    return NextResponse.json(deletePosition)     
    } catch (error) {
      return routeErrorHandler(error,req.method)
    }
}
