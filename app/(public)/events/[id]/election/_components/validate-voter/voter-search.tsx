import z from "zod";
import React from "react";

import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { TMemberAttendees } from "@/types";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { passbookSearchSchema } from "@/validation-schema/event-registration-voting";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchVoter } from "@/hooks/api-hooks/voter-api-hooks";
import QrReader from "@/components/qr-reader";

type Props = {
  eventId: number;
  electionId: number;
  onFound: (voter: TMemberAttendees) => void;
};

type TPassbookForm = z.infer<typeof passbookSearchSchema>;

const VoterSearch = ({ eventId, electionId, onFound }: Props) => {
  const form = useForm<TPassbookForm>({
    resolver: zodResolver(passbookSearchSchema),
    defaultValues: {
      passbookNumber: "",
    },
  });

  form.watch("passbookNumber");

  const { isPending, findVoter } = searchVoter(eventId, electionId, onFound);
  const disabled = isPending;

  return (
    <div className="flex flex-col items-center gap-y-4">
      <QrReader
        qrReaderOption="HTML5QrScanner"
        onRead={(val: string) => {
          form.setValue("passbookNumber", val);
          findVoter(val);
        }}
        className="size-[400px] bg-background overflow-clip rounded-xl"
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((pb) => findVoter(pb.passbookNumber))}
          className="space-y-4"
        >
          <div className="flex items-center justify-center w-full overflow-clip gap-x-4">
            <Separator className="w-1/2" /> or <Separator className="w-1/2" />
          </div>
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

          <Button disabled={disabled} className="w-full" type="submit">
            {isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" strokeWidth={1} />
            ) : (
              "Find"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default VoterSearch;
