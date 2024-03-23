import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";

import { routeErrorHandler } from "@/errors/route-error-handler";
import { sendMail } from "@/lib/mailer";

export const GET = async (req: NextRequest) => {
  try {
    let emails: string[] = [];

    for (let i = 0; i < 1; i++) {
      const uuid = uuidv4().replace(/-/g, "");
      const email = `pleizyparagas+${uuid}@gmail.com`;
      emails.push(email);
    }

    const mailTaskStatus = {
      sentCount: 0,
      invalidEmailAddress: 0,
      failedSend: 0,
    };

    const mailSentTasks = emails.map(async (email) => {
        try {
          await sendMail({
            subject: "eCoop : Your event OTP",
            toEmail: email,
            template: {
              templateFile: "vote-otp.html",
              payload: {
                iconImage: `${process.env.DEPLOYMENT_URL}/images/vote-otp.png`,
                eventTitle: "bulk test",
                otp: "- - - - - -",
                eventLink: "test",
                memberName: "test member", 
                eventCoverImage: "",
              },
            },
          });
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
