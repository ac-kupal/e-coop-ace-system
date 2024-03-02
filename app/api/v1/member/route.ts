import { routeErrorHandler } from "@/errors/route-error-handler";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/database";
import { createMemberSchema } from "@/validation-schema/member";
import { generateOTP } from "@/lib/server-utils";

export const POST = async (req: NextRequest) => {
   try {
      const data = await req.json();
      const date = new Date(data.birthday);
      const newBirthday = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));


      const user = await currentUserOrThrowAuthError();

      const memberData = {
         ...data,
         createdBy: user.id,
         voteOtp: generateOTP(6),
         birthday: newBirthday,
      };

      createMemberSchema.parse(memberData);
      
      const newMember = await db.eventAttendees.create({ data: memberData });

      return NextResponse.json(newMember);
   } catch (e) {
      return routeErrorHandler(e, req);
   }
};

export const GET = async (req: NextRequest) => {
   try {
      const getAllMember = await db.eventAttendees.findMany({});
      console.log(getAllMember);
      return NextResponse.json(getAllMember);
   } catch (e) {
      return routeErrorHandler(e, req);
   }
};
