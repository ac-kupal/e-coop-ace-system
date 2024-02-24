import React from 'react'
import db from "@/lib/database"
import InvalidElection from '../_components/invalid-election'

type Props = {
    params : { id : number }
}

const VotePage = async ({ params }: Props) => {

  const election = await db.election.findUnique({ where : { eventId : params.id }, include : { event : true }}) 

  if(!election) return <InvalidElection message="Election doesn't exist" />

  return (
        <div className="flex flex-col py-20 px-5 gap-y-6 min-h-screen w-full items-center">
            <p className="text-2xl lg:text-4xl uppercase text-center">{election.electionName}</p>
            <div className="w-5 h-2 bg-orange-400 rounded-full"/>
            <div className="py-16">
            </div>
        </div>
  )
}

export default VotePage
