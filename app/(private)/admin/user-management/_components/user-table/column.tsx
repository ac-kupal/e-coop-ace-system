"use client";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DataTableColHeader } from "@/components/data-table/data-table-col-header";

import { Copy, Loader2, MoreHorizontal, Pencil, Trash } from "lucide-react";

import { toast } from "sonner";
import UserAvatar from "@/components/user-avatar";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userTypeWithBranchAndRoles } from "@/types/user";

const Actions = ({ user }: { user: userTypeWithBranchAndRoles }) => {
    const { onOpen: onOpenConfirmModal } = useConfirmModal();

    if (false)
        return <Loader2 className="h-4 text-foreground/70 animate-spin" />;

    return (
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
                        navigator.clipboard.writeText(`${user.id}`)
                        toast.success("coppied")
                    }}
                >
                    {" "}
                    <Copy strokeWidth={2} className="h-4" />
                    Copy user ID
                </DropdownMenuItem>
                <DropdownMenuItem className="px-2 gap-x-2">
                    <Pencil strokeWidth={2} className="h-4" /> Edit Account
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() =>
                        onOpenConfirmModal({
                            title: user.deleted
                                ? "Permanent Delete 🗑️"
                                : "Delete User 🗑️",
                            description: user.deleted
                                ? "Are you sure to delete this account permanently? This cannot be undone."
                                : "Are you sure to delete this account? The user will not be able to login.",
                            onConfirm: () => {
                                toast.success("deleted");
                            },
                        })
                    }
                    className="px-2 gap-x-2 text-destructive"
                >
                    <Trash strokeWidth={2} className="h-4" />{" "}
                    {user.deleted ? "Permanent Delete" : "Delete"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const columns: ColumnDef<userTypeWithBranchAndRoles>[] = [
    {
        accessorKey: "ID",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="id" />
        ),
        cell: ({ row }) => (
            <div className="font-medium uppercase">{row.original.id}</div>
        ),
        enableSorting : false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="name" />
        ),
        cell: ({ row }) => (
            <div className="flex gap-x-2 items-center"><UserAvatar className="h-10 w-10" src={row.original.picture ?? "/images/default.png"} fallback={row.original.name.substring(0,1)} /> {row.original.name}</div>
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Email" />
        ),
        cell: ({ row }) => (
            <div className=""> {row.original.email}</div>
        ),
    },
    {
        accessorKey: "roles",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Roles" />
        ),
        cell: ({ row }) => (
            <div className="space-x-1"> {row.original.roles.map(({ role })=> <span className="bg-secondary text-foreground/70 p-1 rounded-md">{role}</span> )}</div>
        ),
        enableSorting : false
    },
    {
        accessorKey: "branch",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Branch" />
        ),
        cell: ({ row }) => (
            <div className="">{ row.original.branch.branchName }</div>
        ),
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Date joined" />
        ),
        cell: ({ row }) => (
            <div className=""> {format(new Date(row.original.createdAt), "MMM dd, y")}</div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
            <div className="flex justify-end">
                <Actions user={row.original} />
            </div>
        ),
    },
];

export default columns;
