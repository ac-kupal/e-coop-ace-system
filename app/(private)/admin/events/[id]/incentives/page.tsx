import React from "react";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { allowed } from "@/lib/utils";
import IncentivesTable from "./_components/incentives-table";
import { eventIdParamSchema } from "@/validation-schema/commons";

type Props = { params : { id : number }};

const Branches = async ({ params } : Props) => {
  const user = await currentUserOrThrowAuthError();

  if (!allowed(["root", "admin"], user.role))
    throw new Error("You don't have access to this page");
  
  const eventId = eventIdParamSchema.parse(params.id);

  return (
    <div className="flex p-4 min-h-screen flex-col w-full">
      <IncentivesTable eventId={eventId}/>
    </div>
  );
};

export default Branches;
