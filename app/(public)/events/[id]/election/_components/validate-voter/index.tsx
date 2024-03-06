"use client";
import React, { useState } from "react";

import VoterSearch from "./voter-search";
import AuthorizeVoter from "./authorize-voter";
import MemberInfoDisplay from "../../../_components/member-info-display";

import { TElectionWithEvent, TMemberAttendeesMinimalInfo } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Props = {
    electionWithEvent: TElectionWithEvent;
};

const ValidateVoter = ({ electionWithEvent }: Props) => {
    const router = useRouter();
    const [voter, setVoter] = useState<TMemberAttendeesMinimalInfo | null>(null);

    if (!voter)
        return (
            <VoterSearch
                eventId={electionWithEvent.event.id}
                electionId={electionWithEvent.id}
                onFound={(voter) => setVoter(voter)}
            />
        );

    return (
        <div className="flex flex-col gap-y-2 lg:gap-y-16">
            <MemberInfoDisplay member={voter} />
            <div className="flex flex-col items-center">
                {voter.voted ? (
                    <div className="flex flex-col items-center gap-y-4">
                        <p className="text-xl lg:text-3xl">You already voted</p>
                        <p>Every member is only allowed to vote once.</p>
                        <Link
                            className="mx-auto"
                            href={`/events/${electionWithEvent.eventId}`}
                        >
                            <Button>Go Back to Event</Button>
                        </Link>
                    </div>
                ) : (
                    <AuthorizeVoter
                        voter={voter}
                        electionWithEvent={electionWithEvent}
                        onAuthorize={() => {
                            router.push(`/events/${electionWithEvent.eventId}/election/vote`)
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default ValidateVoter;
