import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { promptElectionStatus } from "@/hooks/api-hooks/election-api-hooks";
import { cn } from "@/lib/utils";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import { ElectionStatus } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { stat } from "fs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
   id: number;
   status: ElectionStatus;
};

const ElectionSwitch = ({ id, status }: Props) => {

   const queryClient = useQueryClient();

   const promptElection = promptElectionStatus();

   const isLoading = promptElection.isPending;

   const { onOpen: onOpenConfirmModal } = useConfirmModal();

   const isLive = status === "live";
   const isDone = status === "done";
   
   return (
      <div className="absolute right-0 top-0 flex space-x-3">
         <Button
            disabled={isDone}
            onClick={() => {
               onOpenConfirmModal({
                  title: "You are about to End the Election",
                  description:
                     "Are you sure you want to end the election? Ending the election will not preserve incoming votes. ",

                  onConfirm: () => {
                     try {
                        promptElection.mutate({
                           status: ElectionStatus.done,
                           id: id,
                        });
                       
                     } catch (error) {
                        console.log(error);
                     }
                  },
               });
            }}
            className={cn(
               "text-white hover:scale-105 cursor-pointer hover:bg-secondary/90 bg-secondary-foreground  dark:bg-secondary rounded-xl"
            )}
         >
           {isLoading ? <Loader2 className=" size-4 animate-spin "/>:"end"}
         </Button>
         <Button
            disabled={isLive}
            onClick={() => {
               onOpenConfirmModal({
                  title: "You are about to start the Event",
                  description:
                     "You can edit and manage election while the event is currently running.",
                  onConfirm: () => {
                     try {
                        promptElection.mutate({
                           status: ElectionStatus.live,
                           id: id,
                        });
                       
                       
                     } catch (error) {
                        console.log(error);
                     }
                  },
               });
            }}
            className={`text-white hover:scale-105 cursor-pointer rounded-xl bg-primary dark:bg-[#15803D] hover:bg-[#15803D] `}
         >
            {isLoading ? <Loader2 className=" size-4 animate-spin "/>:"start"}
         </Button>
      </div>
   );
};

export default ElectionSwitch;
