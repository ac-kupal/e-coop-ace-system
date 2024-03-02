import db from "@/lib/database"
import { routeErrorHandler } from "@/errors/route-error-handler";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { eventIdParamSchema, passbookNumberSchema } from "@/validation-schema/commons";
import { NextRequest, NextResponse } from "next/server";

type TParams = { params : { id : number }}

export const POST = async (req : NextRequest, { params } : TParams) => {
    try{
        const eventId = eventIdParamSchema.parse(params.id);
        const currentUser = await currentUserOrThrowAuthError();

        const passbookNumber = passbookNumberSchema.parse((await req.json()).passbookNumber)

        const updateMemberAttendee = await db.eventAttendees.update({
            where : { eventId_passbookNumber : { 
                eventId, 
                passbookNumber
            }},
            data : {
                registered : true
            }
        })

        return NextResponse.json("Attendance Registered");
    }catch(e){
        return routeErrorHandler(e, req.method)
    }
}