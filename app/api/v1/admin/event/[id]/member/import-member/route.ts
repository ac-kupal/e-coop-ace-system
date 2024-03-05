import { routeErrorHandler } from "@/errors/route-error-handler";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { ExcelDateToJSDate, generateOTP, validateId } from "@/lib/server-utils";
import {
   createManySchema,
} from "@/validation-schema/member";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/database";

type TParams = { params: { id: number } };
export const POST = async (req: NextRequest, { params }: TParams) => {
   try {
      const id = Number(params.id);
      validateId(id);
      const user = await currentUserOrThrowAuthError();
      const membersData = await req.json();

      const modifiedMembersData = membersData.map((member: any) => {
         const date = new Date();
         console.log(member.passbookNumber);
         return {
            ...member,
            firstName: member.firstName === undefined ? "" : member.firstName,
            lastName: member.lastName === undefined ? "" : member.lastName,
            middleName:
               member.middleName === undefined ? "" : member.middleName,
            passbookNumber:
               member.passbookNumber === undefined
                  ? generateOTP(6)
                  : member.passbookNumber.toString(),
            createdBy: user.id,
            birthday:
               member.birthday === undefined
                  ? date
                  : ExcelDateToJSDate(member.birthday),
            eventId: id,
            emailAddress:
               member.emailAddress === undefined
                  ? "toUpdate@gmail.com"
                  : member.emailAddress,
            contact:
               member.contact === undefined ? "" : member.contact.toString(),
            voteOtp: generateOTP(6),
         };
      });

      const oldMembers = await db.eventAttendees.findMany({
         where: {
            eventId: id,
         },
      });

      const filteredMembers = modifiedMembersData.filter((newMember: any) => {
         return !oldMembers.some(
            (oldMember: any) =>
               oldMember.passbookNumber === newMember.passbookNumber
         );
      });

      const skippedMembers = modifiedMembersData.filter((newMember: any) => {
         return oldMembers.some(
            (oldMember: any) =>
               oldMember.passbookNumber === newMember.passbookNumber
         );
      });

      filteredMembers.forEach((member: any) => {
         createManySchema.parse(member);
      });

      const createManyResult = await db.eventAttendees.createMany({
         data: filteredMembers,
         skipDuplicates: true,
      });

      return NextResponse.json({
         newMembers: filteredMembers,
         skippedMembers: skippedMembers,
      });
   } catch (e) {
      return routeErrorHandler(e, req);
   }
};
