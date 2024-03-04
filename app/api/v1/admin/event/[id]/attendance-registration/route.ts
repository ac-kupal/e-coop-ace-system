import db from "@/lib/database"
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { currentUserOrThrowAuthError } from "@/lib/auth";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdSchema, passbookNumberSchema } from "@/validation-schema/commons";

type TParams = { params : { id : number }}

export const POST = async (req : NextRequest, { params } : TParams) => {
    try{
        const eventId = eventIdSchema.parse(params.id);
        const currentUser = await currentUserOrThrowAuthError();

        const passbookNumber = passbookNumberSchema.parse((await req.json()).passbookNumber)

        const updateMemberAttendee = await db.eventAttendees.update({
            where : { eventId_passbookNumber : { 
                eventId, 
                passbookNumber
            }},
            data : {
                registered : true,
                registrationAssistId : currentUser.id
            }
        })

        return NextResponse.json("Attendance Registered");
    }catch(e){
        if(e instanceof Prisma.PrismaClientKnownRequestError)
            if(e.code === "P2025") 
                return NextResponse.json({ message : "The member you are trying to register doesn't exist."}, { status : 400 })
        return routeErrorHandler(e, req)
    }
}