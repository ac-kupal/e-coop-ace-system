"use client";
import React, { useState } from "react";
import {
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   getSortedRowModel,
   useReactTable,
} from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/react-table";

import { DataTableColHeader } from "@/components/data-table/data-table-col-header";
import { TPosition } from "@/types";
import DataTable from "@/components/data-table/data-table";
import { getPosition } from "@/hooks/api-hooks/position-api-hooks";


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
        cell: ({ row }) => (
           <div className=""> {row.original.numberOfSelection}</div>
        ),
     },
  ];

type Props = {
   id:number
}

export const Positions = ({id}:Props) => {
     const [globalFilter, setGlobalFilter] = useState<string>("");
     const { data, isFetching, isLoading, isError } = getPosition(id);
    
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
  