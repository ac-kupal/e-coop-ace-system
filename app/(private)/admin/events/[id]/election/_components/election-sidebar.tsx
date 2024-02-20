import React from 'react'
import ElectionNavItems from './election-nav-item'
import { TElectionRoute } from '@/types'
import { useSearchParams } from 'next/navigation'
import { TEvent } from '@/types/event/TCreateEvent'
import { LayoutDashboard, Users, Medal, Settings2 } from 'lucide-react'



export const ElectionRoutes: TElectionRoute[] = [
  {
     icon: <LayoutDashboard className="h-5 w-5" />,
     name: "DashBoard",
     path: "dashboard",
  },
  {
     icon: <Users className="h-5 w-5" />,
     name: "Candidates",
     path: "candidates",
  },
  {
     icon: <Medal className="w-5 h-5" />,
     name: "Positions",
     path: "positions",
  },
  {
     icon: <Settings2 className="w-5 h-5" />,
     name: "Settings",
     path: "settings",
  },
];

const ElectionSideBar = () => {
  return (
    <div className="bg-[#ededed] w-[200px] justify-start gap-2 py-10  flex flex-col h-screen">
    {ElectionRoutes.map((route:TElectionRoute, i) => (
       <ElectionNavItems route={route} key={i} />
    ))}
 </div>
  )
}

export default ElectionSideBar