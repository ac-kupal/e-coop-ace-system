import React from "react";
import LoadingSpinner from "@/components/loading-spinner";
import { useClaimAuth } from "@/hooks/public-api-hooks/use-claim-api";
import ValidateClaim from "./validate-claim";

type Props = { eventId: number };

const ClaimWindow = ({ eventId }: Props) => {
    // const { myInfo, isLoading, isError, error } = useClaimAuth(eventId);

    // if (isLoading)
    //     return (
    //         <div className="p-2 gap-x-2 flex items-center">
    //             <LoadingSpinner /> <span>checking</span>
    //         </div>
    //     );

    // if (!myInfo) return <ValidateClaim eventId={eventId} />;

    return <div>claim page currently not yet available</div>;
};

export default ClaimWindow;
