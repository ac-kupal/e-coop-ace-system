import React from 'react'
import {  TNavListRoute} from '@/types'
import { LayoutDashboard, Users, Medal, Settings2, Combine } from 'lucide-react'
import ElectionSideBarItems from './election-side-bar-item';
import { Card } from '@/components/ui/card';

export const SideBar:TNavListRoute [] = [
   {
      icon: <LayoutDashboard className="h-5 w-5" />,
      name: "DashBoard",
      path: "dashboard",
   },
   {
      icon: <Combine className="h-5 w-5" />,
      name: "election",
      path: "overview",
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

type Props = {
   params:{id:number,electionId:number}
}

const ElectionSideBar =({params}:Props ) => {
  return (
    <Card className="flex flex-row lg:flex-col w-full h-full py-3 dark:border-0 px-3 lg:px-0  justify-evenly  gap-1 lg:gap-5 lg:py-10 bg-background  lg:min-h-screen  dark:bg-secondary/30 shadow lg:shadow-md  lg:justify-start    ">
    {SideBar.map((route:TNavListRoute, i) => (
       <ElectionSideBarItems params={params} route={route} key={i} />
    ))}
 </Card>
  )
}

export default ElectionSideBar