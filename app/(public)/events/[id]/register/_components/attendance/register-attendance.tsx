import z from "zod";
import React from "react";
import { useRouter } from "next/navigation";

import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { TMemberAttendeesMinimalInfo } from "@/types";
import { useRegisterMember } from "@/hooks/api-hooks/registraton-search-attendance-api-hooks";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { attendeeRegisterFormSchema } from "@/validation-schema/event-registration-voting";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorAlert from "@/components/error-alert/error-alert";

type Props = {
    eventId: string;
    member: TMemberAttendeesMinimalInfo;
};

const RegisterAttendance = ({ eventId, member }: Props) => {
    const router = useRouter();

    const { registeredMember, isPending, register, isError, error } = useRegisterMember(
        eventId,
        () => {
            router.push(`/events/${eventId}/registered`);
        },
    );

    const form = useForm<z.infer<typeof attendeeRegisterFormSchema>>({
        resolver: zodResolver(attendeeRegisterFormSchema),
        defaultValues: {
            passbookNumber: member.passbookNumber,
            birthday: undefined,
        },
    });

    const disabled = isPending || registeredMember;

    return (
        <div className="flex flex-col items-center gap-y-4">
            <p>Please input your birth date so we can verify if it is you.</p>
            <div className="space-y-4 max-w-sm">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((pb) => register(pb))}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-center w-full overflow-clip gap-x-4">
                            <Separator className="w-1/2" /> or <Separator className="w-1/2" />
                        </div>
                        <FormField
                            control={form.control}
                            name="birthday"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={disabled}
                                            placeholder="MM/DD/YYYY"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
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
                                "Register"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default RegisterAttendance;
