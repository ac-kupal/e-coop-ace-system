import React from 'react'
import ElectionNavItems from './election-nav-item'
import { TElectionRoute } from '@/types'


type Props ={
  election:TElectionRoute[]
}

const ElectionSideBar = ({election}:Props) => {
  return (
    <div className="bg-[#ededed] w-[200px] justify-start gap-2 py-10  flex flex-col h-screen">
    {election.map((route:TElectionRoute, i) => (
       <ElectionNavItems route={route} key={i} />
    ))}
 </div>
  )
}

export default ElectionSideBar