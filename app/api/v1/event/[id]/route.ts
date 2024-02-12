// TODO: GET get specific event

import { currentUserOrThrowAuthError } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { deleteEvent } from "../services/events";

type TParams = { params: { id: number } };
export const GET = () => {
   return NextResponse.json("ok");
};
// TODO: PATCH update specific event

export const DELETE = async (req: NextRequest, { params }: TParams) => {
   try {
      const id = Number(params.id);
      const user = await currentUserOrThrowAuthError();
      if (!params.id && isNaN(Number(id)))
         return NextResponse.json(
            { message: "missing/invalid id on request" },
            { status: 400 }
         );

      const softDeleleteEvent = await deleteEvent(user.id, id);
      return NextResponse.json(softDeleleteEvent);
   } catch (error) {
      console.error(`ERROR : /api/v1/[id] - [DELETE]: ${error}`);
      return NextResponse.json(
         { message: "Internal Server Error" },
         { status: 500 }
      );
   }
};
