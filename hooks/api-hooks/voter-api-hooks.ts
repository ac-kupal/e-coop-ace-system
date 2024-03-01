import z from "zod";
import qs from "query-string";
import axios from "axios";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";

import { handleAxiosErrorMessage } from "@/utils";
import {
    TElection,
    TMemberAttendeesMinimalInfo,
} from "@/types";
import { chosenCandidateIds } from "@/validation-schema/election";

export const searchVoter = (
    eventId: number,
    electionId: number,
    onFound: (data: TMemberAttendeesMinimalInfo) => void,
) => {
    const {
        isPending,
        mutate: findVoter,
        isError,
        error,
    } = useMutation<TMemberAttendeesMinimalInfo, string, string>({
        mutationKey: ["member-search"],
        mutationFn: async (passbookNumber) => {
            try {
                if (passbookNumber === null || passbookNumber.length === 0) return;

                const url = qs.stringifyUrl(
                    {
                        url: `/api/v1/event/${eventId}/election/${electionId}/voter-search`,
                        query: { passbookNumber },
                    },
                    { skipNull: true },
                );

                const request = await axios.get(url);
                onFound(request.data);
                return request.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    });

    return { isPending, findVoter, isError, error };
};

export const loadVoter = (election: TElection) => {
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
        retry: 0,
    });

    return { voter, isPending, isError, error };
};

export const useCastVote = (
    election: TElection,
    onSuccess?: (data: any) => void,
) => {
    const {
        data,
        isPending: isCasting,
        isError: isCastError,
        error: castError,
        mutate: castVote,
    } = useMutation<any, string, z.infer<typeof chosenCandidateIds>>({
        mutationKey: ["cast-vote"],
        mutationFn: async (chosenCandidatesIds) => {
            try {
                const voteSubmission = await axios.post(
                    `/api/v1/event/${election.eventId}/election/${election.id}/submit-vote`,
                    { candidateIds: chosenCandidatesIds },
                );
                toast.success("Thank you, your vote has been submitted 🥳");
                if (onSuccess) onSuccess(voteSubmission.data);
                return voteSubmission.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    });

    return { data, isCasting, isCastError, castError, castVote };
};
