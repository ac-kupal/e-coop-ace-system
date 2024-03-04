"use client";
import { toast } from "sonner";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { Copy, MenuIcon, MoreHorizontal, Pencil, Trash } from "lucide-react";

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
import { TListOfAssigneesWithAssistCount } from "@/types";
import { useDeleteIncentive } from "@/hooks/api-hooks/incentive-api-hooks";
import UserAvatar from "@/components/user-avatar";

const Actions = ({
    assignee,
}: {
    assignee: TListOfAssigneesWithAssistCount;
}) => {
    const [modal, setModal] = useState(false);
    const { onOpen: onOpenConfirmModal } = useConfirmModal();

    const { deleteIncentive, isPending } = useDeleteIncentive(
        assignee.eventId,
        assignee.id
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
                            navigator.clipboard.writeText(`${assignee.id}`);
                            toast.success("coppied");
                        }}
                    >
                        <Copy strokeWidth={2} className="h-4" />
                        Copy Incentive ID
                    </DropdownMenuItem>
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
                        <Trash strokeWidth={2} className="h-4" /> Revoke Assignee
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

const columns: ColumnDef<TListOfAssigneesWithAssistCount>[] = [
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
    //             <Actions assignee={row.original} />
    //         </div>
    //     ),
    // },
    {
        id : "Id",
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Assign ID" />
        ),
        cell: ({ row }) => (
            <div className="font-medium uppercase">{row.original.id}</div>
        ),
    },
    {
        id : "Item Name",
        accessorKey: "incentive.itemName",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Incentive Item" />
        ),
        cell: ({ row }) => (
            <div className=""> {row.original.incentive.itemName}</div>
        ),
    },
    {
        id : "User ID",
        accessorKey: "user.id",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="User ID" />
        ),
        cell: ({ row }) => (
            <div className="flex gap-x-2 items-center">
                {row.original.user.id}
            </div>
        ),
    },
    {
        id : "User Name",
        accessorKey: "user.name",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Assigned User" />
        ),
        cell: ({ row }) => (
            <div className="flex gap-x-2 items-center">
                <UserAvatar className="size-7" src={row.original.user.picture as ''}  fallback={row.original.user.name.substring(0,2)}/>
                {row.original.user.name}
            </div>
        ),
    },
    {
        id : "Assigned Quantity",
        accessorKey: "assignedQuantity",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Assigned Quantity" />
        ),
        cell: ({ row }) => (
            <div className="">{row.original.assignedQuantity}</div>
        ),
    },
    {
        id : "Assisted Claims",
        accessorKey: "_count.claimsAssisted",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Assisted Claims" />
        ),
        cell: ({ row }) => (
            <div className="">{row.original._count.claimsAssisted}</div>
        ),
    }
];

export default columns;
