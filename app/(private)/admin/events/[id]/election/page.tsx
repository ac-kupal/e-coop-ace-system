import React from 'react'
import { getEvent } from '@/app/api/v1/event/_services/events'
import ManageElection from './manage-election/election'

const ElectionPage = async({ params }: { params: { id: number } }) => {
  
  const getElection = await getEvent(params.id)
  const election = getElection?.election === undefined  ? null : getElection?.election
  return (
    <div>
        <h1 className="text-2xl font-semibold">Manage Election</h1>
        <ManageElection election={election}></ManageElection>
    </div>
  )
}

export default ElectionPage