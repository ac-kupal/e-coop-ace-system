import { routeErrorHandler } from "@/errors/route-error-handler";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { ExcelDateToJSDate, generateOTP, validateId } from "@/lib/server-utils";
import { createManySchema } from "@/validation-schema/member";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/database";
import { TMember } from "@/types";

type TParams = { params: { id: number } };
export const POST = async (req: NextRequest, { params }: TParams) => {
   try {
       const id = Number(params.id);
       validateId(id);
       const user = await currentUserOrThrowAuthError();
       const membersData = await req.json();

       const modifiedMembersData = membersData.map((member: any) => {
           const date = new Date()
           return {
               ...member,
               firstName: member.firstName === undefined ? "" : member.firstName,
               lastName: member.lastName === undefined ? "" : member.lastName,
               middleName: member.middleName === undefined ? "" : member.middleName,
               passbookNumber: member.passbookNumber === undefined ? "" : member.passbookNumber,
               createdBy: user.id,
               birthday: member.birthday === undefined ? date : ExcelDateToJSDate(member.birthday),
               eventId: id,
               emailAddress: member.emailAddress === undefined ? "toUpdate@gmail.com" : member.emailAddress,
               contact: member.contact === undefined ? "" : member.contact.toString(),
               voteOtp: generateOTP(6),
           };
       });

       modifiedMembersData.forEach((member: any) => {
           createManySchema.parse(member);
       });

       const createManyResult = await db.eventAttendees.createMany({
           data: modifiedMembersData,
           skipDuplicates: true,
       });

       const createdMemberCount = createManyResult.count;

       const newMembers = await db.eventAttendees.findMany({
           where: {
               eventId: id
           },
           take: createdMemberCount
       });

       const skippedMembers = modifiedMembersData.filter((member: any) => {
           return !newMembers.find((newMember: any) => newMember.passbookNumber === member.passbookNumber && newMember.eventId === member.eventId);
       });
        
      // console.log({newMembers: newMembers,skippedMembers: skippedMembers})
       
       return NextResponse.json({
           newMembers: newMembers,
           skippedMembers: skippedMembers
       });

   } catch (e) {
       return routeErrorHandler(e, req);
   }
};
