"use client";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DataTableColHeader } from "@/components/data-table/data-table-col-header";

import { Copy, Loader2, MoreHorizontal, Pencil, Trash } from "lucide-react";

import { toast } from "sonner";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { TCandidatewithPosition } from "@/types";
import { deleteCandidate } from "@/hooks/api-hooks/candidate-api-hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import UpdateCandidateModal from "../modals/update-candidate-modal";
import { getAllPosition } from "@/hooks/api-hooks/position-api-hooks";


const Actions = ({ candidate }: { candidate: TCandidatewithPosition }) => {
   
   const [onOpenModal, setOnOpenModal] = useState(false);
   const deleteOperation = deleteCandidate();
   const getPositions = getAllPosition()
   const { onOpen: onOpenConfirmModal } = useConfirmModal();

   if (deleteOperation.isPending)
      return <Loader2 className="h-4 text-foreground/70 animate-spin" />;
   return (
      <DropdownMenu>
         <UpdateCandidateModal
            candidate={candidate}
            positions={getPositions.data}
            state={onOpenModal}
            onClose={() => setOnOpenModal(false)}
         ></UpdateCandidateModal>
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
                  navigator.clipboard.writeText(`${candidate.id}`);
                  toast.success("coppied");
               }}
            >
               {" "}
               <Copy strokeWidth={2} className="h-4" />
               Copy candidate ID
            </DropdownMenuItem>

            <DropdownMenuItem
               onClick={() => {
                  setOnOpenModal(true);
               }}
               className="px-2 gap-x-2"
            >
               <Pencil strokeWidth={2} className="h-4" /> Edit Candidate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
               onClick={() =>
                  onOpenConfirmModal({
                     title: "Delete Candidate 🗑️",
                     description:
                        "Are you sure to delete this candidate permanently? This cannot be undone.",
                     onConfirm: () => {
                        deleteOperation.mutate(candidate.id);
                     },
                  })
               }
               className="px-2 gap-x-2 text-destructive"
            >
               <Trash strokeWidth={2} className="h-4" /> delete
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
};

const columns: ColumnDef<TCandidatewithPosition>[] = [
   {
      accessorKey: "id",
      header: ({ column }) => <DataTableColHeader column={column} title="id" />,
      cell: ({ row }) => (
         <div className="font-medium uppercase">{row.original.id}</div>
      ),
      enableSorting: false,
      enableHiding: false,
   },
   {
      accessorKey: "firstName",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="FirstName" />
      ),
      cell: ({ row }) => {
         const img = row.original.picture === null ? "/images/default.png" :  row.original.picture
         return (
            <div className="flex items-center space-x-2">
               <Avatar>
                  <AvatarImage src={img} />
                  <AvatarFallback>CN</AvatarFallback>
               </Avatar>
               {row.original.firstName}
            </div>
         );
      },
   },
   {
      accessorKey: "lastName",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="LastName" />
      ),
      cell: ({ row }) => <div className=""> {row.original.lastName}</div>,
   },
   {
      accessorKey: "passbookNumber",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="passbook No." />
      ),
      cell: ({ row }) => <div className=""> {row.original.passbookNumber}</div>,
   },
   {
      accessorKey: "position",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="position" />
      ),
      cell: ({ row }) => (
         <div className=""> {row.original.position.positionName}</div>
      ),
   },
   {
      header: ({ column }) => (
         <DataTableColHeader
            column={column}
            className="text-end"
            title="action"
         />
      ),
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
         <div className="flex justify-end">
            <Actions candidate={row.original} />
         </div>
      ),
   },
];

export default columns;
