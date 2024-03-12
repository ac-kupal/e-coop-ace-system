import { electionSettingSchema } from "@/validation-schema/election-settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { VotingEligibility, VotingConfiguration, VotingScreenOrientation } from "@prisma/client";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SettingsType, TElection } from "@/types";
import {
   Form,
   FormControl,
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
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { updateElectionSettings } from "@/hooks/api-hooks/settings-hooks";
import { Loader2 } from "lucide-react";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

type Props = {
   election: TElection;
   params:{id:number,electionId:number}
};


const SettingsForm = ({ election,params }: Props) => {
   const { onOpen: onOpenConfirmModal } = useConfirmModal();
   const [voteEligibility,setVoteEligibility] = useState<VotingEligibility>(election.voteEligibility)
   const [allowBirthday,setAllowBirthday] = useState<boolean>(election.allowBirthdayVerification)
   const [voteConfiguration,setVoteConfiguration] = useState<VotingConfiguration>(election.voteConfiguration)
   const [voteScreenConfiguration,setVoteScreenConfiguration] = useState<VotingScreenOrientation>(election.voteScreenConfiguration)
    
   const settingsForm = useForm<SettingsType>({
      resolver: zodResolver(electionSettingSchema),
   });
   const defaultValues = useCallback(() => {
      settingsForm.setValue("voteEligibility", election.voteEligibility);
      settingsForm.setValue(
         "allowBirthdayVerification",
         election.allowBirthdayVerification
      );
      settingsForm.setValue("voteConfiguration", election.voteConfiguration)
      settingsForm.setValue("voteScreenConfiguration",  election.voteScreenConfiguration)
   }, [settingsForm, election]);

   const isSettingChange = voteEligibility === election.voteEligibility && allowBirthday === election.allowBirthdayVerification && voteConfiguration === election.voteConfiguration && voteScreenConfiguration === election.voteScreenConfiguration
   
   useEffect(() => {
      defaultValues();
   }, [settingsForm, election,]);


   const updateSettings = updateElectionSettings({params});


   const isLoading = updateSettings.isPending 

   const onSubmit = (formValues: z.infer<typeof electionSettingSchema>) => {
      //console.log(formValues)
      onOpenConfirmModal({
         title: "Update Election Settings ",
         description: "Are you sure you want to update this Election",
         onConfirm: () => {
            updateSettings.mutate({
               data: formValues,
            });
            settingsForm.reset()
         },
      });
   };
   return (
      <div className="w-full p-2">
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
                <FormField
                  control={settingsForm.control}
                  name="voteConfiguration"
                  render={({ field }) => {
                     return (
                        <FormItem className="flex justify-between items-center">
                           <FormLabel>Voting Configuration </FormLabel>
                           <div className="w-44">
                              <Select
                                 onValueChange={(e:VotingConfiguration)=>{
                                    setVoteConfiguration(e)
                                    return field.onChange(e)
                                 }}
                                 defaultValue={field.value}
                              >
                                 <FormControl>
                                    <SelectTrigger className=" border-0 ring-offset-0 focus:ring-0 round-0 focus-visible:ring-0">
                                       <SelectValue
                                          className="ring-offset-0 focus:ring-0 round-0 focus-visible:ring-0"
                                          placeholder={`${settingsForm.getValues(
                                             "voteConfiguration"
                                          )}`}
                                       />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    <SelectItem value={VotingConfiguration.ALLOW_SKIP}>{VotingConfiguration.ALLOW_SKIP}</SelectItem>
                                    <SelectItem value={VotingConfiguration.ATLEAST_ONE}>{VotingConfiguration.ATLEAST_ONE}</SelectItem>
                                    <SelectItem value={VotingConfiguration.REQUIRE_ALL}>{VotingConfiguration.REQUIRE_ALL}</SelectItem>
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
                  name="voteScreenConfiguration"
                  render={({ field }) => {
                     return (
                        <FormItem className="flex justify-between items-center">
                           <FormLabel>Voting Screen Orientation</FormLabel>
                           <div className="w-44">
                              <Select
                                 onValueChange={(e:VotingScreenOrientation)=>{
                                    setVoteScreenConfiguration(e)
                                    return field.onChange(e)
                                 }}
                                 defaultValue={field.value}
                              >
                                 <FormControl>
                                    <SelectTrigger className=" border-0 ring-offset-0 focus:ring-0 round-0 focus-visible:ring-0">
                                       <SelectValue
                                          className="ring-offset-0 focus:ring-0 round-0 focus-visible:ring-0"
                                          placeholder={`${settingsForm.getValues(
                                             "voteScreenConfiguration"
                                          )}`}
                                       />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    <SelectItem value={VotingScreenOrientation.PORTRAIT}>{VotingScreenOrientation.PORTRAIT}</SelectItem>
                                    <SelectItem value={VotingScreenOrientation.LANDSCAPE}>{VotingScreenOrientation.LANDSCAPE}</SelectItem>
                                    <SelectItem value={VotingScreenOrientation.ANY}>{VotingScreenOrientation.ANY}</SelectItem>
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
