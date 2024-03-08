import z from "zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ArrowLeftRight, Loader2 } from "lucide-react";

import QrReader from "@/components/qr-reader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ErrorAlert from "@/components/error-alert/error-alert";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

import { TMemberAttendeesMinimalInfo } from "@/types";
import { voterPbSearchSchema } from "@/validation-schema/event-registration-voting";
import { useSearchMemberAttendee } from "@/hooks/public-api-hooks/use-member-api";
import MultiResultSelect from "./multi-result-select";

type Props = {
    eventId: number;
    onFound: (member: TMemberAttendeesMinimalInfo) => void;
};

const MemberSearch = ({ eventId, onFound }: Props) => {
    const [searchMode, setSearchMode] = useState(true);
    const { searchResults, searchMember, isPending, isError, error, reset } = useSearchMemberAttendee(eventId, onFound);

    const form = useForm<z.infer<typeof voterPbSearchSchema>>({
        resolver: zodResolver(voterPbSearchSchema),
        defaultValues: {
            passbookNumber: undefined,
            nameSearch: undefined,
        },
    });

    const disabled = isPending;

    if(searchResults) return (
        <div className="flex flex-col items-center gap-y-4">
            <MultiResultSelect onPick={onFound} results={searchResults} />
            <Button onClick={()=>reset()}>Search Again</Button>
        </div>
    )

    return (
        <div className="flex flex-col items-center gap-y-4">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit((pbForm) =>
                        searchMember(pbForm)
                    )}
                    className="flex flex-col items-center gap-y-4"
                >
                    <div className="flex items-center gap-x-1">
                        {searchMode ? (
                            <FormField
                                key="passbook search"
                                control={form.control}
                                name="passbookNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                disabled={disabled}
                                                placeholder="Enter Passbook Number"
                                                className="text-2xl py-6 text-center font-medium placeholder:font-normal placeholder:text-base placeholder:text-foreground/70"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ) : (
                            <FormField
                                key="name search"
                                control={form.control}
                                name="nameSearch"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input
                                                disabled={disabled}
                                                placeholder="Enter Name"
                                                className="text-2xl py-6 text-center font-medium placeholder:font-normal placeholder:text-base placeholder:text-foreground/70"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <Button size="icon" onClick={(e)=>{
                            e.preventDefault();

                            form.reset();

                            setSearchMode(!searchMode)
                        }}><ArrowLeftRight className="size-4" /></Button>
                    </div>
                    {isError && error && (
                        <ErrorAlert
                            className="w-full"
                            title="Something went wrong"
                            message={error}
                        />
                    )}
                    <Button disabled={disabled} className="w-full">
                        {isPending ? (
                            <Loader2
                                className="h-3 w-3 animate-spin"
                                strokeWidth={1}
                            />
                        ) : (
                            "Find"
                        )}
                    </Button>
                    <div className="flex items-center justify-center w-full overflow-clip gap-x-4">
                        <Separator className="w-1/2" /> or{" "}
                        <Separator className="w-1/2" />
                    </div>
                    <QrReader
                        qrReaderOption="HTML5QrScanner"
                        onRead={(val: string) => {
                            if (val.length === 0) return;
                            form.setValue("passbookNumber", val);
                            searchMember({ passbookNumber: val });
                        }}
                        className="size-[340px] sm:size-[400px] bg-background overflow-clip rounded-xl"
                    />
                </form>
            </Form>
        </div>
    );
};

export default MemberSearch;
