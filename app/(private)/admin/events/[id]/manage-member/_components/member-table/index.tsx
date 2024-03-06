"use client";
import React, { useState } from "react";

import { Mails, Plus, ScanLine, SearchIcon, Send } from "lucide-react";

import columns from "./column";
import { Button } from "@/components/ui/button";
import ActionTooltip from "@/components/action-tooltip";
import ImportFileModal from "../modals/import-file-modal";
import LoadingSpinner from "@/components/loading-spinner";
import DataTable from "@/components/data-table/data-table";
import CreateMemberModal from "../modals/create-member-modal";
import SearchInput from "@/components/data-table/table-search-input";
import DataTablePagination from "@/components/data-table/data-table-pagination";
import DataTableViewOptions from "@/components/data-table/data-table-view-options";
import { getAllEventMembers, useBroadcastOTP } from "@/hooks/api-hooks/member-api-hook";
import DataTableBasicPagination2 from "@/components/data-table/data-table-basic-pagination-2";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { useQrReaderModal } from "@/stores/use-qr-scanner";
import SkippedMemberModal from "../modals/skipped-member-modal";

type Props = {
    id: number;
};

const MemberTable = ({ id }: Props) => {

    const [globalFilter, setGlobalFilter] = useState<string>("");

    const [createMember, setCreateMember] = useState(false);

    const [onImportModal, setOnImportModal] = useState(false);

    const [onSkippedMemberModal,setOnSkippedMemberModal] = useState(false)

    const { broadcastOTP, isBroadcasting } = useBroadcastOTP(id);
    const { data, isError, isLoading, isFetching } = getAllEventMembers(id);
    const { onOpenQR } = useQrReaderModal();

    if (data === undefined)
        return <h1 className=" animate-pulse">Loading...</h1>;

    const table = useReactTable({
        data,
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
        },
        onGlobalFilterChange: setGlobalFilter,
    });
    return (
        <div className=" space-y-5">
            <div className="flex flex-wrap items-center justify-between p-3 rounded-xl gap-y-2 bg-secondary/50 ">
                <CreateMemberModal
                    eventId={id}
                    state={createMember}
                    onClose={(state) => setCreateMember(state)}
                />
                <ImportFileModal
                    id={id}
                    onOpenSkippedModal={(state) => setOnSkippedMemberModal(state)}
                    state={onImportModal}
                    onClose={(state) => setOnImportModal(state)}
                />
                <SkippedMemberModal
                  state={onSkippedMemberModal}
                  onClose={(state) => setOnSkippedMemberModal(state)}
                />
                <div className="flex items-center gap-x-4 text-muted-foreground">
                    <div className="relative">
                        <SearchIcon className="absolute  w-4 h-auto top-3 left-2" />
                        <SearchInput
                            setGlobalFilter={(e) => setGlobalFilter(e)}
                            globalFilter={globalFilter}
                        />
                    </div>
                    <ActionTooltip content="Scan Passbook Number">
                        <Button variant="ghost" size="icon" className="cursor-pointer bg-transparent " onClick={()=> onOpenQR({ onRead : (val) => setGlobalFilter(val) }) } >
                            <ScanLine className="size-4" />
                        </Button>
                    </ActionTooltip>
                </div>
                <div className="flex items-center flex-1 overflow-y-scroll gap-x-2 md:gap-x-4">
                    <DataTableViewOptions table={table} />
                    <ActionTooltip
                        side="top"
                        align="center"
                        content={
                            <div className="flex items-center gap-x-2">
                                <Mails className="size-4" /> Send OTP to
                                all members via email address.
                            </div>
                        }
                    >
                        <Button
                            size="sm"
                            className={cn(
                                "flex bg-[#5B9381] gap-x-2  hover:bg-[#5B9381]/70 rounded-md justify-center items-center md:space-x-2 md:min-w-[7rem]"
                            )}
                            disabled={isBroadcasting} 
                            onClick={() => {
                              
                               broadcastOTP();
                            }}
                        >   Send all OTP
                            {
                                isBroadcasting ? <LoadingSpinner /> :  <Send className="w-4 h-4" />
                            }
                        </Button>
                    </ActionTooltip>
                    <Button
                        size="sm"
                        className={cn(
                            "flex bg-[#5B9381] hover:bg-[#5B9381]/70 rounded-md justify-center items-center md:space-x-2 md:min-w-[7rem]"
                        )}
                        onClick={() => {
                            setCreateMember(true);
                        }}
                    >
                        Add Member
                        <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                        size="sm"
                        className={cn(
                            "flex bg-[#5B9381] hover:bg-[#5B9381]/70 rounded-md justify-center items-center md:space-x-2 md:min-w-[7rem]"
                        )}
                        onClick={() => {
                            setOnImportModal(true);
                        }}
                    >
                        <p> import csv</p>
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <DataTable
                className="flex-1 bg-background/50 rounded-xl py-5 overflow-y-auto max-h-[70vh] overflow-auto overscroll-y-none"
                isError={isError}
                isLoading={isLoading || isFetching}
                table={table}
            />
            <div className="lg:hidden">
                <DataTableBasicPagination2 table={table} />
            </div>
            <div className="hidden lg:block">
                <DataTablePagination
                    pageSizes={[20, 40, 60, 80, 100]}
                    table={table}
                />
            </div>
        </div>
    );
};

export default MemberTable;
