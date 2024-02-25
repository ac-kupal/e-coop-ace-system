"use client";
import axios from "axios";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

import {
    TElectionWithPositionAndCandidates,
    TMemberAttendeesMinimalInfo,
} from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import LoadingSpinner from "@/components/loading-spinner";
import InvalidElection from "../../_components/invalid-election";
import OnlyLandscape from "@/components/only-landscape";
import VoteHeader from "./vote-header";
import CandidateCard from "./candidate-card";
import CandidateList from "./candidate-list";

type Props = {
    election: TElectionWithPositionAndCandidates;
};

const VoteWindow = ({ election }: Props) => {
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

    if (isPending)
        return (
            <div className="fixed top-1/2 left-auto gap-x-2 rounded-xl flex items-center justify-center px-3 py-1 bg-secondary/40 backdrop-blur-sm">
                <LoadingSpinner strokeWidth={1} />
                <p className="text-foreground/80 text-sm">checking authorization</p>
            </div>
        );

    if (isError) return <InvalidElection message={error} />;

    console.log(election)

    return (
        <div className="w-full max-w-7xl py-16">
            <OnlyLandscape />
            <VoteHeader position={election.positions[0]} selected={0} />
            <CandidateList candidates={election.positions[0].candidates}/>
        </div>
    );
};

export default VoteWindow;
