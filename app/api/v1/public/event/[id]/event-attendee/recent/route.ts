import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdParamSchema } from "@/validation-schema/api-params";
import { passbookNumberSchema } from "@/validation-schema/commons";

type TParams = { params: { id: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
  try {
    const { id: eventId } = eventIdParamSchema.parse(params);
    const recentPb = req.cookies.get("recent-user")?.value;

    if (!recentPb)
      return NextResponse.json({ message: "No recent user" }, { status: 400 });

    const member = await db.eventAttendees.findUnique({
      where: {
        eventId_passbookNumber: {
          passbookNumber: recentPb,
          eventId,
        },
      },
    });

    if (!member)
      return NextResponse.json({ message: "No recent user" }, { status: 404 });

    return NextResponse.json(member);
  } catch (e) {
    return routeErrorHandler(e, req);
  }
};

export const POST = async (req: NextRequest, { params }: TParams) => {
  try {
    const { id: eventId } = eventIdParamSchema.parse(params);
    const pb = passbookNumberSchema.parse(await req.json());

    const member = await db.eventAttendees.findUnique({
      where: {
        eventId_passbookNumber: {
          passbookNumber: pb,
          eventId,
        },
      },
    });

    if (!member)
      return NextResponse.json({ message: "No recent user" }, { status: 404 });

    const response = NextResponse.json("Recent member set");

    response.cookies.set("recent-user", pb, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });

    return Response;
  } catch (e) {
    return routeErrorHandler(e, req);
  }
};
