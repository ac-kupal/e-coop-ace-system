import { NextRequest, NextResponse } from "next/server";
import { createEvent, getAllEvent } from "./_services/events";
import { createEventSchema } from "@/validation-schema/event";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { createElectionValidation } from "@/validation-schema/election";
import { ElectionStatus } from "@prisma/client";
import { handlePrivateRoute } from "../hadle-private-route";

export const POST = async (req: NextRequest) => {
   try {
      await handlePrivateRoute()
      const { data } = await req.json();
      
      // Determine if the event includes an election
      const includeElection = !!data.electionName;

      //not so good na approach, will refactor it the soonest 
      const election = includeElection
         ? { electionName: data.electionName, status: ElectionStatus.pending }
         : { electionName: "", status: ElectionStatus.pending };

      // Validate input data
      createEventSchema.parse(data);
      if (includeElection) {
         createElectionValidation.parse(election);
      }

      const CreateEvent = await createEvent(data, election, includeElection);

      return NextResponse.json(CreateEvent);
   } catch (e) {
      console.log(e)
      return routeErrorHandler(e, req.method);
   }
};

export const GET = async (req: NextRequest) => {
   try {
      await handlePrivateRoute()
      const getAllEvents = await getAllEvent(true);
      return NextResponse.json(getAllEvents);
   } catch (e) {
      return routeErrorHandler(e, req.method);
   }
};
