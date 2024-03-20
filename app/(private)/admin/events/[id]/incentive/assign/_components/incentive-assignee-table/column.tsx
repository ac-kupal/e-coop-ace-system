"use client";
import { ColumnDef } from "@tanstack/react-table";

import { HiPencil } from "react-icons/hi2";
import { Delete, MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
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
import {
  updateAssignedQuantity,
  useRevokeAssignIncentive,
} from "@/hooks/api-hooks/incentive-api-hooks";
import { useState } from "react";
import UpdateQtyModal from "../modals/update-qty-modal";

const Actions = ({
  assignee,
}: {
  assignee: TListOfAssigneesWithAssistCount;
}) => {
  const [updateModal, setUpdateModal] = useState(false);
  const { onOpen } = useConfirmModal();

  const { isDeleting, deleteAssignee } = useRevokeAssignIncentive(
    assignee.eventId,
    assignee.incentiveId,
    assignee.id,
  );

  if (isDeleting) return <LoadingSpinner />;

  return (
    <DropdownMenu>
      <UpdateQtyModal
        assignee={assignee}
        state={updateModal}
        onClose={(state) => setUpdateModal(state)}
      />
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-8 h-8 p-0">
          <span className="sr-only">Open menu</span>
          <MenuIcon className="size-7 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-none shadow-2" align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="px-2 gap-x-2"
          onClick={() => {
            setUpdateModal(true);
          }}
        >
          <HiPencil className="size-4" />
          Edit quantity 
        </DropdownMenuItem>
        <DropdownMenuItem
          className="px-2 gap-x-2"
          onClick={() =>
            onOpen({
              title: "Revoke Incentive Assigment 🗑️",
              description:
                "You are about to revoke this user from being assigned for this incentive. Are you sure to proceed?",
              onConfirm: () => deleteAssignee(),
            })
          }
          disabled={isDeleting}
        >
          <Delete strokeWidth={2} className="h-4" />
          Revoke
        </DropdownMenuItem>
      </DropdownMenuContent>{" "}
    </DropdownMenu>
  );
};

const columns: ColumnDef<TListOfAssigneesWithAssistCount>[] = [
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
      <div className="flex gap-x-2 items-center">{row.original.user.id}</div>
    ),
    filterFn: (row, id, value) => {
      if (value.includes("Anyone")) return true;

      return value.includes(row.original.user.id.toString());
    },
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
    cell: ({ row }) => <div className="">{row.original.assignedQuantity}</div>,
  },
  {
    id: "Assisted Claims",
    accessorKey: "_count.claimsAssisted",
    header: ({ column }) => (
      <DataTableColHeader column={column} title="Assisted Claims" />
    ),
    cell: ({ row }) => <div className="">{row.original._count.claims}</div>,
  },
];

export default columns;
