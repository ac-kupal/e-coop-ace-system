"use client"
import React, { ReactNode } from "react";
import EventNavBar, { EventRoutes } from "./_components/event-nav/event-nav";
import ElectionSideBar, { ElectionRoutes } from "./_components/election-sidebar";
import { usePathname } from "next/navigation";

type Props = { children : ReactNode};

const EventLayout = ( { children }: Props) => {
    const pathname = usePathname();
    const pathSegments = pathname.split('/');
    const lastPath = pathSegments[pathSegments.length - 1];
    const isCurrentPath = EventRoutes.find((e)=> e.path === lastPath && e.path !== "election" )
    return (
        <div className="bg-secondary/40 font-poppins p-7 h-screen">
            <div className="p-5 w-full">
            <EventNavBar />
            </div>
            <div className="flex bg-white rounded-[2rem] overflow-x-hidden p-8 w-full ">
               <div className="flex w-full">
                {!isCurrentPath &&  <ElectionSideBar/>}
                <div className="p-5 w-full">
                {children}
                </div>
               </div>
            </div>
        </div>
    );
};

export default EventLayout;
