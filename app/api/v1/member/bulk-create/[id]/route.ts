import { routeErrorHandler } from "@/errors/route-error-handler";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { ExcelDateToJSDate, generateOTP, validateId } from "@/lib/server-utils";
import { createManySchema } from "@/validation-schema/member";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/database";
type TParams = { params: { id: number } };


export const POST = async (req: NextRequest, { params }: TParams) => {
   try {
      const id = Number(params.id);
      validateId(id);
      const user = await currentUserOrThrowAuthError();
      const membersData = await req.json();

      const modifiedMembersData = membersData.map(
         (member:any) => {
            const date = new Date()
            console.log(member.birthday === undefined)
            return {
               ...member,
               firstName:member.firstName === undefined ? "" : member.firstName,
               lastName:member.lastName === undefined ? "" : member.lastName,
               middleName:member.middleName  ===  undefined? "" : member.middleName,
               passbookNumber:member.passbookNumber ===  undefined ? "" :member.passbookNumber,
               createdBy: user.id,
               birthday: member.birthday === undefined ? date : ExcelDateToJSDate(member.birthday),
               eventId: id,
               emailAddress: member.emailAddress  === undefined ? "toUpdate@gmail.com" : member.emailAddress,
               contact: member.contact ===  undefined ? "" : member.contact.toString(),
               voteOtp: generateOTP(6),
            };
         }
      );
      console.log(modifiedMembersData)
      modifiedMembersData.forEach((member:any) => {
         createManySchema.parse(member);
      });
      const newMember = await db.eventAttendees.createMany({
         data: modifiedMembersData,
         skipDuplicates: true,
      });
      return NextResponse.json(newMember);
   } catch (e) {
      return routeErrorHandler(e, req);
   }
};
