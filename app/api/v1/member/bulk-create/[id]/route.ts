import { routeErrorHandler } from "@/errors/route-error-handler";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { generateOTP, validateId } from "@/lib/server-utils";
import { TCreateManyMember, TCreateMember } from "@/types";
import { createManySchema, createMemberSchema } from "@/validation-schema/member";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/database";
import moment, { Moment } from "moment";
import middleware from "@/middleware";
import { passbookNumber } from "@/validation-schema/event-registration-voting";
type TParams = { params: { id: number } };

const ExcelDateToJSDate = (date: number) => {
   if(date === undefined) return null
   if (date < -657434 || date > 2958465) {
      return null
   }
   return new Date(Math.round((date - 25569) * 864e5));
};

export const POST = async (req: NextRequest, { params }: TParams) => {
   try {
      const id = Number(params.id);
      validateId(id);
      const user = await currentUserOrThrowAuthError();
      const membersData = await req.json();
      const modifiedMembersData = membersData.map(
         (member:any) => {
            const date = new Date()
            return {
               ...member,
               passbookNumber:member.passbookNumber.toString(),
               createdBy: user.id,
               birthday: ExcelDateToJSDate(member.birthday) === null ? date : ExcelDateToJSDate(member.birthday),
               eventId: id,
               middleName:!member.middleName ? "middleName": member.middleName,
               emailAddress: !member.emailAddress ? null : member.emailAddress,
               contact: !member.contact ? "" : member.contact.toString(),
               voteOtp: generateOTP(6),
            };
         }
      );
      modifiedMembersData.forEach((member:any) => {
         createManySchema.parse(member);
      });
      const newMember = await db.eventAttendees.createMany({
         data: modifiedMembersData,
         skipDuplicates: true,
      });
      return NextResponse.json(newMember);
   } catch (e) {
      return routeErrorHandler(e, req.method);
   }
};
