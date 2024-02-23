"use client";
import { TMemberAttendees } from "@/types";
import React, { useState } from "react";
import VoterSearch from "./voter-search";
import MemberInfoDisplay from "../../../_components/member-info-display";

type Props = {
    eventId: number;
    electionId: number;
};

const ValidateVoter = ({ eventId, electionId }: Props) => {
    const [voter, setVoter] = useState<TMemberAttendees | null>(null);

    if (!voter)
        return (
            <VoterSearch
                eventId={eventId}
                electionId={electionId}
                onFound={(voter) => setVoter(voter)}
            />
        );

    return (
        <div className="flex flex-col gap-y-16">
            <MemberInfoDisplay member={voter} />
            <div className="flex flex-col items-center">
                {/*voter.registered ? (
                    <Link className="mx-auto" href={`/events/${params.id}`}>
                        <Button>Go Back to Event</Button>
                    </Link>
                ) : (
                    <RegisterAttendance eventId={params.id} voter={member} />
                )*/}
            </div>
        </div>
    );
};

export default ValidateVoter;
