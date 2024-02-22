"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ModalHead from "@/components/modals/modal-head";
import { Dialog, DialogContent} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select"

import { TCandidate, TPosition } from "@/types";
import { z } from "zod";
import { useCallback, useEffect } from "react";
import { updateCandidateSchema } from "@/validation-schema/candidate";
import { useUpdateCandidate } from "@/hooks/api-hooks/candidate-api-hooks";

type Props = {
   state: boolean;
   onClose: (state: boolean) => void;
   onCancel?: () => void;
   candidate:TCandidate,
   positions:TPosition[]
};

type updateTCandidate = z.infer<typeof updateCandidateSchema>;

const UpdateCandidateModal = ({
   state,
   onClose,
   onCancel,
   candidate,
   positions,
}: Props) => {

   const candidateForm = useForm<updateTCandidate>({
      resolver: zodResolver(updateCandidateSchema),
   });
   
   const defaultValues = useCallback(() => {
      candidateForm.setValue("firstName", candidate.firstName);
      candidateForm.setValue("lastName", candidate.lastName);
      candidateForm.setValue("passbookNumber", candidate.passbookNumber);
      candidateForm.setValue("picture", candidate.picture);
      candidateForm.setValue("positionId", candidate.positionId);
      candidateForm.setValue("electionId", candidate.electionId);
   }, [candidateForm, candidate]);

   useEffect(() => {
      defaultValues();
   }, [candidateForm, candidate]);

   const onCancelandReset = () => {
      onClose(false);
   };
   const candidateId = candidate.id
   const updateCandidate = useUpdateCandidate({candidateId,onCancelandReset})
   const isLoading = updateCandidate.isPending;

   return (
      <Dialog
         open={state}
         onOpenChange={(state) => {
            onClose(state);
         }}
      >
         <DialogContent className="border-none shadow-2 sm:rounded-2xl max-w-[600px] font-inter">
            <ModalHead
               title="Update Candidate"
               description="You are about to update a candidate. When updating the candidate, you no longer need to update the passbook number."
            />
            <Form {...candidateForm}>
               <form
                  onSubmit={candidateForm.handleSubmit((formValues) => {
                  console.log(formValues)
                   updateCandidate.mutate(formValues);
                  })}
                  className=" space-y-3"
               >
                  <FormField
                     control={candidateForm.control}
                     name="firstName"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>First Name</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="enter candidate name"
                                 className="placeholder:text-foreground/40"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={candidateForm.control}
                     name="lastName"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Last Name</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="enter candidate last name"
                                 className="placeholder:text-foreground/40"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={candidateForm.control}
                     name="positionId"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Position </FormLabel>
                           <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value.toString()}
                           >
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue placeholder="Select a position" />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 {positions.map((position) => {
                                    return (
                                          <SelectItem key={position.id} value={position.id.toString()}>
                                             {position.positionName}
                                          </SelectItem>
                                    );
                                 })}
                              </SelectContent>
                           </Select>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <Separator className="bg-muted/70" />
                  <div className="flex justify-end gap-x-2">
                     <Button
                        disabled={isLoading}
                        onClick={(e) => {
                           onCancelandReset()
                           e.preventDefault();
                        }}
                        variant={"secondary"}
                        className="bg-muted/60 hover:bg-muted"
                     >
                        cancel
                     </Button>
                     <Button disabled={isLoading} type="submit">
                        {isLoading ? (
                           <Loader2
                              className="h-3 w-3 animate-spin"
                              strokeWidth={1}
                           />
                        ) : (
                           "Save"
                        )}
                     </Button>
                  </div>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
};

export default UpdateCandidateModal;
