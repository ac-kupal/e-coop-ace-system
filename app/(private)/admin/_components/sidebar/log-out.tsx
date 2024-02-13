"use client";
import React from "react";
import { signOut } from "next-auth/react";

import { CornerDownLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";

type Props = { className?: string };

const LogOut = ({ className }: Props) => {
    const { onOpen } = useConfirmModal();

    return (
        <Button
            size="sm"
            onClick={() =>
                onOpen({
                    title: "Sign Out",
                    description: "You are about to sign out, Are you sure?",
                    onConfirm : () => signOut()
                })
            }
            variant="ghost"
            className={cn("rounded-0", className)}
        >
            <CornerDownLeft className="size-4" /> Log Out
        </Button>
    );
};

export default LogOut;
