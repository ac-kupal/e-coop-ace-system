import React from "react";
import ManageElection from "./manage-election/_components/election";

const ElectionPage = async ({ params }: { params: { id: number } }) => {
   return (
      <>
         <ManageElection id={params.id}></ManageElection>
      </>
   );
};

export default ElectionPage;
