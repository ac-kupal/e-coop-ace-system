import { routeErrorHandler } from "@/errors/route-error-handler";
import { NextRequest, NextResponse } from "next/server";

type TParams = { params: { id: number; passbookNumber: number } };

export const POST = async (req: NextRequest, { params }: TParams) => {
  try {
    const vauth = req.cookies.get("v-auth");

    if (!vauth)
      return NextResponse.json(
        { message: "You dont have system credentials to vote" },
        { status: 403 },
      );

    // TODO : Insertion of vote & send voter copy of vote via email

    return NextResponse.json("Noice");
  } catch (e) {
    return routeErrorHandler(e, req.method);
  }
};
