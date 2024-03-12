"use client";
import React, { useEffect, useRef, useState } from "react";

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
import { Input } from "@/components/ui/input";

type Props = {
    id: number;
};

const MemberTable = ({ id }: Props) => {
    const onFocusSearch = useRef<HTMLInputElement | null>(null);

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
        <div className="space-y-5 min-h-screen">
            <div className="flex flex-wrap items-center p-3 justify-between rounded-xl gap-y-2  bg-background dark:border dark:bg-secondary/70 ">
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
                <div className="flex flex-wrap space-y-2 lg:space-y-0 relative w-full items-center gap-x-4 text-muted-foreground">
                    <div className="flex-grow lg:flex-none relative">
                        <SearchIcon className="absolute w-4 h-auto top-3 text-muted-foreground left-2" />
                        <Input
                                ref={onFocusSearch}
                                placeholder="Search..."
                                value={globalFilter}
                                onChange={(event) =>
                                    setGlobalFilter(event.target.value)
                                }
                                className="w-full pl-8 bg-transparent text-muted-foreground placeholder:text-muted-foreground border-0 border-b text-sm md:text-base ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        ></Input>
                    </div>
                    <div className="">
                    <ActionTooltip  content="Scan Passbook Number">
                        <Button variant="ghost" size="icon" className="cursor-pointer bg-transparent " onClick={()=> onOpenQR({ onRead : (val) => setGlobalFilter(val) }) } >
                            <ScanLine className="size-4" />
                        </Button>
                    </ActionTooltip>
                    </div>
                    <div className="flex-grow"></div>
                     <div className="flex-none flex items-center space-x-3">
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
                        >   <p>Send all <span className="hidden lg:inline-block">OTP</span></p>
                            {
                                isBroadcasting ? <LoadingSpinner /> :  <Send className="w-4 h-4" />
                            }
                        </Button>
                        </ActionTooltip>
                     </div>
                    <div className="flex-none">
                        <Button
                            size="sm"
                            className={cn(
                                "flex bg-[#5B9381] hover:bg-[#5B9381]/70 rounded-md justify-center items-center md:space-x-2 md:min-w-[7rem]"
                            )}
                            onClick={() => {
                                setCreateMember(true);
                            }}
                        >
                            <p>Add <span className="hidden lg:inline-block">Member</span></p>
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                    <Button
                        size="sm"
                        className={cn(
                            "flex-none flex bg-[#5B9381] hover:bg-[#5B9381]/70 rounded-md justify-center items-center md:space-x-2 md:min-w-[7rem]"
                        )}
                        onClick={() => {
                            setOnImportModal(true);
                        }}
                    >
                        <p>csv <span className="hidden lg:inline-block">import</span></p>
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
              
            </div>
            <DataTable
                className="py-5 overflow-y-auto h-screen overflow-auto overscroll-y-none flex-1 bg-background dark:bg-secondary/30 rounded-2xl"
                isError={isError}
                isLoading={isLoading || isFetching}
                table={table}
            />
            <div className="lg:hidden ">
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
