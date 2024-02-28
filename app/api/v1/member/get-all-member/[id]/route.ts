import { NextRequest, NextResponse } from "next/server"
import db from '@/lib/database'
import { validate } from "uuid";
import { validateId } from "@/lib/server-utils";
import { routeErrorHandler } from "@/errors/route-error-handler";

type TParams = { params: { id: number } };


export const GET = async(req:NextRequest,{params}:TParams)=>{
     try {
     const id  = Number(params.id)
     validateId(id)
     const getAllFilteredMembers = await db.eventAttendees.findMany({where:{
          eventId:id
     }})
      return NextResponse.json(getAllFilteredMembers)
     } catch (e) {
          routeErrorHandler(e,req.method)
     }
}