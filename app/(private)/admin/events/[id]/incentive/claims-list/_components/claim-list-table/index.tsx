"use client";
import React, { useEffect, useRef } from "react";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    HandHeart,
    MonitorSmartphone,
    SearchIcon,
    User,
    Users,
} from "lucide-react";

import columns from "./column";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/data-table/data-table";
import DataTablePagination from "@/components/data-table/data-table-pagination";
import DataTableViewOptions from "@/components/data-table/data-table-view-options";
import { useClaimsMasterList } from "@/hooks/api-hooks/incentive-api-hooks";
import {
    DataTableFacetedFilter,
    FacetedOptionType,
} from "@/components/data-table/data-table-facited-filter";
import { useSession } from "next-auth/react";
import { userList } from "@/hooks/api-hooks/user-api-hooks";

const claimFromFilter: FacetedOptionType[] = [
    {
        label: "Assisted",
        value: "Assisted",
        icon: HandHeart,
    },
    {
        label: "Online",
        value: "Online",
        icon: MonitorSmartphone,
    },
];

const ClaimListTable = ({ eventId }: { eventId: number }) => {
    const [globalFilter, setGlobalFilter] = React.useState("");
    const onFocusSearch = useRef<HTMLInputElement | null>(null);
    const { data : users } = userList();
    const { data } = useSession();

    const myFilter =
        data && data.user
            ? [
                  {
                      label: "You",
                      value: data.user.id.toString(),
                      icon: User,
                  },
              ]
            : [];

    const { claimList, isError, isLoading, isFetching } =
        useClaimsMasterList(eventId);

    const table = useReactTable({
        data: claimList,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
        },
        initialState: {
            pagination: { pageIndex: 0, pageSize: 20 },
            columnVisibility: { "Claim Id": false },
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    useEffect(() => {
        const shortCutCommand = (event: KeyboardEvent) => {
            if (
                (event.ctrlKey && event.key === "k") ||
                (event.altKey && event.key === "k") ||
                (event.metaKey && event.key === "k")
            ) {
                event.preventDefault();
                onFocusSearch.current?.focus();
            }
        };
        window.addEventListener("keydown", shortCutCommand);
        return () => {
            window.removeEventListener("keydown", shortCutCommand);
        };
    }, []);

    return (
        <div className="flex flex-1 flex-col  gap-y-5 ">
            <div className="flex flex-wrap items-center justify-between p-3 rounded-xl gap-y-2 bg-primary dark:border dark:bg-secondary/70 ">
                <div className="flex items-center gap-x-4 text-muted-foreground">
                    <div className="relative text-white flex">
                        <SearchIcon className="absolute w-4 h-auto top-3 left-2" />
                        <Input
                            ref={onFocusSearch}
                            placeholder="Search..."
                            value={globalFilter}
                            onChange={(event) =>
                                setGlobalFilter(event.target.value)
                            }
                            className="w-full pl-8 bg-transparent border-white placeholder:text-white/70 border-0 border-b text-sm md:text-base ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                    {data && data.user.role !== "staff" && (
                        <>
                            <DataTableFacetedFilter
                                options={claimFromFilter}
                                column={table.getColumn("Claim Mode")}
                                title="Claim Mode"
                            />
                            <DataTableFacetedFilter
                                options={[
                                    ...myFilter,
                                    ...users.filter((user)=> user.id !== data.user.id ).map((user)=>({
                                        label: user.name,
                                        value: user.id.toString(),
                                        icon: User
                                    }))
                                ]}
                                column={table.getColumn("Assisted By")}
                                title="Assiste by"
                            />
                        </>
                    )}
                </div>
                <div className="flex items-center gap-x-2 md:gap-x-4">
                    <DataTableViewOptions table={table} />
                </div>
            </div>
            <DataTable
                className="flex-1 bg-background dark:bg-secondary/30 rounded-2xl"
                isError={isError}
                isLoading={isLoading || isFetching}
                table={table}
            />
            <DataTablePagination
                pageSizes={[20, 40, 60, 80, 100]}
                table={table}
            />
        </div>
    );
};

export default ClaimListTable;
