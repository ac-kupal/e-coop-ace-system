import { routeErrorHandler } from "@/errors/route-error-handler";
import { validateId } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/database";

type TParams = {params:{candidateId:number}}

export const GET = async (req: NextRequest, { params }: TParams) => {
     try {
        const id = Number(params.candidateId);
        console.log(id)
        validateId(id);

        const getElectionWithEventId = await db.election.findUnique({
          where:{
               eventId:id
          }
        })
        if(!getElectionWithEventId) return null

        const getPositions = await db.candidate.findMany({
          where:{electionId:getElectionWithEventId.id},
          include:{
               position:true
          }
        })

        return NextResponse.json(getPositions);
     } catch (e) {
        console.log(e);
        return routeErrorHandler(e, req.method);
     }
  };
  