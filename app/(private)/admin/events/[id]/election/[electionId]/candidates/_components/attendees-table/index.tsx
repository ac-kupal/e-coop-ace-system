"use client";
import React, { useState } from "react";
import { SearchIcon } from "lucide-react";
import DataTable from "@/components/data-table/data-table";
import DataTableViewOptions from "@/components/data-table/data-table-view-options";
import {
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   getSortedRowModel,
   useReactTable,
} from "@tanstack/react-table";
import SearchInput from "@/components/data-table/table-search-input";
import columns from "./column";
import DataTableBasicPagination2 from "@/components/data-table/data-table-basic-pagination-2";
import {   TMemberWithEventElectionId } from "@/types";

type Props = {
   data:TMemberWithEventElectionId[]
};

const EventAttendeesTable = ({ data }: Props) => {
   const [globalFilter, setGlobalFilter] = useState<string>("");
   
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
      enableMultiRowSelection:false,

   });
   const selectedCandidates = table.getSelectedRowModel().flatRows.map(({ original }) => original);
   console.log(selectedCandidates[0])
  
   return (
      <div className="flex flex-1 flex-col gap-y-2 max-h-[40vh] overflow-auto ">
         <div className="flex flex-wrap items-center justify-between p-3 rounded-xl gap-y-2 ">
            <div className="flex items-center gap-x-4 text-muted-foreground">
               <div className="relative">
                  <SearchIcon className="absolute text-muted-forground  w-4 h-auto top-3 left-2" />
                  <SearchInput
                     setGlobalFilter={(e) => setGlobalFilter(e)}
                     globalFilter={globalFilter}
                  ></SearchInput>
               </div>
            </div>
            <div className="flex items-center gap-x-2 md:gap-x-4">
               <DataTableViewOptions table={table} />
            </div>
         </div>
         <DataTable
            className="flex-1 bg-background/50 rounded-"
            table={table}
         />
         <div className="lg:hidden">
            <DataTableBasicPagination2 table={table} />
         </div>
         <div className="hidden lg:block">
            <DataTableBasicPagination2  table={table} />
         </div>
      </div>
   );
};

export default EventAttendeesTable;
