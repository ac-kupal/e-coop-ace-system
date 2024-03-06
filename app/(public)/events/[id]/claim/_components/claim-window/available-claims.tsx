import React from "react";

import { Gift, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { TIncentiveMinimalInfo2 } from "@/types";

type Props = {
    claimables: TIncentiveMinimalInfo2[];
};

const AvailableClaims = ({ claimables }: Props) => {
    return (
        <div className="flex-1 flex flex-col gap-y-4">
            <p>Claimables</p>
            {claimables.map((incentive) => {
                const inNewEntry = false;

                return (
                    <div
                        key={incentive.id}
                        onClick={() => {}}
                        className={cn(
                            "p-2 ring-2 ring-blue-400/20 group ease-in cursor-pointer duration-100 hover:ring-blue-400/70 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-background dark:from-secondary to-[#f5f1fd] rounded-xl items-center gap-x-4 flex justify-start",
                            inNewEntry &&
                                "ring-yellow-400/40 hover:ring-yellow-400"
                        )}
                    >
                        <div
                            className={cn(
                                "p-2 rounded-xl duration-300 bg-sky-300 text-white",
                                inNewEntry && "bg-yellow-400"
                            )}
                        >
                            <Gift className="size-8" strokeWidth={1} />
                        </div>
                        <div className="p-2 flex-1">
                            <p className="text-xl font-medium">
                                {incentive.itemName}
                            </p>
                        </div>
                        <Button
                            size="icon"
                            className={cn(
                                "bg-transparent text-foreground/80 group-hover:text-white group-hover:bg-sky-400 rounded-full",
                                inNewEntry &&
                                    "bg-yellow-400/80 group-hover:bg-yellow-400"
                            )}
                        >
                            {inNewEntry ? (
                                <Minus strokeWidth={1} className="size-8" />
                            ) : (
                                <Plus strokeWidth={1} className="size-8" />
                            )}
                        </Button>
                    </div>
                );
            })}
        </div>
    );
};

export default AvailableClaims;
