import z from "zod";
import { useForm } from "react-hook-form";
import ReactInputMask from "react-input-mask";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";

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
import { cn } from "@/lib/utils";
import { OTPInput } from "input-otp";
import OtpSlot from "@/components/otp-input/otp-slot";

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
      birthday: electionWithEvent.allowBirthdayVerification ? "" : undefined,
      otp: "",
    },
  });

  const { authenticatedVoter, getAuthorization, isPending, isError, error } =
    useVoterAuthorization(
      electionWithEvent.eventId,
      electionWithEvent.id,
      voter.id,
      onAuthorize,
    );

  const onSubmit = (values: TForm) => {
    getAuthorization(values);
  };

  const disabled = isPending || authenticatedVoter !== undefined;

  return (
    <div className="flex flex-col items-center gap-y-4">
      <p className="text-sm lg:text-base text-center text-foreground/60 pb-4">
        This step is for verification before we authorize you to vote
      </p>
      <div className="space-y-4 max-w-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="gap-y-2">
                  <p className="text-lg text-center ">OTP</p>
                  <FormControl>
                    <OTPInput
                      {...field}
                      maxLength={6}
                      inputMode="text"
                      pattern="^[a-zA-Z0-9]+$"
                      containerClassName="group flex items-center has-[:disabled]:opacity-30"
                      render={({ slots }) => (
                        <>
                          <div className="flex">
                            {slots.slice(0, 3).map((slot, idx) => (
                              <OtpSlot key={idx} {...slot} />
                            ))}
                          </div>
                          <div className="w-5 mx-2 h-2 bg-secondary rounded-full" />
                          <div className="flex">
                            {slots.slice(3).map((slot, idx) => (
                              <OtpSlot key={idx} {...slot} />
                            ))}
                          </div>
                        </>
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {electionWithEvent.allowBirthdayVerification && (
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
                      className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        "text-xl text-center font-medium placeholder:font-normal placeholder:text-base placeholder:text-foreground/70",
                      )}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {isError && error && (
              <ErrorAlert title="Voter Check Error" message={error} />
            )}

            <Button disabled={disabled} className="w-full" type="submit">
              {isPending || authenticatedVoter !== undefined ? (
                <Loader2 className="h-3 w-3 animate-spin" strokeWidth={1} />
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
