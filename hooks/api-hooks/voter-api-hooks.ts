import z from 'zod'
import axios from "axios";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";

import { handleAxiosErrorMessage } from "@/utils";
import { TElection, TMemberAttendeesMinimalInfo } from "@/types";
import { chosenCandidateIds } from "@/validation-schema/election"

export const loadVoter = (election : TElection) => {
    const {
        data: voter,
        isPending,
        isError,
        error,
    } = useQuery<TMemberAttendeesMinimalInfo, string>({
        queryKey: ["voter-authorization"],
        queryFn: async () => {
            try {
                const checkVoteAuthorization = await axios.get(
                    `/api/v1/event/${election.eventId}/election/${election.id}/check-vote-auth/`,
                );

                const voter: TMemberAttendeesMinimalInfo = checkVoteAuthorization.data;
                toast.success(
                    `Congratulations ${voter.firstName}, you are authorized to vote 🎉.`,
                );
                return checkVoteAuthorization.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    });

    return { voter, isPending, isError, error }
}

export const useCastVote = (election : TElection, onSuccess? : (data : any) => void) => {
    const {data, isPending : isCasting, isError : isCastError, error : castError, mutate : castVote} = useMutation<any, string, z.infer<typeof chosenCandidateIds>>({ 
        mutationKey : ['cast-vote'],
        mutationFn : async (chosenCandidatesIds) => {
           try{
                const voteSubmission = await axios.post(`/api/v1/event/${election.eventId}/election/${election.id}/submit-vote`, { candidateIds : chosenCandidatesIds })
                toast.success("Thank you, your vote has been submitted 🥳")
                if(onSuccess) onSuccess(voteSubmission.data)
                return voteSubmission.data
            }catch(e){
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        }
    })

    return { isCasting, isCastError, castError, castVote }

}
