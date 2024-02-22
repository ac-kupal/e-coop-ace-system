"use client"
import { TElectionRoute } from "@/types";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
   route: TElectionRoute;
   id:number
};

const ElectionNavItems = ({ route,id}: Props) => {
   const { icon, path, name } = route;
   const pathname = usePathname();
   const isCurrentPath = pathname.includes(path);

   return (
      <Link href={`${path}`} className="flex px-5 cursor-pointer justify-start space-x-2">
         <div className={`flex space-x-2 ${isCurrentPath ? "bg-white text-[#099065]":" text-muted-foreground"} px-5  hover:bg-white shadow-sm p-2 rounded-xl`}>
            <div className="">
            {icon}
            </div>
            <h1 className="">{name}</h1>
         </div>
      </Link>
   );
};

export default ElectionNavItems;
