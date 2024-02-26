"use client";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
    TCandidatewithPosition,
    TElectionWithPositionAndCandidates,
    TMemberAttendeesMinimalInfo,
} from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import LoadingSpinner from "@/components/loading-spinner";
import InvalidElection from "../../_components/invalid-election";
import OnlyLandscape from "@/components/only-landscape";
import VoteHeader from "./vote-header";
import CandidateList from "./candidate-list";

type Props = {
    election: TElectionWithPositionAndCandidates;
};

const VoteWindow = ({ election }: Props) => {
    const TotalPositions = election.positions.length - 1;
    const [currentPage, setCurrentPage] = useState(0);
    const [votes, setVotes] = useState<TCandidatewithPosition[]>([]);

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

    const currentPosition = election.positions[currentPage];

    return (
        <div className="w-full max-w-7xl py-16">
            <OnlyLandscape />
            <VoteHeader position={currentPosition} selected={ votes.filter((votedCandidate)=> votedCandidate.position.id === currentPosition.id).length } />
            <CandidateList
                chosenCandidates={votes.filter(
                    (votedCandidate) => votedCandidate.position.id === currentPosition.id,
                )}
                onAdd={(candidate) => { setVotes((prevVotes)=> [...prevVotes, candidate]) }}
                onRemove={(candidate) => { setVotes((prevVotes)=> prevVotes.filter((voted) => voted.id !== candidate.id))}}
                candidates={currentPosition.candidates}
            />
        </div>
    );
};

export default VoteWindow;
