import React from "react";
import LoadingSpinner from "@/components/loading-spinner";
import { useClaimAuth, useClaimablesList, useMyClaims } from "@/hooks/public-api-hooks/use-claim-api";
import ValidateClaim from "./validate-claim";
import AvailableClaims from "./available-claims";
import MyClaims from "./my-claims";

type Props = { eventId: number };

const ClaimWindow = ({ eventId }: Props) => {
    const { myInfo, isLoading, isError, error } = useClaimAuth(eventId);
    const { myClaims, isLoadingClaims } = useMyClaims(eventId, myInfo !== undefined)
    const { claimables, isLoadingClaimables } = useClaimablesList(eventId, myInfo !== undefined)

    if (isLoading)
        return (
            <div className="p-2 gap-x-2 flex items-center">
                <LoadingSpinner /> <span>checking</span>
            </div>
        );

    if (!myInfo) return <ValidateClaim eventId={eventId} />;

    return <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-x-2">
        <AvailableClaims claimables={claimables} />
        <MyClaims myClaims={myClaims} />
    </div>;
};

export default ClaimWindow;
