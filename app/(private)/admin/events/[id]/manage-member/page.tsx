import React from 'react'
import MemberTable from './_components/member-table'
import { getEventId } from '@/services/event'
import { CodeSquare } from 'lucide-react'
import NotFound from '../_components/not-found'

type Props = {
  params:{id:number}
}

const page = async ({params}:Props) => {

  const EventId = await getEventId(params.id)
  if(!EventId) return <NotFound></NotFound>
  
  return (
    <div className=''>
      <MemberTable id={EventId}></MemberTable>
    </div>
  )
}

export default page