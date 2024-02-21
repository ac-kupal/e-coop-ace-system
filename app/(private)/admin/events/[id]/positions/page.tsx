import React from 'react'
import PositionTable from './_components/position-table'
import { getEvent } from '@/app/api/v1/event/_services/events';

const PositionPage = async({params}:{params:{id:number}}) => {
  
  const getUniqueEvent = await getEvent(params.id);

  return (
    <div className='p-5'>
      <PositionTable electionId={getUniqueEvent?.election?.id}></PositionTable>
    </div>
  )
}    

export default PositionPage