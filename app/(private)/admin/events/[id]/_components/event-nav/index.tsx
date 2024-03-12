import { TEventWithElection, TNavListRoute } from "@/types";
import {
   Gift,
   ListChecks,
   Users,
   Vote,
   Wrench,
} from "lucide-react";
import React from "react";
import EventNavItems from "./event-nav-items";

export const EventRoutes: TNavListRoute[] = [
   {
      icon: <Users className="size-5" />,
      name: "Members",
      path: "manage-member",
   },
   {
      icon: <ListChecks className=" size-5" />,
      name: "Attendance",
      path: "attendance",
   },
   {
      icon: <Gift className="size-5" />,
      name: "Incentive",
      path: "incentive",
   },
   {
      icon: <Wrench className="size-5" />,
      name: "Event Settings",
      path: "event-settings",
   },
];

type Props = {
   hasElection: boolean;
};

const EventNav = ({ event }: { event: TEventWithElection }) => {
   const EventNavRoutes: TNavListRoute[] = [
      ...EventRoutes,
      ...(event.election
         ? [
              {
                 icon: <Vote className="size-5" />,
                 name: "Election",
                 path: `election/${event.election.id}`,
              },
           ]
         : []),
   ];

   return (
      <div>
         <div className="flex space-x-1 flex-wrap w-full justify-start lg:justify-start ">
            {EventNavRoutes.map((route: TNavListRoute, i) => {
               return (
                  <EventNavItems eventId={event.id} route={route} key={i} />
               );
            })}
         </div>
      </div>
   );
};

export default EventNav;
