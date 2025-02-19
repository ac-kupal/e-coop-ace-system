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

import {
    useAttendanceList,
    useAttendanceStats,
} from "@/hooks/api-hooks/attendance-api-hooks";
import { useSession } from "next-auth/react";
import { userList } from "@/hooks/api-hooks/user-api-hooks";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-facited-filter";
import { Button } from "@/components/ui/button";
import { SiMicrosoftexcel } from "react-icons/si";
import { utils, writeFile } from "xlsx";
import useDebounce from "@/hooks/use-debounce";
import ActionTooltip from "@/components/action-tooltip";
import { useQrReaderModal } from "@/stores/use-qr-scanner";
import { Progress } from "@/components/ui/progress";
import LoadingSpinner from "@/components/loading-spinner";
import { GrRotateRight } from "react-icons/gr";
import { toast } from "sonner";

const AttendanceTable = ({ eventId }: { eventId: number }) => {
    const tableRef = useRef(null);
    const [searchVal, setSearchVal] = useState("");
    const [globalFilter, setGlobalFilter] = useState("");
    const onFocusSearch = useRef<HTMLInputElement | null>(null);

    const {
        data: attendanceList,
        isLoading,
        isError,
        isFetching,
        refetch: refetchAttendanceList,
    } = useAttendanceList({ eventId });

    const {
        data: attendanceStats,
        isRefetching: isLoadingAttendanceStats,
        refetch: refetchStats,
    } = useAttendanceStats({
        eventId,
        onError: () => toast.error("Failed to load attendance statistics"),
    });

    const refetch = () => {
        refetchStats();
        refetchAttendanceList();
    };

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
            <div className="flex flex-wrap items-center p-2 justify-between rounded-t-xl gap-y-2 rounded border-b bg-background dark:border dark:bg-secondary/70 ">
                <div className="flex items-center gap-x-4 text-muted-foreground">
                    <div className="w-full lg:w-fit relative">
                        <SearchIcon className="absolute w-4 h-auto top-3 text-muted-foreground left-2" />
                        <Input
                            value={searchVal}
                            ref={onFocusSearch}
                            placeholder="Search..."
                            onChange={(event) =>
                                setSearchVal(event.target.value)
                            }
                            className="w-full pl-8 bg-popover text-muted-foreground placeholder:text-muted-foreground placeholder:text-[min(14px,3vw)] text-sm md:text-base ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                    <div className="flex flex-col py-1.5 bg-muted/40 dark:bg-muted rounded-xl space-y-1.5 px-4 items-center gap-x-2">
                        <span className="text-sm">
                            {attendanceStats.totalIsRegistered || 0} registered
                            / {attendanceStats.totalAttendees || 0} Total
                            Members
                        </span>
                        <div className="flex w-full items-center gap-x-3">
                            {isLoadingAttendanceStats && !attendanceStats ? (
                                <LoadingSpinner />
                            ) : (
                                <span className="text-xs text-primary">
                                    {(
                                        (attendanceStats.totalIsRegistered /
                                            attendanceStats.totalAttendees) *
                                        100
                                    ).toLocaleString("en-US", {
                                        maximumFractionDigits: 1,
                                    })}{" "}
                                    %
                                </span>
                            )}
                            <Progress
                                className="h-1.5 flex-1 bg-popover/80"
                                value={
                                    (attendanceStats.totalIsRegistered /
                                        attendanceStats.totalAttendees) *
                                    100
                                }
                            />
                        </div>
                    </div>
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
                    <Button
                        variant={"secondary"}
                        disabled={isFetching}
                        onClick={() => refetch()}
                        className="gap-x-2"
                        size="icon"
                    >
                        {isFetching ? (
                            <LoadingSpinner />
                        ) : (
                            <GrRotateRight className="size-4" />
                        )}
                    </Button>
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
