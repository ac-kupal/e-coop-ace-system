"use client";
import axios from "axios";
import { toast } from "sonner";
import React, { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

import { Plus, SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/data-table/data-table";
import DataTablePagination from "@/components/data-table/data-table-pagination";
import DataTableViewOptions from "@/components/data-table/data-table-view-options";
import columns from "./column";
import {
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { handleAxiosErrorMessage } from "@/utils";
import { userTypeWithBranchAndRoles } from "@/types/user";

type Props = {};

const UserTable = (props: Props) => {
    const [globalFilter, setGlobalFilter] = React.useState("");
    const onFocusSearch = useRef<HTMLInputElement | null>(null);

    const { data, isFetching, isLoading, isError, refetch } = useQuery<userTypeWithBranchAndRoles[], string>({
        queryKey: ["user-list-query"],
        queryFn: async () => {
            try {
                const response = await axios.get("/api/v1/user");
                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action : {
                        label : "try agian",
                        onClick : () => refetch()
                    }
                });
                throw handleAxiosErrorMessage(e);
            }
        },
        initialData: [],
    });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
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
        <div className="flex flex-1 flex-col gap-y-2 ">
            <div className="flex flex-wrap items-center justify-between p-3 rounded-lg gap-y-2 bg-background">
                <div className="flex items-center gap-x-4 text-muted-foreground">
                    <div className="relative">
                        <SearchIcon className="absolute w-4 h-auto top-3 left-2" />
                        <Input
                            ref={onFocusSearch}
                            placeholder="Search..."
                            value={globalFilter}
                            onChange={(event) =>
                                setGlobalFilter(event.target.value)
                            }
                            className="w-full pl-8 border-0 border-b text-sm md:text-base ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-x-2 md:gap-x-4">
                    <DataTableViewOptions table={table} />
                    <Button
                        size="sm"
                        className="flex rounded-md justify-center items-center md:space-x-2 md:min-w-[7rem]"
                        // onClick={() => onOpen("createUser")}
                    >
                        Add Admin
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <DataTable className="flex-1" isError={isError} isLoading={isLoading || isFetching} table={table} />
            <DataTablePagination  table={table}/>
        </div>
    );
};

export default UserTable;
