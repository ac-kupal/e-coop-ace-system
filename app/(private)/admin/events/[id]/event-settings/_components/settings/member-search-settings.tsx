"use client";
import React from "react";

import { Check } from "lucide-react";

import SettingsCard from "./settings-card";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import { TEventSettings, TEventSettingsUpdate } from "@/types";
import LoadingSpinner from "@/components/loading-spinner";

type Props = {
  loading: boolean;
  eventSettings: TEventSettings;
  onUpdate: (update: TEventSettingsUpdate) => void;
};

const MemberSearchModeSettings = ({ loading, eventSettings, onUpdate, }: Props) => {
  return (
    <SettingsCard className="flex gap-y-4">
      <div className="flex flex-col gap-y-6 pb-4">
        <div className="flex justify-between items-center">
          <p className="text-lg">Registration Configuration</p>
          {loading && <LoadingSpinner strokeWidth={1} className="size-4" />}
        </div>
        <p className="text-sm text-foreground/60">
          Configure how can member find/search themselves
        </p>
        <Separator />
      </div>
      <div
        onClick={() => {
          if (!loading && eventSettings.defaultMemberSearchMode !== "ByPassbook")
            onUpdate({ defaultMemberSearchMode: "ByPassbook" });
        }}
        className={cn(
          "flex cursor-pointer group bg-background/60 p-6 justify-between items-start lg:items-center duration-150 rounded-xl hover:bg-background border border-transparent",
          eventSettings.defaultMemberSearchMode === "ByPassbook" &&
            "pointer-events-none border border-teal-400/30",
        )}
      >
        <div className="flex flex-col gap-y-4">
          <p>PB Number</p>
          <p className="text-sm text-foreground/60">
            Default searching method will be set to Passbook Number where member
            can search themselves using their PB number.
          </p>
        </div>
        <div
          className={cn(
            "rounded-full p-2 bg-secondary/70 text-foreground/50 group-hover:bg-secondary duration-100",
            eventSettings.defaultMemberSearchMode === "ByPassbook" &&
              "pointer-events-none bg-green-500 text-white",
          )}
        >
            <Check className="size-4 lg:size-6" />
        </div>
      </div>
      <div
        onClick={() => {
          if (!loading && eventSettings.defaultMemberSearchMode !== "ByName")
            onUpdate({ defaultMemberSearchMode: "ByName" });
        }}
        className={cn(
          "flex cursor-pointer group bg-background/60 p-6 justify-between items-start lg:items-center duration-150 rounded-xl hover:bg-background border border-transparent",
          eventSettings.defaultMemberSearchMode === "ByName" &&
            "pointer-events-none border border-teal-400/30",
        )}
      >
        <div className="flex flex-col gap-y-4">
          <p>Name search</p>
          <p className="text-sm text-foreground/60">
            Default searching mode will be set to Name search. The member can
            search themselves using their <b>Last Name</b> and <b>First Name</b> separated by comma (<span className="text-3xl">,</span>) <br />
            <span className="text-foreground/40">
              Example : Castro, John Limuel{" "}
            </span>
          </p>
        </div>
        <div
          className={cn(
            "rounded-full p-2 bg-secondary/70 text-foreground/50 group-hover:bg-secondary duration-100",
            eventSettings.defaultMemberSearchMode === "ByName" &&
              "pointer-events-none bg-green-500 text-white",
          )}
        >
            <Check className="size-4 lg:size-6" />
        </div>
      </div>
    </SettingsCard>
  );
};

export default MemberSearchModeSettings;
