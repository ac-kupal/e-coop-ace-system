import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { sendMail } from "@/lib/mailer";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { eventIdSchema } from "@/validation-schema/commons";
import { memberEmailSchema } from "@/validation-schema/member";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { ISendMailProps } from "@/types";

type TParams = { params: { id: number } };

export const POST = async (req: NextRequest, { params }: TParams) => {
    try {
        await currentUserOrThrowAuthError();
        const eventId = eventIdSchema.parse(params.id);

        const event = await db.event.findUnique({ where: { id: eventId } });

        if (!event) return NextResponse.json({ message: "Event was not found" }, { status: 404 });

        const memberAttendeesList = await db.eventAttendees.findMany({
            select: {
                firstName: true,
                lastName: true,
                emailAddress: true,
                voteOtp: true,
            },
            where: {
                eventId: eventId,
                AND: [
                    { emailAddress: { not: null } },
                    { emailAddress: { not: "" } },
                ],
            },
        });

        if (memberAttendeesList.length === 0) return NextResponse.json({message:"Nothing to send to, make sure they are allowed to vote and have a valid email address."},{ status: 400 });

        const mails: ISendMailProps[] = [];

        memberAttendeesList.forEach((member) => {
                const validatedEmail = memberEmailSchema.safeParse(member.emailAddress);
                if (!validatedEmail.success) return;

                mails.push({
                    subject: "eCoop : Your event OTP",
                    toEmail: validatedEmail.data,
                    template: {
                        templateFile: "vote-otp.html",
                        payload: {
                            iconImage: `${process.env.DEPLOYMENT_URL}/images/vote-otp.png`,
                            eventTitle: event.title,
                            otp: member.voteOtp as "",
                            eventLink: `${process.env.DEPLOYMENT_URL}/events/${event.id}/`,
                            memberName: `${member.firstName} ${member.firstName}`,
                            eventCoverImage: event.coverImage as "",
                        },
                    },
                });
            });

        const mailSendJob = await sendMail(mails, {isBulkSend: true});

        return NextResponse.json(mailSendJob);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};
