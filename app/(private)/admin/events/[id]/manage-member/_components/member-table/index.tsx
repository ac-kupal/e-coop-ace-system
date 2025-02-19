"use client";
import React, { useEffect, useRef, useState } from "react";

import {
    Mails,
    PersonStandingIcon,
    Plus,
    ScanLine,
    SearchIcon,
    Send,
    Users,
} from "lucide-react";

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
import {
    getAllEventMembers,
    useBroadcastOTP,
} from "@/hooks/api-hooks/member-api-hook";
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
import { user } from "next-auth";
import { Role } from "@prisma/client";
import useDebounce from "@/hooks/use-debounce";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import { GrRotateRight } from "react-icons/gr";

type Props = {
    id: number;
    user: user;
};

const MemberTable = ({ id, user }: Props) => {
    const onFocusSearch = useRef<HTMLInputElement | null>(null);
    const [searchVal, setSearchVal] = useState("");
    const [createMember, setCreateMember] = useState(false);
    const [onImportModal, setOnImportModal] = useState(false);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [onSkippedMemberModal, setOnSkippedMemberModal] = useState(false);
    const { onOpenQR } = useQrReaderModal();
    const { broadcastOTP, isBroadcasting } = useBroadcastOTP(id);
    const { data, isError, isLoading, isFetching, refetch } =
        getAllEventMembers(id);
    const { onOpen } = useConfirmModal();

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

    const debouncedValue = useDebounce<string>(searchVal, 500);

    useEffect(() => {
        setGlobalFilter(debouncedValue);
    }, [debouncedValue, setGlobalFilter]);

    const isStaff = user.role === Role.staff;

    if (data === undefined)
        return <h1 className=" animate-pulse">Loading...</h1>;

    return (
        <div className="lg:space-y-5 space-y-2 min-h-[65vh]">
            <div className="flex flex-wrap items-center p-2 justify-between rounded-t-xl gap-y-2 rounded border-b bg-background dark:border dark:bg-secondary/70 ">
                <CreateMemberModal
                    eventId={id}
                    state={createMember}
                    onClose={(state) => setCreateMember(state)}
                />
                <ImportFileModal
                    id={id}
                    onOpenSkippedModal={(state) =>
                        setOnSkippedMemberModal(state)
                    }
                    state={onImportModal}
                    onClose={(state) => setOnImportModal(state)}
                />
                <SkippedMemberModal
                    state={onSkippedMemberModal}
                    onClose={(state) => setOnSkippedMemberModal(state)}
                />
                <div className="flex lg:space-y-2 flex-col lg:flex-row lg:justify-between overflow-auto flex-wrap space-y-2 relative w-full items-center gap-x-4 text-muted-foreground">
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
                    <div className="flex items-center space-x-1  md:justify-start justify-evenly w-full lg:w-fit">
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
                        <DataTableViewOptions className="h-10" table={table} />
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
                        {!isStaff && (
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
                                        "flex  gap-x-2  rounded-md justify-center items-center md:space-x-2 md:min-w-[7rem]"
                                    )}
                                    disabled={isBroadcasting}
                                    onClick={() => {
                                        onOpen({
                                            title: "Bulk OPT Sending",
                                            description:
                                                "You are about to send all members an OTP. Are you sure?",
                                            onConfirm: () => broadcastOTP(),
                                        });
                                    }}
                                >
                                    {" "}
                                    <p>
                                        Send all{" "}
                                        <span className="hidden lg:inline-block">
                                            OTP
                                        </span>
                                    </p>
                                    {isBroadcasting ? (
                                        <LoadingSpinner />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </Button>
                            </ActionTooltip>
                        )}
                        {!isStaff && (
                            <ActionTooltip
                                side="top"
                                align="center"
                                content={
                                    <div className="flex items-center gap-x-2">
                                        <PersonStandingIcon className="size-4" />{" "}
                                        Add Specific Members.
                                    </div>
                                }
                            >
                                <Button
                                    size="sm"
                                    className={cn(
                                        "flex  rounded-md justify-center items-center md:space-x-2 md:min-w-[7rem]"
                                    )}
                                    onClick={() => {
                                        setCreateMember(true);
                                    }}
                                >
                                    <p>
                                        Add{" "}
                                        <span className="hidden lg:inline-block">
                                            Member
                                        </span>
                                    </p>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </ActionTooltip>
                        )}
                        {!isStaff && (
                            <ActionTooltip
                                side="top"
                                align="center"
                                content={
                                    <div className="flex items-center gap-x-2">
                                        <Users className="size-4" /> Bulk
                                        Creation.
                                    </div>
                                }
                            >
                                <Button
                                    size="sm"
                                    className={cn(
                                        "flex-none flex  rounded-md justify-center items-center md:space-x-2 md:min-w-[7rem]"
                                    )}
                                    onClick={() => {
                                        setOnImportModal(true);
                                    }}
                                >
                                    <p>
                                        csv{" "}
                                        <span className="hidden lg:inline-block">
                                            import
                                        </span>
                                    </p>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </ActionTooltip>
                        )}
                    </div>
                </div>
            </div>
            <DataTable
                className="py-5 overflow-y-auto min-h-[65vh] overflow-auto overscroll-y-none flex-1 bg-background dark:bg-secondary/30 rounded-2xl"
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
