"use client";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DataTableColHeader } from "@/components/data-table/data-table-col-header";

import {
   Copy,
   Loader2,
   MoreHorizontal,
   Pencil,
   Target,
   Trash,
} from "lucide-react";

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
import moment from "moment";
import { deleteEvent } from "@/hooks/api-hooks/event-api-hooks";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { TPosition } from "@/types";
const Actions = ({ event }: { event: TPosition }) => {
   const router = useRouter();

   const [onOpenModal, setOnOpenModal] = useState(false);

   const deleteOperation = deleteEvent();
   const { onOpen: onOpenConfirmModal } = useConfirmModal();

   if (deleteOperation.isPending)
      return <Loader2 className="h-4 text-foreground/70 animate-spin" />;
   return (
      <DropdownMenu>
         {/* <UpdateEventModal
            event={event}
            state={onOpenModal}
            onClose={() => setOnOpenModal(false)}
         ></UpdateEventModal> */}
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
                  navigator.clipboard.writeText(`${event.id}`);
                  toast.success("coppied");
               }}
            >
               {" "}
               <Copy strokeWidth={2} className="h-4" />
               Copy position ID
            </DropdownMenuItem>

            <DropdownMenuItem
               onClick={() => {
                  setOnOpenModal(true);
               }}
               className="px-2 gap-x-2"
            >
               <Pencil strokeWidth={2} className="h-4" /> Edit Position
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="px-2 gap-x-2 text-destructive">
               <Trash strokeWidth={2} className="h-4" />{" "}
               delete
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
};

const columns: ColumnDef<TPosition>[] = [
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
      accessorKey: "positionName",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="Position Name" />
      ),
      cell: ({ row }) => {
         return <div className=""> {row.original.positionName}</div>;
      },
   },
   {
      accessorKey: "numberOfSelection",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="number of Seats" />
      ),
      cell: ({ row }) => <div className=""> {row.original.numberOfSelection}</div>,
   },
   {
      header: ({ column }) => (
         <DataTableColHeader column={column} className="text-end" title="action" />
      ),   
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
         <div className="flex justify-end">
            <Actions event={row.original} />
         </div>
      ),
   },
];

export default columns;
