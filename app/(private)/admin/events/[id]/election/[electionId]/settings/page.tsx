"use client";
import React from "react";
import { getElectionWithPositionAndCandidates } from "@/hooks/api-hooks/election-api-hooks";
import SettingsForm from "./_components/settings-form";
import NotFound from "../_components/not-found";
import Loading from "../_components/loading";
import Header from "../_components/header";


type Props = {
   params: { id: number; electionId: number };
};


const Settings = ({ params }: Props) => {

   const { elections, isLoading, error } = getElectionWithPositionAndCandidates({params});
   
   if (isLoading)return (  <Loading/>);
   
   if(!elections) return <NotFound></NotFound>


   return (
      <div className="space-y-2 p-2">
        <Header text="Manage Settings"></Header>
         <p className="text-sm p-2">
            You can view this page because you are one of the administrators.
            This privilege grants authorized individuals the ability to access
            and navigate this page, ensuring that only designated administrators
            can view its content and perform administrative tasks.
         </p>
         <SettingsForm params={params} election={elections}></SettingsForm>
      </div>
   );
};

export default Settings;
