import db from "@/lib/database";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { TCreatePosition } from "@/types";
import { createPositionSchema } from "@/validation-schema/position";
import { handlePrivateRoute } from "../hadle-private-route";

export const POST = async (req: NextRequest) => {
   try {
      const postionData: TCreatePosition = await req.json();
      await handlePrivateRoute()
      createPositionSchema.parse(postionData)
       const createPosition = await db.position.create({data:postionData})
        return NextResponse.json(createPosition)
     } catch (error) {
     return routeErrorHandler(error, req.method);
   }
};

export const GET = async (req: NextRequest) => {
   try {
      await handlePrivateRoute()
      const getAllPosition = await db.position.findMany({});
      return NextResponse.json(getAllPosition);
   } catch (error) {
      return routeErrorHandler(error, req.method);
   }
};

export const PATCH = async (req: NextRequest) => {
   return NextResponse.json({ message: "PATCH - ok" });
};

export const DELETE = async (req: NextRequest) => {
   return NextResponse.json({ message: "DELETE - ok" });
};
