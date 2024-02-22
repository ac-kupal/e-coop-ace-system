import React from 'react'
import CandidateTable from './_components/candidate-table'

const page = () => {
  return (
    <div className='p-5'>
      <CandidateTable positionId={1} electionId={1}></CandidateTable>
    </div>
  )
}

export default page