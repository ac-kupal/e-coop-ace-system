"use client";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import VoteHeader from "./vote-header";
import VoteSummary from "./vote-summary";
import CandidateList from "./candidate-list";
import VoteNavControl from "./vote-nav-control";
import OnlyLandscape from "@/components/only-landscape";
import LoadingSpinner from "@/components/loading-spinner";
import InvalidElection from "../../_components/invalid-election";

import {
    TCandidatewithPosition,
    TElectionWithPositionAndCandidates,
    TMemberAttendeesMinimalInfo,
} from "@/types";
import { handleAxiosErrorMessage } from "@/utils";

type Props = {
    election: TElectionWithPositionAndCandidates;
};

const VoteWindow = ({ election }: Props) => {
    const totalPositions = election.positions.length - 1;
    const [currentPage, setCurrentPage] = useState(0);
    const [votes, setVotes] = useState<TCandidatewithPosition[]>([]);

    // TODO: Add modal direction

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

    const currentPosition =
        election.positions[
        currentPage > totalPositions - 1 ? totalPositions : currentPage
        ];

    return (
        <div className="w-full max-w-7xl py-16">
            <div className="w-full flex flex-col min-h-[70vh]">
                {currentPage > totalPositions ? (
                    <VoteSummary positions={election.positions} votes={votes} />
                ) : (
                    <>
                        <VoteHeader
                            position={currentPosition}
                            selected={
                                votes.filter(
                                    (votedCandidate) =>
                                        votedCandidate.position.id === currentPosition.id,
                                ).length
                            }
                        />
                        <CandidateList
                            maxSelect={currentPosition.numberOfSelection}
                            chosenCandidates={votes.filter(
                                (votedCandidate) =>
                                    votedCandidate.position.id === currentPosition.id,
                            )}
                            onAdd={(candidate) => {
                                setVotes((prevVotes) => [...prevVotes, candidate]);
                            }}
                            onRemove={(candidate) => {
                                setVotes((prevVotes) =>
                                    prevVotes.filter((voted) => voted.id !== candidate.id),
                                );
                            }}
                            candidates={currentPosition.candidates}
                        />
                    </>
                )}
            </div>
            <VoteNavControl
                currentPage={currentPage}
                lastPage={totalPositions}
                onBack={() => setCurrentPage((prev) => prev - 1)}
                onNext={() => setCurrentPage((prev) => prev + 1)}
                onFinalize={() => { }}
                canNext={
                    votes.filter(
                        (votedCandidate) =>
                            votedCandidate.position.id === currentPosition.id,
                    ).length > 0
                }
            />

            <OnlyLandscape />
        </div>
    );
};

export default VoteWindow;
