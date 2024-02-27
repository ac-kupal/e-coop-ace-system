"use client"
import DataTable from "@/components/data-table/data-table";
import DataTablePagination from "@/components/data-table/data-table-pagination";
import {
   useReactTable,
   getCoreRowModel,
   getPaginationRowModel,
   getSortedRowModel,
   getFilteredRowModel,
} from "@tanstack/react-table";
import React, { useState } from "react";
import columns from "./column";
import NotFound from "../../../_components/not-found";
import { Plus, SearchIcon } from "lucide-react";
import SearchInput from "@/components/data-table/table-search-input";
import DataTableViewOptions from "@/components/data-table/data-table-view-options";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getAllMembers } from "@/hooks/api-hooks/member-api-hook";

type Props = {
   id: number;
};

const MemberTable = ({ id }: Props) => {

   const [globalFilter, setGlobalFilter] = useState<string>("");

   const { data, isError, isLoading, isFetching } = getAllMembers(id);

   console.log(data)

   if(data === undefined) return <h1 className=" animate-pulse">Loading...</h1>

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
      <div>
      <div className="flex flex-wrap items-center justify-between p-3 rounded-xl gap-y-2 ">
          
            <div className="flex items-center gap-x-4 text-muted-foreground">
               <div className="relative">
                  <SearchIcon className="absolute  w-4 h-auto top-3 left-2" />
                  <SearchInput
                     setGlobalFilter={(e) => setGlobalFilter(e)}
                     globalFilter={globalFilter}
                  ></SearchInput>
               </div>
            </div>
            <div className="flex items-center gap-x-2 md:gap-x-4">
               <DataTableViewOptions table={table} />
               <Button
                  size="sm"
                  className={cn(
                     "flex bg-[#5B9381] hover:bg-[#5B9381]/70 rounded-md justify-center items-center md:space-x-2 md:min-w-[7rem]"
                  )}
               >
                  Add Member
                  <Plus className="w-4 h-4" />
               </Button>
            </div>
         </div>
         <DataTable
            className="flex-1"
            isError={isError}
            isLoading={isLoading || isFetching}
            table={table}
         />
         <DataTablePagination pageSizes={[20, 40, 60, 80, 100]} table={table} />
      </div>
   );
};

export default MemberTable;
