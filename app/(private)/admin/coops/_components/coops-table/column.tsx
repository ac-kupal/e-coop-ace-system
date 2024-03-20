"use client";
import { toast } from "sonner";
import { format } from "date-fns";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import {
    Copy,
    Image,
    Loader2,
    MoreHorizontal,
    Pencil,
    Trash,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTableColHeader } from "@/components/data-table/data-table-col-header";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TCoop } from "@/types";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import { deleteBranch } from "@/hooks/api-hooks/branch-api-hooks";

const Actions = ({ coop }: { coop : TCoop }) => {
    const [modal, setModal] = useState(false);
    const { onOpen: onOpenConfirmModal } = useConfirmModal();

    const deleteOperation = deleteBranch();

    if (deleteOperation.isPending)
        return <Loader2 className="h-4 text-foreground/70 animate-spin" />;

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-8 h-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-none shadow-2" align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="px-2 gap-x-2"
                        onClick={() => {
                        }}
                    >
                        <Copy strokeWidth={2} className="h-4" />
                        Copy Branch ID
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="px-2 gap-x-2"
                    >
                        <Pencil strokeWidth={2} className="h-4" /> Edit Branch
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="px-2 gap-x-2"
                    >
                        <Image strokeWidth={2} className="h-4" /> Branch Logo
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() =>
                            onOpenConfirmModal({
                                title: "Delete Coop 🗑️",
                                description: "Are you sure to delete this coop? Everything under the coop will be deleted, branches, users, events etc, will be deleted. Do you which to proceed?",
                                onConfirm: () => {
                                },
                            })
                        }
                        className="px-2 gap-x-2 text-destructive"
                    >
                        <Trash strokeWidth={2} className="h-4" />Delete Coop 
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

const columns: ColumnDef<TCoop>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => <DataTableColHeader column={column} title="ID" />,
        cell: ({ row }) => (
            <div className="font-medium uppercase">{row.original.id}</div>
        ),
        enableHiding: false,
    },
    {
        id : "Coopearative Name",
        accessorKey: "coopName",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Cooperative Name" />
        ),
        cell: ({ row }) => (
            <div className="flex gap-x-2 items-center">
                {row.original.coopName}
            </div>
        ),
    },
    {
        id : "Date created",
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Date Created" />
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
                <Actions coop={row.original} />
            </div>
        ),
    },
];

export default columns;
