"use client";
import React, { useEffect } from "react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";

type Props = { className?: string };

const LogOut = ({ className }: Props) => {
   const { onOpen } = useConfirmModal();

   useEffect(() => {
      window.addEventListener("keydown", (event) => {
         if (
            (event.ctrlKey && event.key === "q") ||
            (event.altKey && event.key === "q") ||
            (event.metaKey && event.key === "q")
         ) {
            event.preventDefault();
            onOpen({
               title: "Sign Out",
               description: "You are about to sign out, Are you sure?",
               onConfirm: () => signOut(),
            });
         }
      });
   }, []);

   return (
      <p
         onClick={() =>
            onOpen({
               title: "Sign Out",
               description: "You are about to sign out, Are you sure?",
               onConfirm: () => signOut(),
            })
         }
         className={cn("rounded-0", className)}
      >
         Log Out
      </p>
   );
};

export default LogOut;
