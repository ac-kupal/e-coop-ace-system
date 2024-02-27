"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTableColHeader } from "@/components/data-table/data-table-col-header";
import {
   Copy,
   MoreHorizontal,
   Pencil,
   Trash,
} from "lucide-react";

import { toast } from "sonner";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import moment from "moment";
import { TMember } from "@/types";
import { Badge } from "@/components/ui/badge";

const Actions = ({ member }: { member: TMember }) => {

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
                  navigator.clipboard.writeText(`${member.id}`);
                  toast.success("coppied");
               }}
            >
               {" "}
               <Copy strokeWidth={2} className="h-4" />
               Copy member ID
            </DropdownMenuItem>

            <DropdownMenuItem className="px-2 gap-x-2">
               <Pencil strokeWidth={2} className="h-4" /> Edit Member
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="px-2 gap-x-2 text-destructive">
               <Trash strokeWidth={2} className="h-4" />Delete
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
};

const columns: ColumnDef<TMember>[] = [
   {
      accessorKey: "firstName",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="first Name" />
      ),
      cell: ({ row }) => {
         return (
            <div className="flex space-x-2">
               <h1>{row.original.firstName}</h1>
            </div>
         );
      },
   },
   {
      accessorKey: "lastName",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="last Name" />
      ),
      cell: ({ row }) => <div className=""> {row.original.lastName}</div>,
   },
   {
      accessorKey: "middleName",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="date" />
      ),
      cell: ({ row }) => <div className="">{row.original.middleName}</div>,
   },
   {
      accessorKey: "passbookNumber",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="passbook N0." />
      ),
      cell: ({ row }) => <div className="">{row.original.passbookNumber}</div>,
   },
   {
      accessorKey: "gender",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="gender" />
      ),
      cell: ({ row }) => <div className="">{row.original.gender}</div>,
   },
   {
      id: "birthday",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="birthday" />
      ),
      cell: ({ row }) => (
         <div className="">{moment(row.original.birthday).format("LL")}</div>
      ),
   },
   {
      id: "contact",
      enableHiding: false,
      header: ({ column }) => (
         <DataTableColHeader column={column} title="contact" />
      ),
      cell: ({ row }) => <div className="">{row.original.contact}</div>,
   },
   {
      id: "eventId",
      enableHiding: false,
      header: ({ column }) => (
         <DataTableColHeader column={column} title="event ID" />
      ),
      cell: ({ row }) => <div className="">{row.original.eventId}</div>,
   },
   {
     id: "voteOtp",
     enableHiding: false,
     header: ({ column }) => (
        <DataTableColHeader column={column} title="vote OTP" />
     ),
     cell: ({ row }) => <div className="">{row.original.voteOtp}</div>,
  },
  {
     id: "registered",
     enableHiding: false,
     header: ({ column }) => (
        <DataTableColHeader column={column} title="Registered" />
     ),
     cell: ({ row }) => <div className="">{row.original.registered ? <Badge>registered</Badge>:<Badge>unregistered</Badge>}</div>,
  },
   {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
         <div className="flex justify-end">
            <Actions member={row.original} />
         </div>
      ),
   },
];

export default columns;
