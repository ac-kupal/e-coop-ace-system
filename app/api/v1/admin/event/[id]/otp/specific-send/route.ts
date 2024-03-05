import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { sendMail } from "@/lib/mailer";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { eventIdSchema } from "@/validation-schema/commons";
import { memberEmailSchema } from "@/validation-schema/member";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { passbookNumberSchema } from "@/validation-schema/commons";

type TParams = { params: { id: number } };

export const POST = async (req: NextRequest, { params }: TParams) => {
    try {
        await currentUserOrThrowAuthError();
        const eventId = eventIdSchema.parse(params.id);

        const { passbookNumber } = await req.json();

        const validatedPasbookNumber = passbookNumberSchema.parse(passbookNumber);

        const event = await db.event.findUnique({ where: { id: eventId } });

        if (!event)
            return NextResponse.json(
                { message: "Event was not found" },
                { status: 404 },
            );

        const memberAttendee = await db.eventAttendees.findUnique({
            select: {
                firstName: true,
                lastName: true,
                emailAddress: true,
                voteOtp: true,
                canVote: true,
            },
            where: {
                eventId_passbookNumber: {
                    passbookNumber: validatedPasbookNumber,
                    eventId: eventId,
                },
            },
        });

        if (!memberAttendee)
            return NextResponse.json(
                {
                    message:
                        "This member OTP cant be sent because the member isn't existing on the list",
                },
                { status: 400 },
            );


        const validatedEmail = memberEmailSchema.safeParse(memberAttendee.emailAddress);

        if (!validatedEmail.success) 
            return NextResponse.json({ message : "OTP can't be sent as member email was invalid."}, {status : 400});


        const mailTask = await sendMail({
            subject: "eCoop : Your event OTP",
            toEmail: validatedEmail.data,
            template: {
                templateFile: "vote-otp.html",
                payload: {
                    iconImage: `${process.env.DEPLOYMENT_URL}/images/vote-otp.png`,
                    eventTitle: event.title,
                    otp: memberAttendee.voteOtp as "",
                    eventLink: `${process.env.DEPLOYMENT_URL}/events/${event.id}/`,
                    memberName: `${memberAttendee.firstName} ${memberAttendee.firstName}`,
                    eventCoverImage: event.coverImage as "",
                },
            },
        });

        if(!mailTask) return NextResponse.json('Not Sent', { status : 400 });

        return NextResponse.json('Sent');
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};
