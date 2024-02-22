"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ModalHead from "@/components/modals/modal-head";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";

import { z } from "zod";
import { createCandidateSchema } from "@/validation-schema/candidate";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select"
import { useCreateCandidate } from "@/hooks/api-hooks/candidate-api-hooks";
import { useState } from "react";
import { TPosition } from "@/types";

type Props = {
   electionId: number | undefined;
   positionId: number | undefined;
   state: boolean;
   onClose: (state: boolean) => void;
   onCancel?: () => void;
   positions: TPosition[];
};

type createTCandidate = z.infer<typeof createCandidateSchema>;

const CreateCandidateModal = ({state,onClose,onCancel,electionId,positions}: Props) => {

   const defaultValues = {
      firstName: "",
      lastName: "",
      passbookNumber: 0,
      picture: null,
      electionId: electionId,
      positionId: 0,
   };

   const candidateForm = useForm<createTCandidate>({
      resolver: zodResolver(createCandidateSchema),
      defaultValues: defaultValues,
   });

   const reset = () => {
      candidateForm.reset(defaultValues);
   };
   const onCancelandReset = () => {
      reset();
      onClose(false);
   };
   const createCandidate = useCreateCandidate({ onCancelandReset });
   const isLoading = createCandidate.isPending;

   return (
      <Dialog
         open={state}
         onOpenChange={(state) => {
            onClose(state);
            reset();
         }}
      >
         <DialogContent className="border-none shadow-2 sm:rounded-2xl max-w-[600px] font-inter">
            <ModalHead
               title="Create Candidate"
               description="You are about to create a candidate"
            />
            <Form {...candidateForm}>
               <form
                  onSubmit={candidateForm.handleSubmit((formValues) => {
                     console.log(formValues)
                   createCandidate.mutate(formValues);
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
                     name="passbookNumber"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Passbook No.</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="enter passbook number of candidate"
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
                           <FormLabel>Select a Position </FormLabel>
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
                           e.preventDefault();
                           reset();
                        }}
                        variant={"ghost"}
                        className="bg-muted/60 hover:bg-muted"
                     >
                        clear
                     </Button>
                     <Button
                        disabled={isLoading}
                        onClick={(e) => {
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

export default CreateCandidateModal;
