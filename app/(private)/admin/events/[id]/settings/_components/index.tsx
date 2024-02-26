"use client";
import React from "react";

import { TElection } from "@/types";
import { getElection } from "@/hooks/api-hooks/election-api-hooks";
import SettingsForm from "./settings-form";
import NotFound from "../../_components/not-found";

type Props = {
   id: number;
};


const Settings = ({ id }: Props) => {
   //const [isToggle,setIsToggle] = useState(false)

   const election = getElection(id)
   if(!election.data) return <NotFound></NotFound>

   return (
      <div className="space-y-2 p-2">
         <h1 className="text-2xl font-medium">Settings</h1>
         <p className="text-sm">
            You can view this page because you are one of the administrators.
            This privilege grants authorized individuals the ability to access
            and navigate this page, ensuring that only designated administrators
            can view its content and perform administrative tasks.
         </p>
         {/* <Toggle onClick={()=>{setIsToggle(prev => !prev)}} >
          {isToggle ? "off" : "on"}
         </Toggle> */}

         <SettingsForm election={election.data}></SettingsForm>
      </div>
   );
};

export default Settings;
