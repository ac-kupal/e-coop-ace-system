import z from "zod";
import { useForm } from "react-hook-form";
import ReactInputMask from "react-input-mask";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { voterVerificationFormSchema } from "@/validation-schema/event-registration-voting";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { TElectionWithEvent, TMemberAttendeesMinimalInfo } from "@/types";
import { useVoterAuthorization } from "@/hooks/public-api-hooks/use-vote-api";
import ErrorAlert from "@/components/error-alert/error-alert";

type Props = {
    voter: TMemberAttendeesMinimalInfo;
    electionWithEvent: TElectionWithEvent;
    onAuthorize: (voter: TMemberAttendeesMinimalInfo) => void;
};

const AuthorizeVoter = ({ voter, electionWithEvent, onAuthorize }: Props) => {
    type TForm = z.infer<typeof voterVerificationFormSchema>;

    const form = useForm<TForm>({
        resolver: zodResolver(voterVerificationFormSchema),
        defaultValues: {
            passbookNumber: voter.passbookNumber,
            birthday: electionWithEvent.allowBirthdayVerification
                ? ""
                : undefined,
            otp: "",
        },
    });

    const { authenticatedVoter, getAuthorization, isPending, isError, error } = useVoterAuthorization(electionWithEvent.eventId, electionWithEvent.id, voter.id, onAuthorize);

    const onSubmit = (values: TForm) => {
        getAuthorization(values);
    };

    const disabled = isPending || authenticatedVoter !== undefined;

    return (
        <div className="flex flex-col items-center gap-y-4">
            <p>This step is for verification before we authorize you to vote</p>
            <div className="space-y-4 max-w-sm">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
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
                                        disabled={disabled}
                                        {...field}
                                        mask="99/99/9999"
                                        placeholder="input birthday"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem className="gap-y-2">
                                    <FormControl>
                                        <Input
                                            disabled={disabled}
                                            placeholder="6 digit OTP"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        { isError && error && <ErrorAlert title="Voter Check Error" message={error} /> }

                        <Button
                            disabled={disabled}
                            className="w-full"
                            type="submit"
                        >
                            {isPending || authenticatedVoter !== undefined? (
                                <Loader2
                                    className="h-3 w-3 animate-spin"
                                    strokeWidth={1}
                                />
                            ) : (
                                "Vote"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default AuthorizeVoter;
