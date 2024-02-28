import z from "zod";
import axios from "axios";
import qs from "query-string";
import { toast } from "sonner";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import QrReader from "@/components/qr-reader/html5-qr-reader";

import { TMemberAttendees } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { passbookSearchSchema } from "@/validation-schema/event-registration-voting";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchVoter } from "@/hooks/api-hooks/voter-api-hooks";

type Props = {
  eventId: number;
  electionId: number;
  onFound: (voter: TMemberAttendees) => void;
};

type TPassbookForm = z.infer<typeof passbookSearchSchema>;

const VoterSearch = ({ eventId, electionId, onFound }: Props) => {
  const [pb, setPb] = useState("");

  const form = useForm<TPassbookForm>({
    resolver: zodResolver(passbookSearchSchema),
    defaultValues: {
      passbookNumber: "",
    },
  });

  const {isPending, findVoter} = searchVoter(eventId, electionId, onFound);
  const disabled = isPending;

  return (
    <div className="flex flex-col items-center gap-y-4">
      <QrReader
        className="size-[400px] bg-background overflow-clip rounded-xl"
        disableFlip={false}
        fps={5}
        qrbox={800}
        onRead={(val: string) => {
          form.setValue("passbookNumber", val);
          findVoter(val);
        }}
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
