"use client";
import axios from "axios";
import { toast } from "sonner";
import React, { useEffect, useState } from "react";
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
import { TEvent, TEventWithElection, TPosition } from "@/types";
import CreatePostionModal from "../modals/create-position-modal";
import { mutationErrorHandler } from "@/errors/mutation-error-handler";

type Props = {
   id: number | undefined;
};

const PositionTable = ({ id }: Props) => {
   const [globalFilter, setGlobalFilter] = useState<string>("");
   const [createPosition, setCreatePosition] = useState(false);

   const getElectionId = useQuery<TEventWithElection>({
      queryKey: ["get-position-id-key"],
      queryFn: async () => {
         try {
            const eventId = Number(id);
            const response = await axios.get(`/api/v1/event/${eventId}`);
            return response.data
         } catch (error) {
            mutationErrorHandler(error);
         }
      },
   });

   const { data, isFetching, isLoading, isError, refetch } = useQuery<
      TPosition[],
      string
   >({
      queryKey: ["position-list-query"],
      queryFn: async () => {
         try {
            const response = await axios.get("/api/v1/position");
            return response.data;
         } catch (e) {
            const errorMessage = handleAxiosErrorMessage(e);
            toast.error(errorMessage, {
               action: {
                  label: "try agian",
                  onClick: () => refetch(),
               },
            });
            throw handleAxiosErrorMessage(e);
         }
      },
      initialData: [],
   });

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

   const electionId = getElectionId.data?.election.id
   return (
      <div className="flex flex-1 flex-col gap-y-2 ">
         <div className="flex flex-wrap items-center justify-between p-3 rounded-xl gap-y-2 ">
            <CreatePostionModal
               electionId={electionId}
               state={createPosition}
               onClose={(state) => setCreatePosition(state)}
            />
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
                  onClick={() => {
                     setCreatePosition(true);
                  }}
                  size="sm"
                  className={cn(
                     "flex bg-[#5B9381] hover:bg-[#5B9381]/70 rounded-md justify-center items-center md:space-x-2 md:min-w-[7rem]"
                  )}
               >
                  Add Position
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

export default PositionTable;
