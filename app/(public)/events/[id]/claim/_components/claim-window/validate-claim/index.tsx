import z from "zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

import QrReader from "@/components/qr-reader";
import ErrorAlert from "@/components/error-alert/error-alert";
import { createPublicClaimAuthorizationFormSchema, createPublicClaimAuthorizationSchema } from "@/validation-schema/incentive";
import { useCreateClaimAuth } from "@/hooks/public-api-hooks/use-claim-api";
import { TMemberAttendeesMinimalInfo } from "@/types";
import MemberSearch from "@/components/member-search";
import UserAvatar from "@/components/user-avatar";

type Props = { eventId: number };

type TClaimValidateForm = z.infer<typeof createPublicClaimAuthorizationSchema>;

const ValidateClaim = ({ eventId }: Props) => {
    const [member, setMember] = useState<TMemberAttendeesMinimalInfo | null>(null)

    const form = useForm<TClaimValidateForm>({
        resolver: zodResolver(createPublicClaimAuthorizationFormSchema),
        defaultValues: {
            otp : ""
        },
    });

    const { authorize, isPending, isError, error } = useCreateClaimAuth(eventId);
    const disabled = isPending;

    if(!member) return <MemberSearch eventId={eventId} onFound={(member) => setMember(member)} />

    return (
        <div className="flex flex-col items-center gap-y-4">
            <div className="group flex px-3 py-2 items-center w-full gap-x-2 duration-100 ease-in rounded-xl bg-secondary/70 hover:bg-secondary">
                <div className="flex-1 flex items-center gap-x-2">
                    <UserAvatar 
                        src={member.picture as ""} 
                        fallback={`${member.firstName.charAt(0)} ${member.lastName.charAt(0)}`} 
                        className="size-12"
                    />
                    <div className="flex flex-col">
                        <p>{`${member.firstName} ${member.lastName}`}</p>
                        <p className="text-sm inline-flex"><span className="text-foreground/60">Passbook :&nbsp;</span><span>{member.passbookNumber}</span></p>
                    </div>
                </div>
                <Button size="sm" className="opacity-10 ease-in bg-transparent text-foreground hover:bg-transparent group-hover:opacity-100" onClick={()=>setMember(null)} >Cancel</Button>
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit((formValues) => authorize({...formValues, passbookNumber : member.passbookNumber}))}
                    className="flex flex-col items-center gap-y-4"
                >
                    <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        disabled={disabled}
                                        placeholder="OTP"
                                        className="text-2xl py-6 text-center font-medium placeholder:font-normal placeholder:text-base placeholder:text-foreground/70"
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
                            "Proceed to Claim"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default ValidateClaim;
