import db from "@/lib/database";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { TVoteAuthorizationPayload } from "@/types";

export const GET = async (req: NextRequest) => {
    try {
        const vauth = req.cookies.get("v-auth")?.value;

        if (!vauth)
            return NextResponse.json(
                {
                    message:
                        "You don't have authorization to vote, please retry the voting process (Member verification)",
                },
                { status: 403 },
            );

        const verifiedJwt = await jwtVerify<TVoteAuthorizationPayload>(
            vauth,
            new TextEncoder().encode(process.env.VOTING_AUTHORIZATION_SECRET),
        );

        const { attendeeId } = verifiedJwt.payload;

        if (!attendeeId)
            return NextResponse.json(
                {
                    message:
                        "There's a problem with your authorization, please retry voter member verification again.",
                },
                { status: 400 },
            );

        // check if election exist
        // check if election open
        // check member if exist
        const voter = await db.eventAttendees.findUnique({
            where: { id: attendeeId },
            select: {
                firstName: true,
                middleName: true,
                lastName: true,
                contact: true,
                picture: true,
                registered: true,
                voted: true,
            },
        });

        if (voter?.voted) {
            const response = NextResponse.json(
                { message: "You already voted" },
                { status: 403 },
            );
            response.cookies.delete("v-auth");
            return response;
        }
        // check if user has not voted

        return NextResponse.json(voter);
    } catch (e) {
        routeErrorHandler(e, req.method);
    }
};
