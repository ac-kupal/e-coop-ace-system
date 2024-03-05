import { routeErrorHandler } from "@/errors/route-error-handler"
import { currentUserOrThrowAuthError } from "@/lib/auth"
import { createMemberSchema } from "@/validation-schema/member"
import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/database"
type TParams = { params: { id: number, memberId:string } };


export const DELETE = async function name(req:NextRequest,{params}:TParams) {
     try {
      const memberId = params.memberId
      console.log(memberId)
      const deletePosition = await db.eventAttendees.delete({where:{id:memberId}})
      return NextResponse.json(deletePosition)     
      } catch (error) {
        return routeErrorHandler(error,req)
      }
 }

 export const PATCH = async (req: NextRequest,{params}:TParams) => {
  try {
     const data  = await req.json();
     console.log(data)
     createMemberSchema.parse(data)
     const user = await currentUserOrThrowAuthError()
     const memberData = {...data,updatedBy:user.id}
     const updatedMember = await db.eventAttendees.update({where:{id:params.memberId},data:memberData})
     return NextResponse.json(updatedMember)
  } catch (e) {
     console.log(e)
     return routeErrorHandler(e, req);
  }
};
 