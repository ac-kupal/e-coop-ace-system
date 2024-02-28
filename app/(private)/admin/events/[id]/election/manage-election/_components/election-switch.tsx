import { Button } from "@/components/ui/button";
import { promptElectionStatus } from "@/hooks/api-hooks/election-api-hooks";
import { cn } from "@/lib/utils";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import { TElectionWithPositionsAndCandidates } from "@/types";
import { ElectionStatus } from "@prisma/client";
import { Loader2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type Props = {
   id: number;
   status: ElectionStatus;
   election: TElectionWithPositionsAndCandidates;
};

const ElectionSwitch = ({ id, status, election }: Props) => {
   const promptElection = promptElectionStatus();

   const isLoading = promptElection.isPending;

   const { onOpen: onOpenConfirmModal } = useConfirmModal();

   const isLive = status === "live";
   const isDone = status === "done";

   const allowedToStart =
      election.positions.length >= 1 && election.candidates.length >= 1;
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
            {isLoading ? <Loader2 className=" size-4 animate-spin " /> : "end"}
         </Button>
         <Button
            disabled={isLive || !allowedToStart}
            onClick={() => {
               onOpenConfirmModal({
                  title: "You are about to start the Event",
                  description:
                     "You can edit and manage election while the event is currently running.",
                  onConfirm: () => {
                     try {
                        if (allowedToStart) {
                           promptElection.mutate({
                              status: ElectionStatus.live,
                              id: id,
                           });
                        } else {
                           toast.error(
                              "The election doesn't have any positions or candidates."
                           );
                           toast.warning(
                              "Cannot proceed to start! Please ensure that the election has positions and candidates!"
                           );
                        }
                     } catch (error) {
                        console.log(error);
                     }
                  },
               });
            }}
            className={`text-white hover:scale-105 cursor-pointer rounded-xl bg-primary hover:bg-primary/80 dark:bg-[#1E8A56]  dark:hover:bg-[#1e8a56ee] `}
         >
            {isLoading ? (
               <Loader2 className=" size-4 animate-spin " />
            ) : (
               "start"
            )}
         </Button>
      </div>
   );
};

export default ElectionSwitch;
