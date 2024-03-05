"use client";
import { useEffect, useState } from "react";

import VoteHeader from "./vote-header";
import VoteSummary from "./vote-summary";
import CandidateList from "./candidate-list";
import VoteNavControl from "./vote-nav-control";
import OnlyLandscape from "@/components/only-landscape";
import LoadingSpinner from "@/components/loading-spinner";

import { useCastVote, loadVoter } from "@/hooks/public-api-hooks/use-vote-api";

import {
    TCandidatewithPosition,
    TElectionWithEventWithPositionAndCandidates,
} from "@/types";
import { useRouter } from "next/navigation";
import InvalidPrompt from "../../../../_components/invalid-prompt";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import { useInfoModal } from "@/stores/use-info-modal-store";
import VoteReminder from "./vote-reminder";

type Props = {
    election: TElectionWithEventWithPositionAndCandidates;
};

const VoteWindow = ({ election }: Props) => {
    const router = useRouter();
    const { onOpen } = useConfirmModal();
    const { onOpen: onOpenInfoModal } = useInfoModal();

    const [currentPage, setCurrentPage] = useState(0);
    const [votes, setVotes] = useState<TCandidatewithPosition[]>([]);

    const { voter, isPending, isError, error } = loadVoter(election);
    const { data, castVote, isCasting } = useCastVote(election, (data) => {
        // if (document.exitFullscreen) document.exitFullscreen();
        router.push(`/events/${election.eventId}/election/vote/complete`);
    });

    const toggleFullScreen = () => {
        if (voter && document) {
            if (!document.fullscreenElement)
                document.documentElement.requestFullscreen();
            else {
                if (document.exitFullscreen) document.exitFullscreen();
            }
        }
    };


    useEffect(() => {
        onOpenInfoModal({
            title: "Election Reminder",
            description: "A short reminder before you start to vote",
            confirmString: "Okay",
            component: <VoteReminder />
        });
    }, []);

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
        return <InvalidPrompt className="text-lg" message={error} />;

    const totalPositions = election.positions.length - 1;
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
                    onOpen({
                        title: "Cast Vote",
                        description:
                            "We suggest that you review your vote first before submitting. If you believe that your selection is correct, you can now proceed on casting your vote.",
                        confirmString: "Cast Vote",
                        cancelString: "Review Vote",
                        onConfirm: () =>
                            castVote(
                                votes.map((votedCandidate) => votedCandidate.id)
                            ),
                    })
                }
                canFinalize={votes.length > 0}
                canNext={true}
            />
            <OnlyLandscape />
        </div>
    );
};

export default VoteWindow;
