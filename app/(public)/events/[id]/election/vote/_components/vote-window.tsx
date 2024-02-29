"use client";
import { useState } from "react";

import VoteHeader from "./vote-header";
import VoteSummary from "./vote-summary";
import CandidateList from "./candidate-list";
import VoteNavControl from "./vote-nav-control";
import OnlyLandscape from "@/components/only-landscape";
import LoadingSpinner from "@/components/loading-spinner";
import InvalidElection from "../../_components/invalid-election";

import { useCastVote, loadVoter } from "@/hooks/api-hooks/voter-api-hooks";

import {
    TCandidatewithPosition,
    TElectionWithPositionAndCandidates,
} from "@/types";
import { useRouter } from "next/navigation";

type Props = {
    election: TElectionWithPositionAndCandidates;
};

const VoteWindow = ({ election }: Props) => {
    const router = useRouter();
    const totalPositions = election.positions.length - 1;
    const [currentPage, setCurrentPage] = useState(0);
    const [votes, setVotes] = useState<TCandidatewithPosition[]>([]);

    const { isPending, isError, error } = loadVoter(election);
    const { data, castVote, isCasting } = useCastVote(election, (data) => {
        router.push(`/events/${election.eventId}/election/vote/complete`);
    });

    if (isPending)
        return (
            <div className="fixed top-1/2 left-auto gap-x-2 rounded-xl flex items-center justify-center px-3 py-1 bg-secondary/40 backdrop-blur-sm">
                <LoadingSpinner strokeWidth={1} />
                <p className="text-foreground/80 text-sm">
                    checking authorization
                </p>
            </div>
        );

    if (isError && error)
        return <InvalidElection className="text-lg" message={error} />;

    const currentPosition =
        election.positions[
            currentPage > totalPositions - 1 ? totalPositions : currentPage
        ];

    return (
        <div className="w-full max-w-7xl py-2 lg:py-16 pb-4">
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
                                        votedCandidate.position.id ===
                                        currentPosition.id
                                ).length
                            }
                        />
                        <CandidateList
                            maxSelect={currentPosition.numberOfSelection}
                            chosenCandidates={votes.filter(
                                (votedCandidate) =>
                                    votedCandidate.position.id ===
                                    currentPosition.id
                            )}
                            onAdd={(candidate) => {
                                setVotes((prevVotes) => [
                                    ...prevVotes,
                                    candidate,
                                ]);
                            }}
                            onRemove={(candidate) => {
                                setVotes((prevVotes) =>
                                    prevVotes.filter(
                                        (voted) => voted.id !== candidate.id
                                    )
                                );
                            }}
                            candidates={currentPosition.candidates}
                        />
                    </>
                )}
            </div>
            <VoteNavControl
                casted={data}
                currentPage={currentPage}
                lastPage={totalPositions}
                isLoading={isCasting}
                onBack={() => setCurrentPage((prev) => prev - 1)}
                onNext={() => setCurrentPage((prev) => prev + 1)}
                onFinalize={() =>
                    castVote(votes.map((votedCandidate) => votedCandidate.id))
                }
                canFinalize={votes.length > 0}
                canNext={true}
            />
            <OnlyLandscape />
        </div>
    );
};

export default VoteWindow;
