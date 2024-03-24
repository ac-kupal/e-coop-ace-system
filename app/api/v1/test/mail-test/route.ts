import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";

import { sendMail } from "@/lib/mailer";
import { ISendMailProps } from "@/types";
import { routeErrorHandler } from "@/errors/route-error-handler";

export const GET = async (req: NextRequest) => {
  try {
    let emails: string[] = [];

    for (let i = 0; i < 1; i++) {
      const uuid = uuidv4().replace(/-/g, "");
      const email = `pleizyparagas+a${uuid}@gmail.com`;
      emails.push(email);
    }

    const mails : ISendMailProps[] = emails.map((email) => (
        {
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
          }
    ))

    const mailResult = await sendMail(mails)

    return NextResponse.json(mailResult);
  } catch (e) {
    return routeErrorHandler(e, req);
  }
};
