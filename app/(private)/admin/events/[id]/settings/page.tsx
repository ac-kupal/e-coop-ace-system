import React from 'react'
import Settings from './_components'
import { getElectionId } from '@/app/api/v1/event/_services/events'
import NotFound from '../_components/not-found'

const page = async ({params}:{params:{id:number}}) => {

  const electionId = await getElectionId(params.id)
     if(!electionId) return <NotFound></NotFound>

  return (
     <Settings id={electionId}></Settings>
     )
}

export default page