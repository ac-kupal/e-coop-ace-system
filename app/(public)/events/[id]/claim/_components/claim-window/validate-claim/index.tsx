import z from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

import QrReader from "@/components/qr-reader";
import ErrorAlert from "@/components/error-alert/error-alert";
import { createPublicClaimAuthorizationSchema } from "@/validation-schema/incentive";
import { useCreateClaimAuth } from "@/hooks/public-api-hooks/use-claim-api";

type Props = { eventId: number };

type TClaimValidateForm = z.infer<typeof createPublicClaimAuthorizationSchema>;

const ValidateClaim = ({ eventId }: Props) => {
    const form = useForm<TClaimValidateForm>({
        resolver: zodResolver(createPublicClaimAuthorizationSchema),
        defaultValues: {
            passbookNumber: "",
            otp : ""
        },
    });

    form.watch("passbookNumber");

    const { authorize, isPending, isError, error } = useCreateClaimAuth(eventId);
    const disabled = isPending;

    return (
        <div className="flex flex-col items-center gap-y-4">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit((formValues) => authorize(formValues))}
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        disabled={disabled}
                                        placeholder="OTP"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    { isError && error && <ErrorAlert title="Claim Authorization Failed" message={error}/> }
                    <Button disabled={disabled} className="w-full" type="submit">
                        {isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" strokeWidth={1} />
                        ) : (
                            "Proceed"
                        )}
                    </Button>
                    <div className="flex items-center justify-center w-full overflow-clip gap-x-4">
                        <Separator className="w-1/2" /> or <Separator className="w-1/2" />
                    </div>
                    <QrReader
                        qrReaderOption="HTML5QrScanner"
                        onRead={(val: string) => {
                            if(!val || val.length === 0) return;
                            form.setValue("passbookNumber", val);
                            authorize({
                                passbookNumber: val,
                                otp : form.getValues("otp")
                            })
                        }}
                        className="size-[320px] md:size-[400px] bg-background overflow-clip rounded-xl"
                    />
                </form>
            </Form>
        </div>
    );
};

export default ValidateClaim;
