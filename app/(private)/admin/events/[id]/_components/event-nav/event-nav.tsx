import { TElectionRoute } from "@/types";
import { BaggageClaim, GanttChartSquare, Gift, ListChecks, Users, Vote } from "lucide-react";
import React from "react";
import EventNavItems from "./event-nav-items";

export const EventRoutes: TElectionRoute[] = [
   {
      icon: <Vote  className="size-5" />,
      name: "election",
      path: "election",
   },
   {
      icon: <Users  className="size-5" />,
      name: "member",
      path: "manage-member",
   },
   {
      icon: <ListChecks  className=" size-5" />,
      name: "Attendance",
      path: "attendance",
   },
   {
      icon: <Gift className="size-5" />,
      name: "Incentives",
      path: "incentives",
   },
   {
      icon: <BaggageClaim className="size-5" />,
      name: "Claims",
      path: "claims",
   },
];
type Props={
   hasElection:boolean
}

const EventNavBar = () => {
   return (
      <div className="flex space-x-1 -translate-x-4 w-full lg: max-w-[400px]">
        {EventRoutes.map((route: TElectionRoute, i) => {
               return <EventNavItems route={route} key={i} />;
         })}
      </div>
   );
};

export default EventNavBar;
