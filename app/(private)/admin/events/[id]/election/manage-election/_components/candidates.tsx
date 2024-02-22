"use client";
import React, { useState } from "react";
import {
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   getSortedRowModel,
   useReactTable,
} from "@tanstack/react-table";
import { getAllCandidates } from "@/hooks/api-hooks/candidate-api-hooks";
import { ColumnDef } from "@tanstack/react-table";

import { DataTableColHeader } from "@/components/data-table/data-table-col-header";
import { TCandidatewithPosition } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DataTable from "@/components/data-table/data-table";

export const columns: ColumnDef<TCandidatewithPosition>[] = [
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
         const img =
            row.original.picture === null
               ? "/images/default.png"
               : row.original.picture;
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
      enableSorting: false,
      enableHiding: false,
   },
   {
      accessorKey: "lastName",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="LastName" />
      ),
      cell: ({ row }) => <div className=""> {row.original.lastName}</div>,
      enableSorting: false,
      enableHiding: false,
   },
   {
      accessorKey: "passbookNumber",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="passbook No." />
      ),
      cell: ({ row }) => <div className=""> {row.original.passbookNumber}</div>,
      enableSorting: false,
      enableHiding: false,
   },
   {
      accessorKey: "position",
      header: ({ column }) => (
         <DataTableColHeader column={column} title="position" />
      ),
      cell: ({ row }) => <div className=""> {row.original.position.positionName}</div>,
      enableSorting: false,
      enableHiding: false,
   },
];

export const Candidates = () => {
   const [globalFilter, setGlobalFilter] = useState<string>("");
   const { data, isFetching, isLoading, isError } = getAllCandidates();
  
   const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      state: {
         globalFilter,
      },
      initialState: {
         pagination: { pageIndex: 0, pageSize: 20 },
      },
      onGlobalFilterChange: setGlobalFilter,
   });

   return (
      <div className="h-fit">
         <DataTable
            className="flex-1 bg-[#F7F7F7] rounded-2xl"
            isError={isError}
            isLoading={isLoading || isFetching}
            table={table}
         />
      </div>
   );
};
