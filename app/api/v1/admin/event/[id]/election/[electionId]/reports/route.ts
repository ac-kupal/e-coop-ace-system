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
                        candidateId: candidateId,
                        candidateName: candidateName,
                     });
                  }
                  return unique;
               },
               [] as { candidateId: number; candidateName: string }[]
            );

            const uniqueVotersIds = new Set<string>();
            const modifiedVotes = votes.reduce(
               (votes, vote) => {
                  const voterId = vote.attendee.id;
                  const candidateId = vote.candidateId;
                  const voterName = `${vote.attendee.firstName}, ${vote.attendee.lastName}`;

                  // If voter is unique, add them to the unique voters list
                  if (!uniqueVotersIds.has(voterId)) {
                     uniqueVotersIds.add(voterId);
                  }

                  // If the voter's entry doesn't exist in the modifiedVotes array, create it
                  const voterEntryIndex = votes.findIndex(
                     (voter) => voter.id === voterId
                  );
                  if (voterEntryIndex === -1) {
                     const voterVotes = new Array(uniqueCandidates.length).fill(
                        0
                     ); // Initialize votes array with 0s
                     const candidateIndex = uniqueCandidates.findIndex(
                        (candidate) => candidate.candidateId === candidateId
                     );
                     if (candidateIndex !== -1) {
                        voterVotes[candidateIndex] = 1; // Set vote for this candidate to 1
                     }
                     votes.push({
                        id: voterId,
                        candidateId: candidateId,
                        voterName: voterName,
                        votes: voterVotes,
                     });
                  } else {
                     // If the voter's entry exists, find the index of the candidate they voted for
                     const candidateIndex = uniqueCandidates.findIndex(
                        (candidate) => candidate.candidateId === candidateId
                     );
                     if (candidateIndex !== -1) {
                        votes[voterEntryIndex].votes[candidateIndex] = 1; // Set vote for this candidate to 1
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

            // Convert the totals to the desired format
            const total = totalVotesPerCandidate;
            const sumOfTotalVotes = total.reduce((sum, votes) => sum + votes, 0);
            console.log(total);
            console.log(modifiedVotes);
            console.log(uniqueCandidates);
            return NextResponse.json({total:total,voters:modifiedVotes,candidates:uniqueCandidates,sum:sumOfTotalVotes});
         }
         
          catch (error) {
             return routeErrorHandler(error, req);
          }
       };