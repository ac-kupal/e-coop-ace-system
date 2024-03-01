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
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useSearchMemberAttendee } from "@/hooks/api-hooks/registraton-search-attendance-api-hooks";

import { TMemberAttendeesMinimalInfo } from "@/types";
import { voterPbSearchSchema } from "@/validation-schema/event-registration-voting";

type Props = {
    onFound: (member: TMemberAttendeesMinimalInfo) => void;
    params: { id: string };
};

const AttendeeSearch = ({ onFound, params }: Props) => {
    const { searchMember, isPending, isError, error } = useSearchMemberAttendee(
        params.id,
        onFound,
    );

    const form = useForm<z.infer<typeof voterPbSearchSchema>>({
        resolver: zodResolver(voterPbSearchSchema),
        defaultValues: {
            passbookNumber: "",
        },
    });

    const disabled = isPending;

    return (
        <div className="flex flex-col items-center gap-y-4">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit((pbForm) => searchMember(pbForm))}
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
                    <Button disabled={disabled} className="w-full">
                        {isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" strokeWidth={1} />
                        ) : (
                            "Find"
                        )}
                    </Button>
                    <div className="flex items-center justify-center w-full overflow-clip gap-x-4">
                        <Separator className="w-1/2" /> or <Separator className="w-1/2" />
                    </div>
                    <QrReader
                        qrReaderOption="HTML5QrScanner"
                        onRead={(val: string) => {
                            if(val.length === 0) return;
                            form.setValue("passbookNumber", val);
                            searchMember({ passbookNumber : val });
                        }}
                        className="size-[400px] bg-background overflow-clip rounded-xl"
                    />
                </form>
            </Form>
        </div>
    );
};

export default AttendeeSearch;
