import { routeErrorHandler } from "@/errors/route-error-handler";
import { TCandidate, TCandidatewithVotes, TCreateCandidate, TPosition, TPositionWithCandidates, TPositionWithCandidatesAndPosition } from "@/types";
import { createCandidateSchema } from "@/validation-schema/candidate";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/database"
import { parseArgs } from "util";
import { PathParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { validateId } from "@/lib/server-utils";
import { ZodError, z } from "zod";


type TCreateCandidateParams = {
   params: { id: number; electionId: number; candidateId: number };
};
export const POST = async (req: NextRequest,{params}:TCreateCandidateParams) => {
     try {
        const candidate: TCreateCandidate = await req.json();
        createCandidateSchema.parse(candidate)

        z.string().parse(candidate.passbookNumber)

      const eventId = params.id

      validateId(eventId);

      const getMemberAttendees = await db.eventAttendees.findMany({
         where: {
            eventId: Number(eventId),
         },
      });

      const isExistOnMigs = getMemberAttendees.find(
         (e) => e.passbookNumber === candidate.passbookNumber
      );
      

      if(!!isExistOnMigs == false){
        throw new Error("The candidate must either exist among the members or be a member of MIGS")
      }
      console.log(!!isExistOnMigs)

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
        return routeErrorHandler(error, req);
     }
  };
  
type TParams = {
   params:{id:number,electionId:number}
} 

type CandidatesDataType = {
   candidateName: string,
   totalVotes:number
}

export const GET = async (req: NextRequest,{params}:TParams) => {
     try {
        const electionId  = Number(params.electionId)
        const positions = await db.position.findMany({
            where:{
               electionId:electionId
            },
            include:{
               candidates:{
                  include:{
                     votes:true
                  }
               }
            }
        })
        const sampleData = positions.map((position:TPositionWithCandidates) => {
         const candidatesData = position.candidates.map((candidate:any)  => {
           const totalVotes = candidate.votes.length;
           return {
             candidateName: `${candidate.firstName} ${candidate.lastName}`,
             totalVotes: totalVotes,
           };
         });
     
         return {
           positionName: position.positionName,
           dataSets: candidatesData.map((candidateData:CandidatesDataType) => candidateData.totalVotes),
           candidatesName: candidatesData.map((candidateData:CandidatesDataType) => candidateData.candidateName)
           
         };
       });
        return NextResponse.json(sampleData);
     } catch (error) {
        return routeErrorHandler(error, req);
     }
  };
  