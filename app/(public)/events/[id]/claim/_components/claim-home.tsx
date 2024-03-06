"use client"
import React from 'react'
import LoadingSpinner from '@/components/loading-spinner'
import { useElection } from '@/hooks/public-api-hooks/use-election-api'
import ValidateVoter from './validate-voter'
import InvalidPrompt from '@/components/invalid-prompt'
import ClaimWindow from './claim-window'

type Props = {
    eventId : number
}

const ClaimHome = ({ eventId }: Props) => {

    const { election, isLoading } = useElection(eventId);

    if (isLoading) return <LoadingSpinner className="fixed top-1/2 left-1/2" />;

    if (!election) return <InvalidPrompt />;

    if (election.status === "done")
        return <InvalidPrompt message="This election has ended" />;

    if (election.status != "live")
        return <InvalidPrompt message="Election is not yet open" />;

    return (
        <div className="flex flex-col py-20 px-5 gap-y-6 min-h-screen w-full items-center">
            <p className="text-2xl lg:text-4xl uppercase text-center">
                {election.event.title} claim
            </p>
            <div className="w-5 h-2 bg-orange-400 rounded-full" />
            <div className="py-16">
                {/* <ValidateVoter electionWithEvent={election} /> */}
                <ClaimWindow eventId={eventId} />
            </div>
        </div>
    );
}

export default ClaimHome