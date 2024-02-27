import { routeErrorHandler } from "@/errors/route-error-handler";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { generateOTP } from "@/lib/server-utils";
import { TCreateManyMember, TCreateMember } from "@/types";
import { createMemberSchema } from "@/validation-schema/member";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/database"
export const POST = async (req: NextRequest) => {
     try {
        const membersData:TCreateManyMember[]  = await req.json();
        
          // membersData.forEach((member)=>{
          //  createMemberSchema.parse(member)
          // })
        
          console.log(membersData)
     //    const user = await currentUserOrThrowAuthError()

        const newMember = await db.eventAttendees.createMany({
          data:membersData,
          skipDuplicates: true,    
     },)
        return NextResponse.json(newMember)
     } catch (e) {
        return routeErrorHandler(e, req.method);
     }
  };