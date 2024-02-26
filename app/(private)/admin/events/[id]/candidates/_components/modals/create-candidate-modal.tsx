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
import { TPosition } from "@/types";
import ImagePick from "@/components/image-pick";
import useImagePick from "@/hooks/use-image-pick";
import {
   onUploadImage,
} from "@/hooks/api-hooks/image-upload-api-hook";

type Props = {
   electionId: number | undefined;
   state: boolean;
   onClose: (state: boolean) => void;
   onCancel?: () => void;
   positions: TPosition[];
};

export type createTCandidate = z.infer<typeof createCandidateWithUploadSchema>;

const CreateCandidateModal = ({
   state,
   onClose,
   onCancel,
   electionId,
   positions,
}: Props) => {

   const { imageURL, imageFile, onSelectImage, resetPicker } = useImagePick({
      initialImageURL: "/images/default.png",
      maxOptimizedSizeMB: 0.5,
      maxWidthOrHeight: 300,
   });

   const defaultValues = {
      firstName: "",
      lastName: "",
      passbookNumber: "",
      picture: imageFile,
      electionId: electionId,
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
      resetPicker();
      onClose(false);
   };
   const createCandidate = useCreateCandidate({ onCancelandReset });

   const uploadImage = onUploadImage();

   const onSubmit = async (formValues: createTCandidate) => {
      try {
         if(!imageFile) {
            createCandidate.mutate({...formValues,picture: "/images/default.png",});
         }else{
            const image = await uploadImage.mutateAsync({
               fileName: `${formValues.passbookNumber}`,
               folderGroup: "election-candidates",
               file: imageFile,
            });
            createCandidate.mutate({
               ...formValues,
               picture: !image ? "/images/default.png" : image,
            });
         }
         resetPicker();
      } catch (error) {
         console.log(error);
      }
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
         <DialogContent className="border-none shadow-2 sm:rounded-2xl max-w-[600px] font-inter">
            <ModalHead
               title="Create Candidate"
               description="You are about to create a candidate for this elections and the profile can be optional."
            />
            <Form {...candidateForm}>
               <form
                  onSubmit={candidateForm.handleSubmit(onSubmit)}
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
                  <FormField
                     control={candidateForm.control}
                     name="picture"
                     render={({ field }) => {
                        return (
                           <FormItem>
                              <FormLabel>Profile</FormLabel>
                              <FormControl>
                                 <>
                                 <ImagePick className="flex flex-col items-center gap-y-4" url={imageURL} onChange={async (e)=> {field.onChange(await onSelectImage(e))}} />
                                 </>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        );
                     }}
                  />
                  <Separator className="bg-muted/70" />
                  <div className="flex justify-end gap-x-2">
                     <Button
                        disabled={isLoading}
                        onClick={(e) => {
                           e.preventDefault();
                           reset();
                           resetPicker();
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
