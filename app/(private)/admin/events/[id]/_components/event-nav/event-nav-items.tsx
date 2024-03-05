"use client"
import {  TNavListRoute } from "@/types";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
   route: TNavListRoute;
   eventId : number;
};

const EventNavItems = ({ route, eventId }: Props) => {
   const { icon, path, name } = route;
   const pathname = usePathname();
   const isCurrentPath = pathname.includes(path);

   const finalPath = `/admin/events/${eventId}/${path}`

   return (
      <Link href={finalPath} className="flex cursor-pointer justify-start space-x-2  hover:scale-105">
         <div className={`flex lg:space-x-2 duration-300  items-center px-2 lg:px-5  ease-in-out ${isCurrentPath ? "text-[#099065] font-bold":"text-foreground/90 "}  hover:bg-none border-b p-2 rounded-xl`}>
            <div className={`${isCurrentPath ? "  dark:text-[#17f5af] font-bold":"text-foreground/90 "} hidden lg:block `}>
               {icon}
            </div>
            <h1 className={`text-[min(16px,3.2vw)] ${isCurrentPath ? "font-bold":"font-normal"}`}>{name}</h1>
         </div>
      </Link>
   );
};

export default EventNavItems;
