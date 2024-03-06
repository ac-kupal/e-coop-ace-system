"use client";
import { toast } from "sonner";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { Copy, MenuIcon, Pencil, TabletSmartphone, Trash, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/loading-spinner";
import { DataTableColHeader } from "@/components/data-table/data-table-col-header";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import { TIncentiveClaimsWithIncentiveAttendeeAssistedBy } from "@/types";
import { useDeleteIncentive } from "@/hooks/api-hooks/incentive-api-hooks";
import UserAvatar from "@/components/user-avatar";
import { format } from "date-fns";

const Actions = ({ incentive }: { incentive: TIncentiveClaimsWithIncentiveAttendeeAssistedBy; }) => {
    const [modal, setModal] = useState(false);
    const [assign, setAssign] = useState(false);
    const { onOpen: onOpenConfirmModal } = useConfirmModal();

    const { deleteIncentive, isPending } = useDeleteIncentive(
        incentive.eventId,
        incentive.id
    );

    if (isPending)
        return (
            <LoadingSpinner className="h-4 text-foreground/70 animate-spin" />
        );

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-8 h-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MenuIcon className="size-7 text-muted-foreground" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="border-none shadow-2"
                    align="end"
                >
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="px-2 gap-x-2"
                        onClick={() => {
                            navigator.clipboard.writeText(`${incentive.id}`);
                            toast.success("coppied");
                        }}
                    >
                        <Copy strokeWidth={2} className="h-4" />
                        Copy Incentive ID
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setModal(true)}
                        className="px-2 gap-x-2"
                    >
                        <Pencil strokeWidth={2} className="h-4" /> Edit
                        Incentive
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setAssign(true)}
                        className="px-2 gap-x-2"
                    >
                        <UserPlus strokeWidth={2} className="h-4" /> Assign
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() =>
                            onOpenConfirmModal({
                                title: "Delete Incentive 🗑️",
                                description:
                                    "Are you sure to delete this incentive?",
                                onConfirm: () => {
                                    deleteIncentive();
                                },
                            })
                        }
                        className="px-2 gap-x-2 text-destructive"
                    >
                        <Trash strokeWidth={2} className="h-4" /> Delete
                        Incentive
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

const columns: ColumnDef<TIncentiveClaimsWithIncentiveAttendeeAssistedBy>[] = [
    // {
    //     id: "actions",
    //     enableHiding: false,
    //     header: ({ column }) => (
    //         <DataTableColHeader
    //             className="text-left  max-w-4"
    //             column={column}
    //             title="Actions"
    //         />
    //     ),
    //     cell: ({ row }) => (
    //         <div className="flex justify-start max-w-4">
    //             {/* <Actions incentive={row.original} /> */}
    //         </div>
    //     ),
    // },
    {
        id : "Id",
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Claim ID" />
        ),
        cell: ({ row }) => (
            <div className="font-medium uppercase">{row.original.id}</div>
        ),
    },
    {
        accessorKey: "itemName",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Item Name" />
        ),
        cell: ({ row }) => (
            <div className="flex gap-x-2 items-center">
                {row.original.incentive.itemName}
            </div>
        ),
    },
    {   
        id : "Passbook Number",
        accessorKey: "eventAttendee.passbookNumber",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Passbook Number" />
        ),
        cell: ({ row }) => (
            <div className="flex gap-x-2 items-center">
                {row.original.eventAttendee.passbookNumber}
            </div>
        ),
    },
    {
        id : "First Name",
        accessorKey: "eventAttendee.firstName",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="First Name" />
        ),
        cell: ({ row }) => (
            <div className="flex gap-x-2 items-center">
                {row.original.eventAttendee.firstName}
            </div>
        ),
    },
    {
        id : "Last Name",
        accessorKey: "eventAttendee.lastName",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Last Name" />
        ),
        cell: ({ row }) => (
            <div className="flex gap-x-2 items-center">
                {row.original.eventAttendee.firstName}
            </div>
        ),
    },
    {
        id : "Assisted By",
        accessorKey: "assistedBy.name",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Assisted By" />
        ),
        cell: ({ row }) => (
            <div className="flex ">
                {row.original.assistedBy ? (
                    <div className="px-2 text-sm py-1 flex items-center justify-center gap-x-2 rounded-full bg-secondary text-[#457f5a] dark:text-[#68ca93]">
                        <UserAvatar
                            className="size-4"
                            src={row.original.assistedBy.picture as ""}
                            fallback={row.original.assistedBy.name.substring(
                                0,
                                2
                            )}
                        />
                        {row.original.assistedBy.name}
                    </div>
                ) : (
                    <div className="px-2 text-sm py-1 flex items-center justify-center gap-x-2 rounded-full bg-[#f0fdf5] dark:bg-[#f0fdf5]/5 text-[#457f5a] dark:text-[#68ca93]">
                        <TabletSmartphone className="size-3" />{" "}
                        <span>Claimed Online</span>
                    </div>
                )}
            </div>
        ),
    },
    {
        id : "Claim Date",
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Claimed Date" />
        ),
        cell: ({ row }) => (
            <div>{format(row.original.createdAt, "MMM dd yyyy hh:mm a")}</div>
        ),
    }
];

export default columns;
