"use client"
import React from 'react'
import ClaimWindow from './claim-window'

type Props = {
    eventId : number
}

const ClaimHome = ({ eventId }: Props) => {
    return (
        <div className="flex flex-col py-20 px-5 gap-y-6 min-h-screen w-full items-center">
            <div className="w-5 h-2 bg-orange-400 rounded-full" />
            <div className="py-16">
                <ClaimWindow eventId={eventId} />
            </div>
        </div>
    );
}

export default ClaimHome