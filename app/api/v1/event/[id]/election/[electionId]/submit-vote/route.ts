import db from "@/lib/database";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

import { TVoteAuthorizationPayload } from "@/types";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { memberEmailSchema } from "@/validation-schema/member";
import { chosenCandidateIds } from "@/validation-schema/election";

type TParams = { params: { id: number; passbookNumber: number } };

export const POST = async (req: NextRequest, { params }: TParams) => {
    try {
        const vauth = req.cookies.get("v-auth")?.value;
        const { candidateIds: unparsedIds } = await req.json();
        const candidateIds = chosenCandidateIds.parse(unparsedIds);

        if (!vauth)
            return NextResponse.json(
                { message: "You dont have system credentials to vote" },
                { status: 403 },
            );

        const verifiedJwt = await jwtVerify<TVoteAuthorizationPayload>(
            vauth,
            new TextEncoder().encode(process.env.VOTING_AUTHORIZATION_SECRET),
        );

        const { attendeeId, eventId, electionId } = verifiedJwt.payload;

        if (!attendeeId)
            return NextResponse.json(
                {
                    message:
                        "There's a problem with your authorization, please retry voter member verification again.",
                },
                { status: 400 },
            );

        const voter = await db.eventAttendees.findUnique({
            where: { id: attendeeId },
            select: {
                voted: true,
                emailAddress: true,
            },
        });

        if (!voter)
            return NextResponse.json(
                { message: "Sorry we can't identify who you are" },
                { status: 404 },
            );

        if (voter?.voted) {
            const response = NextResponse.json(
                { message: "You already voted" },
                { status: 403 },
            );
            response.cookies.delete("v-auth");
            return response;
        }

        const [saveVote] = await db.$transaction([
           db.votes.createMany({
                data: candidateIds.map((candidateId) => ({
                    attendeeId,
                    candidateId,
                    electionId,
                })),
            }),
           db.eventAttendees.update({ where :{ id : attendeeId }, data : { voted : true }})
        ]);

        if (
            voter.emailAddress &&
            memberEmailSchema.safeParse(voter.emailAddress).success
        ) {
            // TODO: Send copy to email if email is defined for that user
        }

        const response = NextResponse.json("Ok");

        // response.cookies.delete("v-auth");
        return response;
    } catch (e) {
        return routeErrorHandler(e, req.method);
    }
};
