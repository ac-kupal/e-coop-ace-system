import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { format } from "date-fns"
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { CalendarIcon, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { voterVerificationSchema } from "@/validation-schema/event-registration-voting";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

import { cn } from "@/lib/utils";
import { handleAxiosErrorMessage } from "@/utils";
import { TElectionWithEvent, TMemberAttendees } from "@/types";

type Props = {
    voter: TMemberAttendees;
    electionWithEvent: TElectionWithEvent;
    onAuthorize: (voter: TMemberAttendees) => void;
};

const AuthorizeVoter = ({ voter, electionWithEvent, onAuthorize }: Props) => {
    type TForm = z.infer<typeof voterVerificationSchema>;

    const form = useForm<TForm>({
        resolver: zodResolver(voterVerificationSchema),
        defaultValues : {
            passbookNumber : voter.passbookNumber,
            otp : ''
        }
    });

    const { isPending, mutate : getAuthorization } = useMutation<any, string, TForm>({
        mutationKey : ["authorize-voter", voter.id],
        mutationFn : async (data) => {
            try{
                const request = await axios.post(`/api/v1/event/${electionWithEvent.eventId}/election/${electionWithEvent.id}/authorize-voter`, data, { withCredentials : true })
                onAuthorize(request.data)
            }catch(e){
                toast.error(handleAxiosErrorMessage(e));
            }
        } 
    })

    const onSubmit = (values: TForm) => {
        getAuthorization(values)
    };

    const disabled = isPending;

    return (
        <div className="flex flex-col items-center gap-y-4">
            <p>This step is for verification before we authorize you to vote</p>
            <div className="space-y-4 max-w-sm">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="birthday"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    disabled={disabled}
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "MMM dd, yyyy")
                                                    ) : (
                                                        <span>Date of Birth</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="center">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date > new Date()}
                                                captionLayout="dropdown-buttons"
                                                fromYear={1900}
                                                toYear={new Date().getFullYear()}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
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
                        <Button disabled={disabled} className="w-full" type="submit">
                            {isPending ? (
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
