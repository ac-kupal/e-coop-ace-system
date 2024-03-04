"use client";
import { usePathname } from "next/navigation";
import React, { ReactNode, useState } from "react";
import Link from "next/link";
import { getElection } from "@/hooks/api-hooks/election-api-hooks";
import NotFound from "./_components/not-found";
import { BaggageClaim, Gift, ListChecks, Users, Vote } from "lucide-react";
import Loading from "./election/[electionId]/_components/loading";

type Props = {
   children: ReactNode;
   params: { id: number; electionId: number };
};

const EventLayout = ({ children, params }: Props) => {
   const pathname = usePathname();
   const pathSegments = pathname.split("/");
   const lastPath = pathSegments[pathSegments.length - 1];
   const { elections,isLoading } = getElection(params.id);
   
   if(isLoading) return <Loading></Loading>
   if (!elections) return <NotFound></NotFound>;
   
   const CurrentPath = ["overview","manage-member","incentives","attendance"].find((e)=> e === lastPath)
    
   return (
      <div className="font-poppins pt-5 lg:p-7 h-fit overflow-hidden">
         <div className="p-5 w-full">
            <div className="w-full flex space-x-5">
               <Link
                  className={`flex items-center space-x-2 duration-300 ease-in-out hover:scale-105  border-b px-4 py-2  rounded-xl ${CurrentPath === "overview" ? "dark:text-[#17f5af] font-bold":"text-foreground/90 "}`}
                  href={`/admin/events/${params.id}/election/${elections.id}/overview`}>
                  <p>Election</p>
                  <Vote className="size-5" />
               </Link>
               <Link
                 className={`flex items-center space-x-2 hover:scale-105 duration-300 ease-in-out   border-b  px-4 py-2  rounded-xl ${CurrentPath === "manage-member" ? "dark:text-[#17f5af] font-bold":"text-foreground/90 "}`}
                  href={`/admin/events/${params.id}/manage-member`}>
                  <p>Members</p>
                  <Users  className="size-5" />
               </Link>
               <Link
                 className={`flex items-center space-x-2 hover:scale-105 duration-300 ease-in-out   border-b  px-4 py-2  rounded-xl ${CurrentPath === "incentives" ? "dark:text-[#17f5af] font-bold":"text-foreground/90 "}`}
                  href={`/admin/events/${params.id}/incentives`}>
                  <p>Incentives</p>
                  <Gift className="size-5" />
               </Link>
               <Link
                 className={`flex items-center space-x-2 hover:scale-105 duration-300 ease-in-out   border-b  px-4 py-2  rounded-xl ${CurrentPath === "attendance" ? "dark:text-[#17f5af] font-bold":"text-foreground/90 "}`}
                  href={`/admin/events/${params.id}/attendance`}>
                  <p>Attendance</p>
                  <ListChecks  className=" size-5" />
               </Link>
            </div>
         </div>
         <div className="flex bg-background  border border-[#00000012] min-h-screen shadow-xl dark:bg-secondary/30 py-4 rounded-3xl overflow-x-hidden lg:p-2  w-full ">
               {children}
         </div>
      </div>
   );
};

export default EventLayout;
