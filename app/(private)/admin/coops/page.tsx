import React from "react";

import CoopsTable from "./_components/coops-table";

import { currentUserOrFalse } from "@/lib/auth";
import { isAllowed } from "@/lib/utils";

type Props = {};

const Branches = async (props: Props) => {
    const user = await currentUserOrFalse();

    if (!isAllowed(["root"], user))
        throw new Error("You don't have access to this page");

    return (
        <div className="flex p-4 min-h-screen flex-col w-full">
            <CoopsTable />
        </div>
    );
};

export default Branches;
