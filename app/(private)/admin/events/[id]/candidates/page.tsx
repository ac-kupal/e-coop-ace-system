import React from 'react'
import CandidateTable from './_components/candidate-table'
import { getPosition } from '@/hooks/api-hooks/position-api-hooks'
import { getElectionId } from '@/app/api/v1/event/_services/events'
import NotFound from '../_components/not-found'

type Props = {
  params:{id:number}
}

const page = async({params}:Props) => {
  
  const electionId = await getElectionId(params.id)
  if (!electionId) return <NotFound></NotFound>;
  
  return (
    <div className='w-full'>
      <CandidateTable electionId={electionId}></CandidateTable>
    </div>
  )
}

export default page