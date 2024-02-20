"use client";
import { TElection } from "@/types/election/TCreateElection";
import {
   LayoutDashboard,
   Loader2,
   Medal,
   Settings2,
   Users,
} from "lucide-react";
import React from "react";
import NotFound from "./not-found";
import { TElectionRoute } from "@/types";
import ElectionNavItems from "./election-nav-item";
import ElectionSideBar from "./election-sidebar";

type Props = {
   election: TElection;
   isLoading: boolean;
};

export const ElectionRoutes: TElectionRoute[] = [
   {
      icon: <LayoutDashboard className="h-5 w-5" />,
      name: "DashBoard",
      path: "/dashboard",
   },
   {
      icon: <Users className="h-5 w-5" />,
      name: "Candidates",
      path: "/candidates",
   },
   {
      icon: <Medal className="w-5 h-5" />,
      name: "Positions",
      path: "/positions",
   },
   {
      icon: <Settings2 className="w-5 h-5" />,
      name: "Settings",
      path: "/setttings",
   },
];

const Election = ({ election, isLoading }: Props) => {
   console.log(election);

   if (!election) return <NotFound></NotFound>;

   return (
      <div className="w-full h-screen overflow-hidden bg-background rounded-2xl">
         <ElectionSideBar election={ElectionRoutes}></ElectionSideBar>
      </div>
   );
};

export default Election;
