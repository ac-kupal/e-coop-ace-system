"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTableColHeader } from "@/components/data-table/data-table-col-header";

import {
   CheckCircle2,
   Copy,
   Loader2,
   MenuIcon,
   Pencil,
   QrCode,
   Target,
   TouchpadOff,
   Trash,
   Users,
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
import UpdateEventModal from "../modals/update-event-modal";
import { TEventWithElection } from "@/types";
import Link from "next/link";
import { useInfoModal } from "@/stores/use-info-modal-store";
import QrViewContent from "@/components/modals/modal-content/qr-view-content";
import useOrigin from "@/hooks/use-origin";
import CopyURL from "@/components/copy-url";

const Actions = ({ event }: { event: TEventWithElection }) => {
   const router = useRouter();

   const [onOpenModal, setOnOpenModal] = useState(false);

   const deleteOperation = deleteEvent();
   const { onOpen: onOpenConfirmModal } = useConfirmModal();

   if (deleteOperation.isPending)
      return <Loader2 className="h-4 text-foreground/70 animate-spin" />;
   return (
      <DropdownMenu>
         <UpdateEventModal
            event={event}
            state={onOpenModal}
            onClose={() => setOnOpenModal(false)}
         ></UpdateEventModal>
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
                  navigator.clipboard.writeText(`${event.id}`);
                  toast.success("coppied");
               }}
            >
               {" "}
               <Copy strokeWidth={2} className="h-4" />
               Copy event ID
            </DropdownMenuItem>
            {event.election && (
               <DropdownMenuItem
                  onClick={() => {
                     router.push(`/admin/events/${event.id}/election/`);
                  }}
                  className="px-2 gap-x-2"
               >
                  <Target strokeWidth={2} className="h-4" />
                  view Election
               </DropdownMenuItem>
            )}
            {event.election === null ? (
               <DropdownMenuItem
                  onClick={() => {
                     router.push(`/admin/events/${event.id}/manage-member/`);
                  }}
                  className="px-2 gap-x-2"
               >
                  <Users strokeWidth={2} className="h-4" />
                  manage member
               </DropdownMenuItem>
            ) : (
               <></>
            )}
            <DropdownMenuItem
               onClick={() => {
                  setOnOpenModal(true);
               }}
               className="px-2 gap-x-2"
            >
               <Pencil strokeWidth={2} className="h-4" /> Edit Event
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
               onClick={() =>
                  onOpenConfirmModal({
                     title: event.deleted
                        ? "Permanent Delete 🗑️"
                        : "Delete Event 🗑️",
                     description:
                        "Are you sure to delete this event permanently? This cannot be undone.",
                     onConfirm: () => {
                        deleteOperation.mutate(event.id);
                     },
                  })
               }
               className="px-2 gap-x-2 text-destructive"
            >
               <Trash strokeWidth={2} className="h-4" />{" "}
               {event.deleted ? "Permanent Delete" : "Delete"}
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
};

const ViewEventQr = ( { eventWithElection } : { eventWithElection : TEventWithElection } ) => {
   const { onOpen } = useInfoModal(); 
   const { origin }= useOrigin();

    const eventUrl = `${origin}/events/${eventWithElection.id}`

    return (
         <Button onClick={()=> onOpen({
            title : "Event QRCode",
            description : "You are viewing the actual QRCode of this event",
            component : (
                <div className="flex gap-y-4 items-center flex-col">
                    <QrViewContent fileName={eventWithElection.title} value={eventUrl} enableDownload />
                    <CopyURL className="w-fit text-center flex justify-center" url={eventUrl} />
                </div>),
            confirmString : "okay"
        })} size="icon" variant="ghost">
            <QrCode className="size-6" strokeWidth={1} />
         </Button>
    )
}

const columns: ColumnDef<TEventWithElection>[] = [
   {
      header: ({ column }) => <DataTableColHeader column={column} title="Actions" />,
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
         <div className="flex justify-start">
            <Actions event={row.original} />
         </div>
      ),
   },
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
      accessorKey: "title",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="title" />
      ),
      cell: ({ row }) => {
         return (
            <div className="flex space-x-2">
               <h1>{row.original.title}</h1>
            </div>
         );
      },
   },
   {
      accessorKey: "description",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="description" />
      ),
      cell: ({ row }) => <div className=""> {row.original.description}</div>,
   },
   {
      accessorKey: "date",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="date" />
      ),
      cell: ({ row }) => (
         <div className="">{moment(row.original.date).format("LL")}</div>
      ),
   },
   {
      accessorKey: "Address",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="Address" />
      ),
      cell: ({ row }) => <div className="">{row.original.location}</div>,
   },
   {
      accessorKey: "type",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="type" />
      ),
      cell: ({ row }) => <div className="">{row.original.category}</div>,
   },
   {
      id: "live",
      cell: ({ row }) => (
         <div className="">
            {row.original.election?.status === "live" && (
               <div className="flex items-center justify-center space-x-2">
                  <p className=" bg-red-600 rounded-full size-2 translate-y-[0.20rem]"></p>
                  <h1>live</h1>
               </div>
            )}
            {row.original.election?.status === "done" && (
               <div className="flex items-center justify-center space-x-2">
                  <CheckCircle2 className="size-4 text-green-500"></CheckCircle2>
                  <h1>ended</h1>
               </div>
            )}
             {row.original.election?.status === "pending" && (
               <div className="flex items-center justify-center space-x-2">
                  <TouchpadOff className="size-4 text-yellow-500"/>
                  <h1>unbegan</h1>
               </div>
            )}
         </div>
      ),
   },
   {
      id: "Event QR",
      cell: ({ row }) => (
        <ViewEventQr eventWithElection={row.original} />
      ),
   },
   {
      id: "button",
      enableHiding: false,
      cell: ({ row }) => (
         <div className="flex justify-end">
            {row.original.election && (
               <Link href={`/admin/events/${row.original.id}/election/`}>
                  <Button className=" rounded-xl h-8">View List</Button>
               </Link>
            )}
         </div>
      ),
   },
  
];

export default columns;
