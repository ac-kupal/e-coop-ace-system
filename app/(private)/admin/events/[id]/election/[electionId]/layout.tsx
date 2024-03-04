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

    const pathname = usePathname();
    const pathSegments = pathname.split('/');
    const lastPath = pathSegments[pathSegments.length - 1];
    const isCurrentPath = EventRoutes.find((e)=> e.path === lastPath && e.path !== "election" )

    return (
        <div className="font-poppins pt-5 lg:p-7 h-fit overflow-hidden">
            {/* <div className="p-5 w-full">
            <EventNavBar />
            </div>
            */}
            <div className="flex bg-background  border border-[#00000012] min-h-screen shadow-xl dark:bg-secondary/30 py-4 rounded-3xl overflow-x-hidden lg:p-8  w-full ">
               <div className="flex w-full px-2 flex-col lg:flex-row">
                <div>
                 {!isCurrentPath && <>{(<ElectionSideBar params={params} />)}
              </>}
                </div>
                <div className="p-5 w-full">
                {children}
                </div>
               </div>
            </div>  
        </div>
    );
};

export default EventLayout;
