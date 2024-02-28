"use client";
import React, { useRef, useState } from "react";
import { Plus, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/data-table/data-table";
import DataTablePagination from "@/components/data-table/data-table-pagination";
import DataTableViewOptions from "@/components/data-table/data-table-view-options";
import columns from "./column";
import {
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   getSortedRowModel,
   useReactTable,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import CreateEventModal from "../modals/create-event-modal";
import { getAllEvent } from "@/hooks/api-hooks/event-api-hooks";
import { Input } from "@/components/ui/input";
import DataTableBasicPagination2 from "@/components/data-table/data-table-basic-pagination-2";

const EventTable = () => {
   const [globalFilter, setGlobalFilter] = useState<string>("");
   const [createEvent, setCreateEvent] = useState(false);
   const onFocusSearch = useRef<HTMLInputElement | null>(null);

   const { data, isFetching, isLoading, isError, refetch } = getAllEvent();

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
      <div className="flex flex-1 flex-col gap-y-5">
         <div className="flex flex-wrap items-center justify-between p-3 rounded-xl gap-y-2 bg-primary dark:border dark:bg-secondary/70 ">
            <CreateEventModal
               state={createEvent}
               onClose={(state) => setCreateEvent(state)}
            />
            <div className="flex items-center gap-x-4 text-muted-foreground">
               <div className="relative">
                  <SearchIcon className="absolute text-white w-4 h-auto top-3 left-2" />
                  <Input
                     ref={onFocusSearch}
                     placeholder="Search..."
                     value={globalFilter}
                     onChange={(event) => setGlobalFilter(event.target.value)}
                     className="w-full pl-8 bg-transparent border-white text-accent placeholder:text-white border-0 border-b text-sm md:text-base ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
               </div>
            </div>
            <div className="flex items-center gap-x-2 md:gap-x-4">
               <DataTableViewOptions table={table} />
               <Button
                  size="sm"
                  className={cn(
                     "flex bg-[#5B9381] hover:bg-[#5B9381]/70 rounded-md justify-center items-center md:space-x-2 md:min-w-[7rem]"
                  )}
                  onClick={() => setCreateEvent(true)}
               >
                  Add Event
                  <Plus className="w-4 h-4" />
               </Button>
            </div>
         </div>
         <DataTable
            className="flex-1 bg-background dark:bg-secondary/30 rounded-2xl"
            isError={isError}
            isLoading={isLoading || isFetching}
            table={table}
         />
         <div className="lg:hidden">
            <DataTableBasicPagination2 table={table} />
         </div>
         <div className="hidden lg:block">
            <DataTablePagination pageSizes={[5, 10, 15]} table={table} />
         </div>
      </div>
   );
};

export default EventTable;
