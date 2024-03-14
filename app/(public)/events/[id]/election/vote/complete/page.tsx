"use client";
import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import InvalidPrompt from "@/components/invalid-prompt";
import LoadingSpinner from "@/components/loading-spinner";

import { useElection } from "@/hooks/public-api-hooks/use-election-api";

type Props = {
  params: { id: number };
};

const CompletePage = ({ params }: Props) => {
  const searchParams = useSearchParams();
  const { election, isLoading } = useElection(params.id);

  const pb = searchParams.get("pb");
  const fullName = searchParams.get("fullname");
  const picture = searchParams.get("picture");

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh">
        <LoadingSpinner />
      </div>
    );

  if (!election)
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh">
        <InvalidPrompt message="Election was not found" />
      </div>
    );

  return (
    <div className="flex flex-col items-center min-h-dvh">
      <div className="w-full flex-1 bg-background px-8 gap-y-8 py-16 max-w-4xl flex flex-col items-center">
        <div className="relative overflow-clip w-full">
          <img
            className="object-cover w-full rounded-xl max-h-[350px] "
            src={election.event.coverImage as ""}
          />
          <div className="absolute w-full flex items-center bottom-0 left-0 py-8 px-4 bg-gradient-to-t  from-background to-transparent">
            <h1 className="text-4xl dark:text-[#e7e0fb]">
              {election.event.title}
            </h1>
          </div>
        </div>

        <div className="rounded-full bg-secondary text-green-400 border border-green-500 p-4">
          <CheckIcon className="size-5" />
        </div>

        <p className="text-lg">Thank you for voting 🥳</p>
        {pb && fullName && (
          <div className="flex px-6 py-4 rounded-xl bg-secondary/25 w-full gap-y-2 flex-col items-center">
            {picture && (
              <UserAvatar className="size-16" src={picture} fallback=".." />
            )}
            <p className="text-2xl lg:text-4xl"> {fullName} </p>
            <p className="text-xl lg:text-2xl"> {pb} </p>
            <p className="text-xl text-green-400 lg:text-2xl"> Voted </p>
          </div>
        )}

        <p className="text-foreground/80 text-center">
          Your vote has been saved & the copy of your vote has been sent to your
          email.
        </p>
        <Link className="" href={`/events/${election.eventId}`}>
          <Button size="sm">Return to Event</Button>
        </Link>
      </div>
    </div>
  );
};

export default CompletePage;
