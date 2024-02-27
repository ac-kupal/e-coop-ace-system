"use client"
import { TElectionRoute } from "@/types";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
   route: TElectionRoute;
};

const ElectionNavItems = ({ route}: Props) => {
   const { icon, path, name } = route;
   const pathname = usePathname();
   const isCurrentPath = pathname.includes(path);

   return (
      <Link href={`${path}`} className="flex px-5 cursor-pointer justify-start space-x-2">
         <div className={`flex space-x-2 duration-300 ease-in-out ${isCurrentPath ? "bg-white dark:bg-gradient-to-l dark:to-[#1E1D1E]  dark:from-primary text-primary dark:text-[#17f5af] font-bold":" text-muted-foreground"}
                      px-5  ease-in-out duration-300 hover:bg-white hover:text-primary dark:hover:bg-gradient-to-l dark:hover:to-[#1E1D1E] dark:hover:from-primary dark:hover:text-[#17f5af] shadow-sm p-2 rounded-xl`}>
            <div className="">
            {icon}
            </div>
            <h1 className="">{name}</h1>
         </div>
      </Link>
   );
};

export default ElectionNavItems;
