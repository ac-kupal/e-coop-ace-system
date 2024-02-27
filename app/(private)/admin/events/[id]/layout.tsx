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
        <div className="bg-[#e1e1e1] dark:bg-[#110f0e] font-poppins p-7 h-screen overflow-hidden">
            <div className="p-5 w-full">
            <EventNavBar />
            </div>
            <div className="flex bg-secondary shadow-xl dark:bg-secondary/30 rounded-3xl overflow-x-hidden p-8 w-full ">
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
