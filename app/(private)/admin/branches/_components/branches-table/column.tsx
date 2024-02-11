"use client";
import { toast } from "sonner";
import { format } from "date-fns";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { Copy, Loader2, MoreHorizontal, Pencil, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import { DataTableColHeader } from "@/components/data-table/data-table-col-header";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TBranch } from "@/types";
import UpdateBranchModal from "../modals/update-branch-modal";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import { deleteBranch } from "../branch-api-hooks";

const Actions = ({ branch }: { branch: TBranch }) => {
    const [modal, setModal] = useState(false);
    const { onOpen: onOpenConfirmModal } = useConfirmModal();

    const deleteOperation = deleteBranch(branch);

    if (deleteOperation.isPending)
        return <Loader2 className="h-4 text-foreground/70 animate-spin" />;

    return (
        <>
            <UpdateBranchModal
                branch={branch}
                state={modal}
                close={() => setModal(false)}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-8 h-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="w-4 h-4" />
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
                            navigator.clipboard.writeText(`${branch.id}`);
                            toast.success("coppied");
                        }}
                    >
                        <Copy strokeWidth={2} className="h-4" />
                        Copy Branch ID
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setModal(true)}
                        className="px-2 gap-x-2"
                    >
                        <Pencil strokeWidth={2} className="h-4" /> Edit Branch
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() =>
                            onOpenConfirmModal({
                                title: "Delete Branch 🗑️",
                                description:
                                    "Are you sure to delete this branch?",
                                onConfirm: () => {
                                    deleteOperation.mutate();
                                },
                            })
                        }
                        className="px-2 gap-x-2 text-destructive"
                    >
                        <Trash strokeWidth={2} className="h-4" /> Delete branch
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

const columns: ColumnDef<TBranch>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="ID" />
        ),
        cell: ({ row }) => (
            <div className="font-medium uppercase">{row.original.id}</div>
        ),
        enableHiding: false,
    },
    {
        accessorKey: "branchName",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Branch Name" />
        ),
        cell: ({ row }) => (
            <div className="flex gap-x-2 items-center">
                <UserAvatar
                    className="h-10 w-10"
                    src={row.original.branchPicture ?? "/images/default.png"}
                    fallback={row.original.branchName.substring(
                        0,
                        row.original.branchName.length >= 2
                            ? 2
                            : row.original.branchName.length
                    )}
                />
                {row.original.branchName}
            </div>
        ),
    },
    {
        accessorKey: "branchAddress",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Address" />
        ),
        cell: ({ row }) => (
            <div className=""> {row.original.branchAddress}</div>
        ),
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Date joined" />
        ),
        cell: ({ row }) => (
            <div className="">
                {" "}
                {format(new Date(row.original.createdAt), "MMM dd, y")}
            </div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        header: ({ column }) => (
            <DataTableColHeader
                className="text-right"
                column={column}
                title="Actions"
            />
        ),
        cell: ({ row }) => (
            <div className="flex justify-end">
                <Actions branch={row.original} />
            </div>
        ),
    },
];

export default columns;
