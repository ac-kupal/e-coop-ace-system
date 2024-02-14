import { NextRequest, NextResponse } from "next/server";
import { createEvent, getAllEvent } from "./services/events";
import { createEventSchema } from "@/validation-schema/event";
import { routeErrorHandler } from "@/errors/route-error-handler";

export const POST = async (req: NextRequest) => {
   try {
      const data = await req.json();
       createEventSchema.parse(data);
      const CreateEvent = await createEvent(data);
      return NextResponse.json(CreateEvent);
   } catch (e) {
      return routeErrorHandler(e, req.method);
   }
};

export const GET = async (req: NextRequest) => {
   try {
      const getAllEvents = await getAllEvent();
      return NextResponse.json(getAllEvents);
   } catch (e) {
      return routeErrorHandler(e, req.method);
   }
};
