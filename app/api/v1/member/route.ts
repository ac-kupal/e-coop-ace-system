import { routeErrorHandler } from "@/errors/route-error-handler";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { createElectionValidation } from "@/validation-schema/election";
import { createEventSchema } from "@/validation-schema/event";
import { ElectionStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { createEvent } from "../event/_services/events";
import db from '@/lib/database'


export const POST = async (req: NextRequest) => {
     try {
        const { data } = await req.json();
        
        const user = await currentUserOrThrowAuthError()
        
     } catch (e) {
        return routeErrorHandler(e, req.method);
     }
  };

export const GET =async (req: NextRequest) => {
   try{
      const getAllMember =await db.eventAttendees.findMany({})
      console.log(getAllMember)
      return NextResponse.json(getAllMember)
   }catch(e){
      return routeErrorHandler(e, req.method);
   }
}