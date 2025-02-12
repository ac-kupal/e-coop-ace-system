"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { ScanLine, SearchIcon, User } from "lucide-react";

import columns from "./column";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/data-table/data-table";
import DataTablePagination from "@/components/data-table/data-table-pagination";
import DataTableViewOptions from "@/components/data-table/data-table-view-options";

import { useAttendanceList } from "@/hooks/api-hooks/attendance-api-hooks";
import { useSession } from "next-auth/react";
import { userList } from "@/hooks/api-hooks/user-api-hooks";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-facited-filter";
import { tableToExcel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SiMicrosoftexcel } from "react-icons/si";
import { utils, write, writeFile, writeXLSX } from "xlsx";
import useDebounce from "@/hooks/use-debounce";
import ActionTooltip from "@/components/action-tooltip";
import { useQrReaderModal } from "@/stores/use-qr-scanner";

const AttendanceTable = ({ eventId }: { eventId: number }) => {
    const tableRef = useRef(null);
    const [searchVal, setSearchVal] = useState("");
    const [globalFilter, setGlobalFilter] = useState("");
    const onFocusSearch = useRef<HTMLInputElement | null>(null);

    const { attendanceList, isLoading, isError, isFetching } =
        useAttendanceList(eventId);

    const { data: users } = userList();
    const { data: userData } = useSession();

    const { onOpenQR } = useQrReaderModal();

    const debouncedValue = useDebounce<string>(searchVal, 500);

    useEffect(() => {
        setGlobalFilter(debouncedValue);
    }, [debouncedValue, setGlobalFilter]);

    const myFilter =
        userData && userData.user
            ? [
                  {
                      label: "You",
                      value: userData.user.id.toString(),
                      icon: User,
                  },
              ]
            : [];

    const table = useReactTable({
        data: attendanceList,
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
            columnVisibility: {
                emailAddress: false,
                middleName: false,
                contact: false,
            },
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

    const exportToExcel = () => {
        const modifiedAttendance = attendanceList.map((attendance) => {
            return {
                pbno: attendance.passbookNumber,
                firstname: attendance.firstName,
                lastname: attendance.lastName,
                sex: attendance.gender,
            };
        });
        var wb = utils.book_new();
        var ws = utils.json_to_sheet(modifiedAttendance);
        utils.book_append_sheet(wb, ws, "attendance_list");
        writeFile(wb, "attendance_list.xlsx");
    };

    return (
        <div className="flex flex-1 flex-col  gap-y-5 ">
            <div className="flex flex-wrap items-center justify-between p-3 rounded-xl gap-y-2 bg-primary dark:border dark:bg-secondary/70 ">
                <div className="flex items-center gap-x-4 text-muted-foreground">
                    <div className="relative text-white">
                        <SearchIcon className="absolute w-4 h-auto top-3 left-2" />
                        <Input
                            value={searchVal}
                            ref={onFocusSearch}
                            placeholder="Search..."
                            onChange={(event) =>
                                setSearchVal(event.target.value)
                            }
                            className="w-full pl-8 bg-transparent border-white placeholder:text-white/70 border-0 border-b text-sm md:text-base ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                    {userData && userData.user.role !== "staff" && (
                        <DataTableFacetedFilter
                            options={[
                                ...myFilter,
                                ...users
                                    .filter(
                                        (user) => user.id !== userData.user.id
                                    )
                                    .map((user) => ({
                                        label: user.name,
                                        value: user.id.toString(),
                                        icon: User,
                                    })),
                            ]}
                            column={table.getColumn("registered by")}
                            title="Registered by"
                        />
                    )}
                </div>
                <div className="flex items-center gap-x-1">
                    <div className="">
                        <ActionTooltip content="Scan Passbook Number">
                            <Button
                                variant="secondary"
                                size="sm"
                                className="cursor-pointer  "
                                onClick={() =>
                                    onOpenQR({
                                        onScan: (val) => {
                                            if (val.length === 0) return;
                                            setSearchVal(val[0].rawValue);
                                        },
                                    })
                                }
                            >
                                <ScanLine className="size-4" />
                            </Button>
                        </ActionTooltip>
                    </div>
                    <DataTableViewOptions table={table} />
                    <Button
                        disabled={isFetching}
                        className="gap-x-2"
                        onClick={() => {
                            exportToExcel();
                            // const wb = utils.table_to_book(tableRef.current);
                            // writeFile(wb, `${electionName}_reports.xlsx`);
                        }}
                    >
                        <SiMicrosoftexcel className="size-4" /> Export
                    </Button>
                </div>
            </div>
            <DataTable
                tableRef={tableRef}
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

export default AttendanceTable;
