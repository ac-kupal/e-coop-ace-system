"use client";
import z from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";

import QrReader from "@/components/qr-reader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ErrorAlert from "@/components/error-alert/error-alert";
import { Form, FormControl, FormDescription, FormField, FormItem } from "@/components/ui/form";

import { TMemberAttendeesMinimalInfo } from "@/types";
import { voterPbSearchSchema } from "@/validation-schema/event-registration-voting";
import { useSearchMemberAttendee } from "@/hooks/public-api-hooks/use-member-api";
import MemberCard from "./member-card";

type Props = {
    eventId : number
    onFound: (member: TMemberAttendeesMinimalInfo) => void;
    onSearchAgain : () => void;
};

const MemberSearch = ({ onFound, onSearchAgain, eventId }: Props) => {
    const { member, searchMember, isPending, isError, error } = useSearchMemberAttendee(eventId, onFound);

    const form = useForm<z.infer<typeof voterPbSearchSchema>>({
        resolver: zodResolver(voterPbSearchSchema),
        defaultValues: {
            passbookNumber: "",
        },
    });

    const disabled = isPending;

    return (
        <div className="flex flex-col items-center gap-y-4">
            { !isPending && member && <MemberCard member={member} />}

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit((pbForm) => {
                        onSearchAgain();
                        searchMember(pbForm)
                    })}
                    className="space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="passbookNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        disabled={disabled}
                                        placeholder="Enter Passbook Number"
                                        className="w-fit py-8 text-lg text-center bg-transparent lg:text-2xl outline-none border-0 focus-visible:ring-transparent border-foreground focus:ring-offset-0 border-b-2"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    {isError && error && (
                        <ErrorAlert
                            className="w-full"
                            title="Something went wrong"
                            message={error}
                        />
                    )}
                    <Button disabled={disabled} className="w-full flex gap-x-2">
                        {isPending && <Loader2 className="h-3 w-3 animate-spin" strokeWidth={1} />}
                        Get Passbook QR
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default MemberSearch;
