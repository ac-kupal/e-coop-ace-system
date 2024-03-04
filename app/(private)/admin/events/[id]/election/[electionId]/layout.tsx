"use client"
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";
import { EventRoutes } from "../../_components/event-nav/event-nav";
import ElectionSideBar from "../../_components/election-sidebar";
// import EventNavBar, { EventRoutes } from "./_components/event-nav/event-nav";
// import ElectionSideBar from "./_components/election-sidebar";
// import { usePathname } from "next/navigation";

type Props = { 
    children : ReactNode
    params:{id:number,electionId:number}
};

const EventLayout = ( { children ,params}: Props) => {
    return (
        <div className="font-poppins pt-5 lg:p-7 h-fit w-full overflow-hidden">
               <div className="flex w-full px-2 flex-col lg:flex-row">
                <div>
                <ElectionSideBar params={params} />
                </div>
                <div className="p-5 w-full">
                {children}
                </div>
               </div>
        </div>
    );
};

export default EventLayout;
