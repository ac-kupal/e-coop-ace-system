import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { sendMail } from "@/lib/mailer";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { memberEmailSchema } from "@/validation-schema/member";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdParamSchema } from "@/validation-schema/commons";

type TParams = { params: { id: number } };

export const POST = async (req: NextRequest, { params }: TParams) => {
    try {
        await currentUserOrThrowAuthError();
        const eventId = eventIdParamSchema.parse(params.id);

        const event = await db.event.findUnique({ where: { id: eventId } });

        if (!event) return NextResponse.json({ message: "Event was not found" }, { status: 404 });

        const memberAttendeesList = await db.eventAttendees.findMany({
            select: {
                firstName: true,
                lastName: true,
                emailAddress: true,
                voteOtp : true
            },
            where: {
                eventId: eventId,
                // canVote: true, // idk about this though, cuz otp can also be used in claiming
                AND: [{ emailAddress: { not: null } }, { emailAddress: { not: "" } }],
            },
        });

        if (memberAttendeesList.length === 0)
            return NextResponse.json(
                {
                    message:
                        "Nothing to send to, make sure they are allowed to vote and have a valid email address.",
                },
                { status: 400 },
            );

        const mailTaskStatus = {
            sentCount: 0,
            invalidEmailAddress: 0,
            failedSend: 0,
        };

        const mailSentTasks = memberAttendeesList
            .filter((member) => {
                const validatedEmail = memberEmailSchema.safeParse(member.emailAddress);
                if (!validatedEmail.success) {
                    mailTaskStatus.invalidEmailAddress += 1;
                    return false;
                }
                return true;
            })
            .map(async (member) => {
                try {
                    if (!member.emailAddress) return;
                    await sendMail({
                        subject: "eCoop : Your event OTP",
                        toEmail: member.emailAddress,
                        template: {
                            templateFile: "vote-otp.html",
                            payload: {
                                iconImage: `${process.env.DEPLOYMENT_URL}/images/vote-otp.png`,
                                eventTitle: event.title,
                                otp : member.voteOtp as "",
                                eventLink : `${process.env.DEPLOYMENT_URL}/events/${event.id}/`,
                                memberName : `${member.firstName} ${member.firstName}`,
                                eventCoverImage : event.coverImage as ''
                            }
                        }
                    })
                    mailTaskStatus.sentCount += 1;
                } catch (e) {
                    mailTaskStatus.failedSend += 1;
                }
            });

        await Promise.all(mailSentTasks);

        return NextResponse.json(mailTaskStatus);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};
