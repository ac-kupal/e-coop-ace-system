"use client";
import React from "react";
import { toast } from "sonner";
import { Sigma } from "lucide-react";

import {
    Card,
    CardTitle,
    CardHeader,
    CardContent,
    CardDescription,
} from "@/components/ui/card";

import { useAttendanceStats } from "@/hooks/api-hooks/attendance-api-hooks";
import LoadingSpinner from "@/components/loading-spinner";

interface Props {
    eventId: number;
}

const AttendanceQuorum = ({ eventId }: Props) => {
    const { data: attendanceStats, isRefetching: isLoadingAttendanceStats } =
        useAttendanceStats({
            eventId,
            onError: () => toast.error("Failed to load event stats"),
        });

    return (
        <Card className="w-full md:w-fit flex-auto relative">
            <div className="flex p-4 space-x-2  items-center py-2">
                <div className="p-1 dark:bg-[#c5a522] bg-[#e7c127] rounded-sm">
                    <Sigma className="size-5 text-slate-200" />
                </div>
                <h1 className="font-medium">Quorum</h1>
            </div>
            <CardContent className="space-y-2">
                <div className="flex items-center gap-x-4">
                    <h1>Total Attendance</h1>
                    {!attendanceStats && isLoadingAttendanceStats ? (
                        <>
                            <p className="text-muted-foreground">...</p>
                            <LoadingSpinner className="size-6 text-muted-foreground absolute top-4 right-4" />
                        </>
                    ) : attendanceStats ? (
                        <h1 className="font-bold text-xl xl:text-3xl text-primary">
                            {attendanceStats.totalAttendees > 0
                                ? (
                                      (attendanceStats.totalIsRegistered /
                                          attendanceStats.totalAttendees) *
                                      100
                                  ).toLocaleString("en-US", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                  })
                                : "0"}{" "}
                            %
                        </h1>
                    ) : (
                        <span className="text-3xl text-muted-foreground">
                            ...
                        </span>
                    )}
                </div>

                <CardDescription className="text-md">
                    {attendanceStats.totalIsRegistered + " (Total registered)"}
                    {" / "}
                    {attendanceStats.totalAttendees + " members"}
                </CardDescription>
            </CardContent>
        </Card>
    );
};

export default AttendanceQuorum;
