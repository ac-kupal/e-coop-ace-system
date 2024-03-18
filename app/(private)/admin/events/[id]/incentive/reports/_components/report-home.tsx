"use client";
import React, { useState } from "react";

import { FaFilter } from "react-icons/fa";
import { SiMicrosoftexcel } from "react-icons/si";

import { Button } from "@/components/ui/button";
import FilterModal from "./modals/filter-modal";

type Props = { eventId: number };

const ReportHome = ({ eventId }: Props) => {
    const [filter, setFilter] = useState(false);
    const [ids, setIds] = useState<number[]>([]);

    return (
        <div className="flex flex-col gap-y-2 p-4">
            <FilterModal
                state={filter}
                onClose={(state) => setFilter(state)}

                selectedIds={ids}
                setIds={(ids) => setIds(ids)}
            />
            <div className="flex gap-x-2 justify-end">
                <Button variant={"secondary"} onClick={() => setFilter(!filter)} className="gap-x-2">
                    <FaFilter className="size-4" /> Filter
                </Button>
                <Button className="gap-x-2">
                    <SiMicrosoftexcel className="size-4" /> Export
                </Button>
            </div>
        </div>
    );
};

export default ReportHome;
