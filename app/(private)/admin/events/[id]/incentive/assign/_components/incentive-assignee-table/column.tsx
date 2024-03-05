"use client";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";

import { Copy, MenuIcon, Trash } from "lucide-react";

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

import { TListOfAssigneesWithAssistCount } from "@/types";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import { useRevokeAssignIncentive } from "@/hooks/api-hooks/incentive-api-hooks";
import UserAvatar from "@/components/user-avatar";

const Actions = ({ assignee }: { assignee: TListOfAssigneesWithAssistCount;}) => {
    const { onOpen: onOpenConfirmModal } = useConfirmModal();
    const { onOpen } = useConfirmModal();

    const { isDeleting, deleteAssignee } = useRevokeAssignIncentive(
        assignee.eventId,
        assignee.incentiveId,
        assignee.id
    );

    return (
        <>
            {isDeleting ? (<LoadingSpinner />) : 
            (
                <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl text-sm"
                    onClick={() => onOpen({
                        title : "Revoke Incentive Assigment 🗑️",
                        description : "You are about to revoke this user from being assigned for this incentive. Are you sure to proceed?",
                        onConfirm : () => deleteAssignee()
                    })}
                    disabled={isDeleting}
                >
                    Revoke
                </Button>
            )}
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
        id: "action",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Actions" />
        ),
        cell: ({ row }) => <Actions assignee={row.original} />,
    },
    {
        id: "Id",
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Assign ID" />
        ),
        cell: ({ row }) => (
            <div className="font-medium uppercase">{row.original.id}</div>
        ),
    },
    {
        id: "Item Name",
        accessorKey: "incentive.itemName",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Incentive Item" />
        ),
        cell: ({ row }) => (
            <div className=""> {row.original.incentive.itemName}</div>
        ),
    },
    {
        id: "User ID",
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
        id: "User Name",
        accessorKey: "user.name",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Assigned User" />
        ),
        cell: ({ row }) => (
            <div className="flex gap-x-2 items-center">
                <UserAvatar
                    className="size-7"
                    src={row.original.user.picture as ""}
                    fallback={row.original.user.name.substring(0, 2)}
                />
                {row.original.user.name}
            </div>
        ),
    },
    {
        id: "Assigned Quantity",
        accessorKey: "assignedQuantity",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Assigned Quantity" />
        ),
        cell: ({ row }) => (
            <div className="">{row.original.assignedQuantity}</div>
        ),
    },
    {
        id: "Assisted Claims",
        accessorKey: "_count.claimsAssisted",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Assisted Claims" />
        ),
        cell: ({ row }) => (
            <div className="">{row.original._count.claimsAssisted}</div>
        ),
    },
];

export default columns;
