import { routeErrorHandler } from "@/errors/route-error-handler";
import { TCreateCandidate } from "@/types";
import { createCandidateSchema } from "@/validation-schema/candidate";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/database"



export const POST = async (req: NextRequest) => {
     try {
        const candidate: TCreateCandidate = await req.json();
        createCandidateSchema.parse(candidate)
        const createCandidate = await db.candidate.create({
           data: {
              firstName: candidate.firstName,
              lastName: candidate.lastName,
              passbookNumber: candidate.passbookNumber,
              picture: candidate.picture,
              election: {
                 connect: {
                    id: candidate.electionId,
                 },
              },
              position: {
                 connect: {
                    id: candidate.positionId,
                 },
              },
           },
        });
        return NextResponse.json(createCandidate);
     } catch (error) {
          console.log(error)
        return routeErrorHandler(error, req);
     }
  };
  


export const GET = async (req: NextRequest) => {
     try {
        return NextResponse.json({message:"get Candidate ok"});
     } catch (error) {
        return routeErrorHandler(error, req);
     }
  };
  