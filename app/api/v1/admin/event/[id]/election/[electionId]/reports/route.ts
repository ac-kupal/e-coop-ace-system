import { routeErrorHandler } from "@/errors/route-error-handler";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/database"
import { validateId } from "@/lib/server-utils";



type TParams = {
          params:{electionId:number,id:number}
        }
        
export const GET = async (req: NextRequest,{params}:TParams) => {
         try {
            const id = Number(params.electionId);
            validateId(id);
            const votes = await db.votes.findMany({
               where: {
                  electionId: id,
               },
               include: {
                  candidate: {
                     include: {
                        position: true,
                     },
                  },
                  attendee: true,
               },
            });
            const uniqueCandidateIds = new Set<number>();
            const uniqueCandidates = votes.reduce(
               (unique, vote) => {
                  const candidateId = vote.candidateId;
                  if (!uniqueCandidateIds.has(candidateId)) {
                     uniqueCandidateIds.add(candidateId);
                     const candidateName = `${vote.candidate.firstName}, ${vote.candidate.lastName} - ${vote.candidate.position.positionName}`;
                     unique.push({
                        id:vote.candidate.positionId,
                        candidateId: candidateId,
                        candidateName: candidateName,
                     });
                  }
                  const sortUnique = unique.sort((a,b)=> a.id - b.id)
                  return sortUnique
               },
               [] as {id:number, candidateId: number; candidateName: string }[]
            );
           
            

            const uniqueVotersIds = new Set<string>();

            const modifiedVotes = votes.reduce(
               (votes, vote) => {
                  const voterId = vote.attendee.id;
                  const candidateId = vote.candidateId;
                  const voterName = `${vote.attendee.lastName}, ${vote.attendee.firstName}`;

                  if (!uniqueVotersIds.has(voterId)) {
                     uniqueVotersIds.add(voterId);
                  }

                  const voterEntryIndex = votes.findIndex(
                     (voter) => voter.id === voterId
                  );
                  if (voterEntryIndex === -1) {
                     const voterVotes = new Array(uniqueCandidates.length).fill(
                        0
                     ); 
                     const candidateIndex = uniqueCandidates.findIndex(
                        (candidate) => candidate.candidateId === candidateId
                     );
                     if (candidateIndex !== -1) {
                        voterVotes[candidateIndex] = 1; 
                     }
                     votes.push({
                        id: voterId,
                        candidateId: candidateId,
                        voterName: voterName,
                        votes: voterVotes,
                     });
                  } else {
                     const candidateIndex = uniqueCandidates.findIndex(
                        (candidate) => candidate.candidateId === candidateId
                     );
                     if (candidateIndex !== -1) {
                        votes[voterEntryIndex].votes[candidateIndex] = 1;
                     }
                  }

                  return votes;
               },
               [] as {
                  id: string;
                  candidateId: number;
                  voterName: string;
                  votes: number[];
               }[]
            );
            const totalVotesPerCandidate = new Array(
               uniqueCandidates.length
            ).fill(0);
            modifiedVotes.forEach((voter) => {
               voter.votes.forEach((vote, index) => {
                  totalVotesPerCandidate[index] += vote;
               });
            });

            const total = totalVotesPerCandidate;
            const sumOfTotalVotes = total.reduce((sum, votes) => sum + votes, 0);
            return NextResponse.json({total:total,voters:modifiedVotes,candidates:uniqueCandidates,sum:sumOfTotalVotes});
         }
         
          catch (error) {
             return routeErrorHandler(error, req);
          }
       };