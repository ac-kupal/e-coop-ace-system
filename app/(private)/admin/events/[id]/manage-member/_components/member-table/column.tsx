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
import { deleteMember } from "@/hooks/api-hooks/member-api-hook";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UpdateMemberModal from "../modals/update-member-modal";
import { useState } from "react";

const Actions = ({ member }: { member: TMember }) => {
   const [onOpenModal,setOnOpenModal] = useState(false)
   const deleteOperation = deleteMember();
   const { onOpen: onOpenConfirmModal } = useConfirmModal();
   return (
      <DropdownMenu>
         <UpdateMemberModal member={member} state={onOpenModal} onClose={()=> setOnOpenModal(false)} onCancel={()=> setOnOpenModal(false)} ></UpdateMemberModal>
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

            <DropdownMenuItem className="px-2 gap-x-2"
               onClick={()=>{setOnOpenModal(true)}}
               
            >
               <Pencil strokeWidth={2} className="h-4" /> Edit Member
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="px-2 gap-x-2 text-destructive"
             onClick={() =>
               onOpenConfirmModal({
                  title:"Delete Member 🗑️",
                  description:
                     "Are you sure to delete this member permanently? This cannot be undone.",
                  onConfirm: () => {
                     deleteOperation.mutate({eventId:member.id});
                  },
               })
            }
            >
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
         const img = row.original.picture === null ? "/images/default.png" :  row.original.picture
         return (
            <div className="flex items-center space-x-2">
               <Avatar>
                  <AvatarImage src={img} />
                  <AvatarFallback className="bg-primary text-accent">{row.original.firstName.charAt(0).toUpperCase()}</AvatarFallback>
               </Avatar>
               <h1 className="font-medium">{row.original.firstName}</h1>
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
      id: "emailAddress",
      enableHiding: false,
      header: ({ column }) => (
         <DataTableColHeader column={column} title="email" />
      ),
      cell: ({ row }) => <div className="">{row.original.emailAddress}</div>,
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
     cell: ({ row }) => <div className="">{row.original.registered ? <Badge>registered</Badge>:<Badge variant={"secondary"}>unregistered</Badge>}</div>,
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
