import React from "react";
import { Gift, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/loading-spinner";

import { cn } from "@/lib/utils";
import { TCreateClaimEntry } from ".";
import { useAssignedIncentiveToMe } from "@/hooks/api-hooks/incentive-api-hooks";

type Props = {
    eventId: number;
    attendeeId : string;
    state: boolean;

    newClaimEntries : number[],
    claimedIncentiveIds : number[];

    onAdd : (entry : TCreateClaimEntry) => void;
    onRemove : (entryId : number) => void;
};

const IncentiveAssigned = ({ eventId, state, attendeeId, newClaimEntries, claimedIncentiveIds, onAdd, onRemove }: Props) => {
    const { assignedToMe, isLoadingAssignedToMe } = useAssignedIncentiveToMe(eventId, state);

    const assignables = assignedToMe.filter(incentiveAssigned => !claimedIncentiveIds.includes(incentiveAssigned.incentiveId) )

    return (
        <div>
            <p className="font-medium text-lg">Claimables</p>
            <div className="space-y-4 mt-4 min-h-[15vh]">
                { assignables.map((incentiveAssigned) => {
                    const inNewEntry = newClaimEntries.includes(incentiveAssigned.incentiveId);

                    return (
                        <div
                            key={incentiveAssigned.id}
                            onClick={()=> { return inNewEntry ? onRemove(incentiveAssigned.incentiveId) : onAdd({ assignedId : incentiveAssigned.id, eventAttendeeId : attendeeId, eventId, incentiveId : incentiveAssigned.incentiveId }) }}
                            className={cn("p-2 ring-2 ring-blue-400/20 group ease-in cursor-pointer duration-100 hover:ring-blue-400/70 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-background dark:from-secondary to-[#f5f1fd] rounded-xl items-center gap-x-4 flex justify-start", inNewEntry && "ring-yellow-400/40 hover:ring-yellow-400")}
                        >
                            <div className={cn("p-2 rounded-xl duration-300 bg-sky-300 text-white", inNewEntry && "bg-yellow-400")}>
                                <Gift className="size-8" strokeWidth={1} />
                            </div>
                            <div className="p-2 flex-1">
                                <p className="text-xl font-medium">
                                    {incentiveAssigned.incentive.itemName}
                                </p>
                            </div>
                            <Button size="icon" className={cn("bg-transparent text-foreground/80 group-hover:text-white group-hover:bg-sky-400 rounded-full", inNewEntry && "bg-yellow-400/80 group-hover:bg-yellow-400")}>
                                {
                                    inNewEntry ?
                                    <Minus strokeWidth={1} className="size-8" /> : <Plus strokeWidth={1} className="size-8" />
                                }
                            </Button>
                        </div>
                    )}
                )}
                { !isLoadingAssignedToMe && assignables.length === 0 && <p className="text-center text-foreground/50">{assignables.length < assignedToMe.length ? "Seem's like theres nothing to claim for this member" : "No incentive was assigned to you"}</p>}
                { isLoadingAssignedToMe && <LoadingSpinner />}
            </div>
        </div>
    );
};

export default IncentiveAssigned;
