"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ModalHead from "@/components/modals/modal-head";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import {
   createCandidateWithUploadSchema,
} from "@/validation-schema/candidate";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { useCreateCandidate } from "@/hooks/api-hooks/candidate-api-hooks";
import { TMemberWithEventElectionId, TPosition } from "@/types";
import {
   onUploadImage,
} from "@/hooks/api-hooks/image-upload-api-hook";
import EventAttendeesTable from "../attendees-table";

type Props = {
   state: boolean;
   onClose: (state: boolean) => void;
   onCancel?: () => void;
   positions:TPosition[] | undefined;
   params: { id: number; electionId: number };
   data:TMemberWithEventElectionId[]
};

export type createTCandidate = z.infer<typeof createCandidateWithUploadSchema>;

const CreateCandidateModal = ({
   state,
   onClose,
   onCancel,
   positions,
   params,
   data
}: Props) => {

   const defaultValues = {
      firstName: "",
      lastName: "",
      passbookNumber: "",
      electionId: params.electionId,
      positionId: 0,
   };

   const candidateForm = useForm<createTCandidate>({
      resolver: zodResolver(createCandidateWithUploadSchema),
      defaultValues: defaultValues,
   });

   const reset = () => {
      candidateForm.reset(defaultValues);
   };
   const onCancelandReset = () => {
      reset();
      onClose(false);
   };
   const createCandidate = useCreateCandidate({ onCancelandReset,params });

   const uploadImage = onUploadImage();

   const onSubmit = async (formValues: createTCandidate) => {
      //console.log(formValues)
    
   };
   const isUploading = uploadImage.isPending;
   const isLoading = createCandidate.isPending;

   return (
      <Dialog
         open={state}
         onOpenChange={(state) => {
            onClose(state);
            reset();
         }}
      >
         <DialogContent className="border-none shadow-2 sm:rounded-2xl overflow-y-auto lg:overflow-hidden max-h-[600px] lg:max-h-fit max-w-fit font-inter">
            <ModalHead
               title="Add Candidate"
               description="You are about to create a candidate for this elections and the profile can be optional."
            />
            <Form {...candidateForm}>
               <form
                  onSubmit={candidateForm.handleSubmit(onSubmit)}
                  className=" space-y-3"
               >
                  {/* <FormField
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
                     render={({ field }) => {
                        return (
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
                        );
                     }}
                  /> */}

                  <EventAttendeesTable data={data} ></EventAttendeesTable>

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
                                 {positions?.map((position) => {
                                    return (
                                       <SelectItem
                                          key={position.id}
                                          value={position.id.toString()}
                                       >
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
                           onCancelandReset();
                        }}
                        variant={"secondary"}
                        className="bg-muted/60 hover:bg-muted"
                     >
                        cancel
                     </Button>
                     <Button disabled={isLoading} type="submit">
                        {isLoading || isUploading ? (
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
