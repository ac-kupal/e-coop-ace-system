import { TElectionRoute } from "@/types";
import React from "react";
import { usePathname } from "next/navigation";

type Props = {
   route: TElectionRoute;
};

const ElectionNavItems = ({ route }: Props) => {
   const { icon, path, name } = route;

   
   const pathname = usePathname();
   const isCurrentPath = pathname.startsWith(path);


   return (
      <div className="flex px-10 cursor-pointer  justify-start space-x-2">
         <div className="flex space-x-2 hover:bg-white shadow-sm p-2 rounded-xl">
            {icon}
            <h1 className="text-[#099065]">{name}</h1>
         </div>
      </div>
   );
};

export default ElectionNavItems;
