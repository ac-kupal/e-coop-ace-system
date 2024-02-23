'use client'
import { TMemberAttendees } from '@/types'
import React, { useState } from 'react'
import VoterSearch from './voter-search'

type Props = {
    eventId : number,
    electionId : number
}

const ValidateVoter = ({ eventId, electionId}: Props) => {
  const [voter, setVoter] = useState<TMemberAttendees | null>(null)

  if(!voter) return <VoterSearch eventId={eventId} electionId={electionId} onFound={(voter)=>setVoter(voter)} />

  return (
    <div>ValidateVoter</div>
  )
}

export default ValidateVoter
