import React from 'react'

import { getEventId } from '@/services/event'
import NotFound from '../_components/not-found'
import MemberTable from './_components/member-table'

type Props = {
  params:{id:number}
}

const page = async ({params}:Props) => {

  const EventId = await getEventId(params.id)
  if(!EventId) return <NotFound></NotFound>
  
  return (
    <div className=' w-full lg:p-8'>
      <MemberTable id={EventId}></MemberTable>
    </div>
  )
}

export default page