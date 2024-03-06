import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdSchema } from "@/validation-schema/commons";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { generateOTP } from "@/lib/server-utils";
import { createMemberWithUploadSchema } from "@/validation-schema/member";
import { boolean } from "zod";

type TParams = { params: { id: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const eventId = eventIdSchema.parse(params.id)

        const eventAttendees = await db.eventAttendees.findMany({
            where: { eventId },
            orderBy: [ { createdAt: "desc"} , {updatedAt : "desc" } ]
        });

        return NextResponse.json(eventAttendees);
    } catch (e) {
        routeErrorHandler(e, req);
    }
};

export const POST = async (req: NextRequest) => {
    try {
       const data = await req.json();
       
       const isBirthday = data.birthday === undefined
       
       console.log(isBirthday)

       const user = await currentUserOrThrowAuthError();

       const date = new Date(data.birthday);
       const newBirthday = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
       

       const memberData = {
          ...data,
          createdBy: user.id,
          voteOtp: generateOTP(6),
          birthday: isBirthday ? null : newBirthday,
       };

       console.log(memberData)

       createMemberWithUploadSchema.parse(memberData);
       
       const newMember = await db.eventAttendees.create({ data: memberData });
 
       return NextResponse.json(newMember);
    } catch (e) {
       return routeErrorHandler(e, req);
    }
 };