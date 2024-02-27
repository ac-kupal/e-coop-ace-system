import React from 'react'
import ElectionNavItems from './election-nav-item'
import { TElectionRoute } from '@/types'
import { LayoutDashboard, Users, Medal, Settings2, Combine } from 'lucide-react'

export const ElectionRoutes: TElectionRoute[] = [
   {
      icon: <LayoutDashboard className="h-5 w-5" />,
      name: "DashBoard",
      path: "dashboard",
   },
   {
      icon: <Combine className="h-5 w-5" />,
      name: "election",
      path: "election",
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
const ElectionSideBar =( ) => {
  return (
    <div className="bg-[#ffffff] dark:bg-secondary/50 shadow-xl w-[200px] rounded-3xl justify-start gap-5 py-10  flex flex-col h-screen">
    {ElectionRoutes.map((route:TElectionRoute, i) => (
       <ElectionNavItems  route={route} key={i} />
    ))}
 </div>
  )
}

export default ElectionSideBar