import { SignJWT } from "jose";

import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { routeErrorHandler } from "@/errors/route-error-handler";
import {
  eventElectionParamsSchema,
  voterVerificationSchema,
} from "@/validation-schema/event-registration-voting";
import { TVoteAuthorizationPayload } from "@/types";
import { format, isSameDay } from "date-fns";

type TParams = { params: { id: number; passbookNumber: number } };

export const POST = async (req: NextRequest, { params }: TParams) => {
  try {
    const { id: eventId, electionId } = eventElectionParamsSchema.parse(params);
    const { otp, birthday, passbookNumber } = voterVerificationSchema.parse(
      await req.json(),
    );

    const election = await db.election.findUnique({
      where: { eventId, id: electionId },
    });

    if (election?.status !== "live")
      return NextResponse.json(
        { message: "Voting is not yet open" },
        { status: 403 },
      );

    const voter = await db.eventAttendees.findUnique({
      where: {
        eventId_passbookNumber: {
          eventId,
          passbookNumber,
        },
      },
    });

    if (!voter)
      return NextResponse.json(
        { message: "You are not on the list, for verification." },
        { status: 404 },
      );

    if (voter.voted)
      return NextResponse.json(
        { message: "You already voted" },
        { status: 403 },
      );

    if (voter.voteOtp == null || voter.voteOtp !== otp)
      return NextResponse.json({ message: "Invalid OTP" }, { status: 403 });

    if (
      election.allowBirthdayVerification &&
       (!birthday ||
      !isSameDay(voter.birthday, birthday))
    )
      return NextResponse.json(
        { message: "Invalid birthdate, please try again" },
        { status: 400 },
      );

    const authorizationContent: TVoteAuthorizationPayload = {
      eventId,
      electionId,
      attendeeId: voter.id,
      passbookNumber: voter.passbookNumber,
    };

    const voterAuthorization = await new SignJWT(authorizationContent)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setIssuer("ace-system")
      .sign(new TextEncoder().encode(process.env.VOTING_AUTHORIZATION_SECRET));

    const response = NextResponse.json(voter, { status: 200 });

    response.cookies.set("v-auth", voterAuthorization, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });

    return response;
  } catch (e) {
    return routeErrorHandler(e, req.method);
  }
};
