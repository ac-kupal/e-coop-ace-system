//delete Position
import { validateId } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";
import db from '@/lib/database'
import { routeErrorHandler } from "@/errors/route-error-handler";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { createMemberSchema } from "@/validation-schema/member";
type TParams = { params: { id: string } };


export const DELETE = async function name(req:NextRequest,{params}:TParams) {
     try {
      const memberId = params.id
      const deletePosition = await db.eventAttendees.delete({where:{id:memberId}})
      return NextResponse.json(deletePosition)     
      } catch (error) {
        return routeErrorHandler(error,req.method)
      }
 }


 export const PATCH = async (req: NextRequest,{params}:TParams) => {
  try {
     const data  = await req.json();
     createMemberSchema.parse(data)
     const user = await currentUserOrThrowAuthError()
     const memberData = {...data,updatedBy:user.id}
     const updatedMember = await db.eventAttendees.update({where:{id:params.id},data:memberData})
     return NextResponse.json(updatedMember)
  } catch (e) {
     console.log(e)
     return routeErrorHandler(e, req.method);
  }
};
 