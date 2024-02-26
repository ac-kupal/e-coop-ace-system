"use client";
import axios from "axios";
import { toast } from "sonner";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

import { handleAxiosErrorMessage } from "@/utils";
import SearchInput from "@/components/data-table/table-search-input";
import { cn } from "@/lib/utils";
import CreateEventModal from "../modals/create-event-modal";
import { TEventWithElection } from "@/types";
import { getAllEvent } from "@/hooks/api-hooks/event-api-hooks";

const EventTable = () => {
   const [globalFilter, setGlobalFilter] = useState<string>("");
   const [createEvent, setCreateEvent] = useState(false)
   
   const { data, isFetching, isLoading, isError, refetch } = getAllEvent()
      
   

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
      <div className="flex flex-1 flex-col gap-y-2 ">
         <div className="flex flex-wrap items-center justify-between p-3 rounded-xl gap-y-2 bg-[#3D7663]">
         <CreateEventModal state={createEvent} onClose={(state) => setCreateEvent(state)} />
            <div className="flex items-center gap-x-4 text-muted-foreground">
               <div className="relative">
                  <SearchIcon className="absolute text-white w-4 h-auto top-3 left-2" />
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
                  className={cn("flex bg-[#5B9381] hover:bg-[#5B9381]/70 rounded-md justify-center items-center md:space-x-2 md:min-w-[7rem]")}
                   onClick={() => setCreateEvent(true)}
               >
                  Add Event
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

export default EventTable;
