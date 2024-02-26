import {
   electionSettingSchema,
} from "@/validation-schema/election-settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role, VotingEligibility } from "@prisma/client";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TElection } from "@/types";
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import {
   Select,
   SelectTrigger,
   SelectValue,
   SelectContent,
   SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { updateElectionSettings } from "@/hooks/api-hooks/settings-hooks";
import { Loader2, LoaderIcon } from "lucide-react";

type Props = {
   election: TElection;
};

export type SettingsType = {
   voteEligibility: VotingEligibility;
   allowBirthdayVerification: boolean;
};

const SettingsForm = ({ election }: Props) => {

   const settingsForm = useForm<SettingsType>({
      resolver: zodResolver(electionSettingSchema),
   });
   const defaultValues = useCallback(() => {
      settingsForm.setValue("voteEligibility", election.voteEligibility);
      settingsForm.setValue(
         "allowBirthdayVerification",
         election.allowBirthdayVerification
      );
   }, [settingsForm, election]);

  const isSettingChange = settingsForm.getValues("allowBirthdayVerification") === election.allowBirthdayVerification || settingsForm.getValues("voteEligibility") === election.voteEligibility
  console.log(isSettingChange)

  useEffect(() => {
      defaultValues();
   }, [settingsForm, election]);

   const updateSettings = updateElectionSettings()
   const electionId = election.id
   const onSubmit = (formValues:z.infer<typeof electionSettingSchema>)=>{
      updateSettings.mutate({
         electionId:electionId,
         data:formValues
      })
   }

   return (
      <div className="w-full ">
         <Form {...settingsForm}>
            <form onSubmit={settingsForm.handleSubmit(onSubmit)} className="space-y-5">
               <FormField
                  control={settingsForm.control}
                  name="voteEligibility"
                  render={({ field }) => {
                     return (
                        <FormItem className="flex justify-between items-center">
                           <FormLabel>Vote Eligibility </FormLabel>
                           <div className="w-44">
                           <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                           >
                             <FormControl>
                                 <SelectTrigger className=" border-0 ring-offset-0 focus:ring-0 round-0 focus-visible:ring-0">
                                    <SelectValue 
                                    className="ring-offset-0 focus:ring-0 round-0 focus-visible:ring-0"
                                       placeholder={`${settingsForm.getValues(
                                          "voteEligibility"
                                       )}`}
                                    />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 <SelectItem value="MIGS">MIGS</SelectItem>
                                 <SelectItem value="REGISTERED">
                                    REGISTERED
                                 </SelectItem>
                                 <SelectItem value="MARKED_CANVOTE">
                                    MARKED_CANVOTE
                                 </SelectItem>
                              </SelectContent>
                           </Select>
                           </div>
                           <FormMessage />
                        </FormItem>
                     );
                  }}
               />
               <FormField
                  control={settingsForm.control}
                  name="allowBirthdayVerification"
                  render={({ field }) => (
                     <FormItem className="">
                        <FormLabel>Voting Verification </FormLabel>

                        <div className="">
                           <div className="flex items-center  justify-between w-full pr-5  space-x-2 ">
                              <FormLabel className=" text-sm font-normal">
                                 Allow “Birthday” for Member Verification
                              </FormLabel>
                              <FormControl>
                                 <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                 />
                              </FormControl>
                           </div>
                        </div>
                     </FormItem>
                  )}
               />
               <div className="w-full flex justify-end px-2">
                  <Button disabled={!isSettingChange}  className="rounded-lg">
                    {updateSettings.isPending ? <Loader2 className="animate-spin"/>:"save"}
                  </Button>
               </div>
            </form>
         </Form>
      </div>
   );
};

export default SettingsForm;
