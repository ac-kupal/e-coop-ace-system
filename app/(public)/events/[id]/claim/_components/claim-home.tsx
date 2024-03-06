"use client";
import React from "react";

import ClaimWindow from "./claim-window";
import ValidateClaim from "./claim-window/validate-claim";
import LoadingSpinner from "@/components/loading-spinner";
import {
    useClaimAuth,
    useClaimComplete,
    useClaimablesList,
    useMyClaims,
} from "@/hooks/public-api-hooks/use-claim-api";
import { Button } from "@/components/ui/button";
import IncentiveGiftSvg from "@/components/custom-svg/incentive-gift";
import { useRouter } from "next/navigation";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";

type Props = {
    eventId: number;
};

const ClaimHome = ({ eventId }: Props) => {
    const router = useRouter();
    const { onOpen } = useConfirmModal();
    const { myInfo, isLoading, isError, error } = useClaimAuth(eventId);
    const { myClaims, isLoadingClaims } = useMyClaims(
        eventId,
        myInfo !== undefined
    );
    const { claimables, isLoadingClaimables } = useClaimablesList(
        eventId,
        myInfo !== undefined
    );

    const { completeClaim } = useClaimComplete(eventId, () =>
        router.push("claim/complete")
    );

    if (isLoading)
        return (
            <div className="flex gap-x-2 items-center">
                <LoadingSpinner /> <span>checking</span>
            </div>
        );

    if (!myInfo) return <ValidateClaim eventId={eventId} />;

    if (isLoadingClaims)
        return (
            <div className="flex gap-x-2 items-center">
                <LoadingSpinner /> <span>checking your claims</span>
            </div>
        );

    if (isLoadingClaimables)
        return (
            <div className="flex gap-x-2 items-center">
                <LoadingSpinner /> <span>checking incentives</span>
            </div>
        );

    return (
        
            <div className="w-full max-w-md lg:max-w-2xl py-8 gap-y-8 flex flex-col">
                {!isLoadingClaims && claimables.length === 0 ? (
                    <p className="text-sm text-cemter">
                        Seems like there&apos;s no incentives in this event
                    </p>
                ) : (
                    <ClaimWindow
                        eventId={eventId}
                        myClaims={myClaims}
                        claimables={claimables}
                    />
                )}
                {!isLoadingClaims &&
                    !isLoadingClaimables &&
                    claimables.length === myClaims.length && (
                        <p className="text-foreground/70 text-sm text-center">
                            You already claimed all of incentives
                        </p>
                    )}
                <Button
                    onClick={() =>
                        onOpen({
                            title: "Exit Claim",
                            description: "Are you sure to exit claim page?",
                            onConfirm: () => completeClaim(),
                        })
                    }
                    size="lg"
                >
                    Exit Claim
                </Button>
            </div>
    );
};

export default ClaimHome;
