import React from "react";
import { Check, Gift } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { TIncentiveClaimsWithIncentiveAndAssisted } from "@/types";

type Props = {
    myClaims: TIncentiveClaimsWithIncentiveAndAssisted[];
};

const MyClaims = ({ myClaims }: Props) => {
    return (
        <div className="flex flex-1 flex-col gap-y-4">
            <p>Your Claims</p>
            <div>
                {myClaims.map((claim) => (
                    <div
                        key={claim.id}
                        className="p-2 bg-gradient-to-r from-background dark:from-secondary to-[#f5f1fd] rounded-xl items-center gap-x-4 flex justify-start"
                    >
                        <div className="p-2 rounded-xl bg-teal-400 text-white">
                            <Gift className="size-8" strokeWidth={1} />
                        </div>
                        <div className="p-2 flex-1">
                            <p className="text-xl font-medium">
                                {claim.incentive.itemName}
                            </p>
                        </div>
                        <Badge
                            variant="default"
                            className="text-white bg-primary dark:bg-primary/40 border-primary-10"
                        >
                            <Check strokeWidth={1} className="size-5" /> Claimed
                        </Badge>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyClaims;
