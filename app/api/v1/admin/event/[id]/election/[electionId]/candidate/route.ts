import { routeErrorHandler } from "@/errors/route-error-handler";
import { TCreateCandidate } from "@/types";
import { createCandidateSchema } from "@/validation-schema/candidate";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/database"
import { validateId } from "@/lib/server-utils";
import { z } from "zod";

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
  
// type CandidatesDataType = {
//    candidateName: string,
//    totalVotes:number
//    candidateNameWithNumeric: string,
//    candidateVotersTally:string
//    votersName:Voters[]
//    voters:Voters[]
//    totalVotesForCandidate:number[]
// }

// type Voters = {
//    id:string,
//    votersName:string,
//    value?:number
// }
// type totaTallyType = {
//    id:string
//    total:number
// }

type TParams = {
   params:{id:number,electionId:number}
} 

type candidateValue ={
   candidateId:number
   value:number
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
                     votes:{
                        include:{
                           attendee:true,
                           candidate:true,
                        }
                     }
                  }
               }
            }
        })
        
        const sampleData = positions.map((position) => {
           const voters: { id: number; votersName: string }[] = [];
           const candidates: { id: number; candidateName: string }[] = [];

            position.candidates.forEach(candidate => {
               candidates.push({id:candidate.id,candidateName:`${candidate.lastName}, ${candidate.firstName}`})
            })

           // console.log(cand)

           position.candidates.forEach((candidate) => {
               candidates.push({
               id: candidate.id,
               candidateName: `${candidate.lastName}, ${candidate.firstName}`,
               });
            
              candidate.votes.forEach((vote) => {
                 const votersName = `${vote.attendee.lastName} ${vote.attendee.firstName}`;
                 const id = vote.candidateId;
                 voters.push({ id, votersName });
              });
           });
            
           const votersCandidatesIds = voters.map(voter => voter.id)

           const votersVoteTally = candidates.map(candidate=>( 
            votersCandidatesIds.includes(candidate.id) ? 1 : 0))
           
           const modifiedVoters = voters.map(voter =>({...voter, value:votersVoteTally}))


           const candidatesData = position.candidates.map((candidate) => {
              const totalVotes = candidate.votes.length;
              const votersIds = candidate.votes.map((vote) => vote.attendee.id);

            //   const modifiedVoters = voters.map((voter) => ({
            //      value: votersIds.includes(voter.id) ? 1 : 0,
            //   }));

            //   const totalVotesForCandidate = modifiedVoters.reduce(
            //      (total, voter) => total + voter.value,
            //      0
            //   );

              return {
                 ...candidate,
                 candidateNameWithNumeric: `${candidate.firstName} ${candidate.lastName} (${totalVotes})`,
                 candidateName: `${candidate.firstName} ${candidate.lastName}`,
                 totalVotes,
                 candidateVotersTally: {
                    candidateName: `${candidate.firstName} ${candidate.lastName}`,
                    passbookNumber: candidate.passbookNumber,
                  //   voters: modifiedVoters,
                  //   total: totalVotesForCandidate,
                 },
                 votersName: voters,
                 candidates:candidates,
                 voters: candidate.votes.map((vote) => ({
                    votersName: `${vote.attendee.lastName} ${vote.attendee.firstName}`,
                    id: vote.attendee.id,
                 })),
              };
           });


           return {
              positionName: position.positionName,
              dataSets: candidatesData.map(
                 (candidateData) => candidateData.totalVotes
              ),
              candidatesName: candidatesData.map(
                 (candidateData) => candidateData.candidateName
              ),
              candidateNameWithNumeric: candidatesData.map(
                 (candidateData) => candidateData.candidateNameWithNumeric
              ),
           };
        });
     
         return NextResponse.json(sampleData);
      // return NextResponse.json(positions);

       
     } catch (error) {
        return routeErrorHandler(error, req);
     }
  };
  