import z from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";
import ReactInputMask from "react-input-mask";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ErrorAlert from "@/components/error-alert/error-alert";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { TMemberAttendeesMinimalInfo } from "@/types";
import { attendeeRegisterFormSchema } from "@/validation-schema/event-registration-voting";
import { useRegisterMember } from "@/hooks/public-api-hooks/use-member-api";

type Props = {
    eventId: number;
    member: TMemberAttendeesMinimalInfo;
};

const RegisterAttendance = ({ eventId, member }: Props) => {
    const router = useRouter();

    const { registeredMember, isPending, register, isError, error } = useRegisterMember(eventId, () => { router.push(`/events/${eventId}/register/registered`) });

    const form = useForm<z.infer<typeof attendeeRegisterFormSchema>>({
        resolver: zodResolver(attendeeRegisterFormSchema),
        defaultValues: {
            passbookNumber: member.passbookNumber,
            birthday: "",
        },
    });

    const disabled = isPending || registeredMember;

    return (
        <div className="flex flex-col items-center gap-y-4">
            <p className="text-sm lg:text-base text-center text-foreground/60">Please input your birth date so we can verify if it is you.</p>
            <div className="space-y-4 max-w-sm">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((pb) => register(pb))}
                        className="space-y-4 px-2"
                    >
                        <div className="flex items-center justify-center w-full overflow-clip gap-x-4">
                            <Separator className="w-1/2" /> or{" "}
                            <Separator className="w-1/2" />
                        </div>
                        <FormField
                            control={form.control}
                            name="birthday"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="flex justify-between">
                                        <h1>Birthday</h1>{" "}
                                        <span className="text-[12px] italic text-muted-foreground">
                                            mm/dd/yyyy
                                        </span>
                                    </FormLabel>
                                    <ReactInputMask
                                        {...field}
                                        mask="99/99/9999"
                                        placeholder="input birthday"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {isError && error && (
                            <ErrorAlert
                                className="w-full"
                                title="Registration Error"
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
