import { electionSettingSchema } from "@/validation-schema/election-settings";
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
import { Loader2 } from "lucide-react";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

type Props = {
   election: TElection;
};

export type SettingsType = {
   voteEligibility: VotingEligibility;
   allowBirthdayVerification: boolean;
};

const SettingsForm = ({ election }: Props) => {
   const { onOpen: onOpenConfirmModal } = useConfirmModal();
   const [voteEligibility,setVoteEligibility] = useState<VotingEligibility>(election.voteEligibility)
   const [allowBirthday,setAllowBirthday] = useState<boolean>(election.allowBirthdayVerification)
    
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

   const isSettingChange = voteEligibility === election.voteEligibility && allowBirthday === election.allowBirthdayVerification
   
   useEffect(() => {
      defaultValues();
   }, [settingsForm, election,]);




   const updateSettings = updateElectionSettings();
   const electionId = election.id;
   
   const isLoading = updateSettings.isPending 

   const onSubmit = (formValues: z.infer<typeof electionSettingSchema>) => {
      onOpenConfirmModal({
         title: "Update Election Settings ",
         description: "Are you sure you want to udapte this Election",
         onConfirm: () => {
            updateSettings.mutate({
               electionId: electionId,
               data: formValues,
            });
            settingsForm.reset()
         },
      });
   };
   return (
      <div className="w-full ">
         <Form {...settingsForm}>
            <form
               onSubmit={settingsForm.handleSubmit(onSubmit)}
               className="space-y-5"
            >
               <FormField
                  control={settingsForm.control}
                  name="voteEligibility"
                  render={({ field }) => {
                     return (
                        <FormItem className="flex justify-between items-center">
                           <FormLabel>Vote Eligibility </FormLabel>
                           <div className="w-44">
                              <Select
                                 onValueChange={(e:VotingEligibility)=>{
                                    setVoteEligibility(e)
                                    return field.onChange(e)
                                 }}
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
                                    <SelectItem value={VotingEligibility.MIGS}>{VotingEligibility.MIGS}</SelectItem>
                                    <SelectItem value={VotingEligibility.REGISTERED}>{VotingEligibility.REGISTERED}</SelectItem>
                                    <SelectItem value={VotingEligibility.MARKED_CANVOTE}>{VotingEligibility.MARKED_CANVOTE}</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                           <FormMessage />
                        </FormItem>
                     );
                  }}
               />
               <Separator></Separator>
               <h1 className="font-bold">others</h1>
               <FormField
                  control={settingsForm.control}
                  name="allowBirthdayVerification"
                  render={({ field }) => (
                     <FormItem className="">
                        <FormLabel className="">Voting Verification </FormLabel>
                        <div className="">
                           <div className="flex items-center  justify-between w-full pr-5  space-x-2 ">
                              <FormLabel className=" text-sm font-normal">
                                 Allow “Birthday” for Member Verification
                              </FormLabel>
                              <FormControl>
                                 <Switch
                                    checked={field.value}
                                    onCheckedChange={(e)=>{
                                       setAllowBirthday(e)
                                       return field.onChange(e)
                                    }}
                                 />
                                
                              </FormControl>
                           </div>
                        </div>
                     </FormItem>
                  )}
               />
               <div className="w-full flex justify-end px-2">
                  <Button
                     disabled={isSettingChange}
                     variant={isSettingChange ? "secondary" : "default"}
                     className="rounded-lg"
                  >
                     {isLoading ? (
                        <Loader2 className="animate-spin" />
                     ) : (
                        "save"
                     )}
                  </Button>
               </div>
            </form>
         </Form>
      </div>
   );
};

export default SettingsForm;
