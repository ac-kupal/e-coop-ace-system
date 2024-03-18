"use client";
import React from "react";

import { SiMicrosoftexcel } from "react-icons/si";

import { Button } from "@/components/ui/button";
import { userList } from "@/hooks/api-hooks/user-api-hooks";

type Props = { eventId: number };

const ReportHome = ({ eventId }: Props) => {
    const { data, isLoading } = userList(); 

    return (
        <div className="flex flex-col gap-y-2 p-4">
            <div className="flex justify-between">
                <div></div>
                <Button className="gap-x-2">
                    <SiMicrosoftexcel className="size-4" /> Export 
                </Button>
            </div>
        </div>
    );
};

export default ReportHome;
