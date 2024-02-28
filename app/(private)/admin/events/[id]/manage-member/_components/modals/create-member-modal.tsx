"use client";
import axios from "axios";
import { toast } from "sonner";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CalendarIcon, Loader2 } from "lucide-react";

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

import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { EventType, gender } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import useImagePick from "@/hooks/use-image-pick";
import { onUploadImage } from "@/hooks/api-hooks/image-upload-api-hook";
import ImagePick from "@/components/image-pick";
import { v4 as uuid, v4 } from "uuid";
import { createMemberWithUploadSchema } from "@/validation-schema/member";
import { createMember } from "@/hooks/api-hooks/member-api-hook";

type Props = {
   state: boolean;
   onClose: (state: boolean) => void;
   onCancel?: () => void;
   eventId: number;
};
export type createTMember = z.infer<typeof createMemberWithUploadSchema>;

const CreateMemberModal = ({ eventId, state, onClose, onCancel }: Props) => {
   const router = useRouter();
   const queryClient = useQueryClient();
   const [isElection, setIsElection] = useState(false);

   const { imageURL, imageFile, onSelectImage, resetPicker } = useImagePick({
      initialImageURL: "/images/default.png",
      maxOptimizedSizeMB: 1,
      maxWidthOrHeight: 800,
   });

   const defaultValues = {
      passbookNumber: "",
      firstName: "",
      middleName: "",
      lastName: "",
      gender: undefined,
      birthday: undefined,
      contact: "",
      emailAddress: "",
      picture: imageFile,
      voteOtp: "",
      eventId: eventId,
   };

   const memberForm = useForm<createTMember>({
      resolver: zodResolver(createMemberWithUploadSchema),
      defaultValues: defaultValues,
   });

   const reset = () => {
      memberForm.reset();
   };
   
   const onCancelandReset = () => {
      reset();
      onClose(false);
   };

   const createMemberMutation = createMember({ onCancelandReset });

   const uploadImage = onUploadImage();

   const onSubmit = async (formValues: createTMember) => {
      try {
         if (!imageFile) {
            createMemberMutation.mutate({
               member: {
                  ...formValues,
                  picture: "/images/default.png",
               },
            });
         } else {
            const image = await uploadImage.mutateAsync({
               fileName: `${v4()}`,
               folderGroup: "member",
               file: formValues.picture,
            });
            createMemberMutation.mutate({
               member: {
                  ...formValues,
                  picture: !image ? "/images/default.png" : image,
               },
            });
         }
         resetPicker();
      } catch (error) {
         console.log(error);
      }
   };
   const isLoading = createMemberMutation.isPending;
   const isUploading = uploadImage.isPending;

   return (
      <Dialog
         open={state}
         onOpenChange={(state) => {
            onClose(state);
            reset();
         }}
      >
         <DialogContent className="border-none shadow-2 sm:rounded-2xl max-w-[1000px] font-inter">
            <ModalHead
               title="Create Member"
               description="Creating a member that is exclusive to being either a partial or full member of the Coop."
            />
            <Form {...memberForm}>
               <form onSubmit={memberForm.handleSubmit(onSubmit)} className="">
                  <div className="flex w-full space-x-5">
                     <div className="w-1/2 space-y-2">
                        <FormField
                           control={memberForm.control}
                           name="passbookNumber"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Passbook Number</FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="enter pass book"
                                       className="placeholder:text-foreground/40"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={memberForm.control}
                           name="firstName"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>First Name</FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="enter first name"
                                       className="placeholder:text-foreground/40"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={memberForm.control}
                           name="middleName"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Middle Name</FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="Enter Middle Name"
                                       className="placeholder:text-foreground/40"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={memberForm.control}
                           name="lastName"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Last Name</FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="Enter Last Name"
                                       className="placeholder:text-foreground/40"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={memberForm.control}
                           name="birthday"
                           render={({ field }) => (
                              <FormItem className="flex flex-col">
                                 <FormLabel>Birthday</FormLabel>
                                 <Popover>
                                    <PopoverTrigger asChild>
                                       <FormControl>
                                          <Button
                                             variant={"outline"}
                                             className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !field.value &&
                                                   "text-muted-foreground"
                                             )}
                                          >
                                             {field.value ? (
                                                format(field.value, "PPP")
                                             ) : (
                                                <span>Pick a date</span>
                                             )}
                                             <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                          </Button>
                                       </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                       className="w-auto p-0"
                                       align="start"
                                    >
                                       <Calendar
                                          mode="single"
                                          selected={field.value}
                                          onSelect={field.onChange}
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
                           control={memberForm.control}
                           name="contact"
                           render={({ field }) => (
                              <FormItem className="">
                                 <FormLabel>Contact</FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="enter contact"
                                       className="placeholder:text-foreground/40"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={memberForm.control}
                           name="emailAddress"
                           render={({ field }) => (
                              <FormItem className="">
                                 <FormLabel>Email</FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="enter email address"
                                       className="placeholder:text-foreground/40"
                                       {...field}
                                       value={field.value ?? ""}
                                       onChange={(e) => {
                                          const value = e.target.value;
                                          field.onChange(
                                             value !== "" ? value : null
                                          );
                                       }}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>
                     <div className="w-1/2 space-y-2">
                        <FormField
                           control={memberForm.control}
                           name="gender"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Gender </FormLabel>
                                 <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                 >
                                    <FormControl>
                                       <SelectTrigger>
                                          <SelectValue placeholder="Select gender" />
                                       </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                       <SelectItem value={gender.Male}>
                                          {gender.Male}
                                       </SelectItem>
                                       <SelectItem value={gender.Female}>
                                          {gender.Female}
                                       </SelectItem>
                                    </SelectContent>
                                 </Select>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={memberForm.control}
                           name="picture"
                           render={({ field }) => {
                              return (
                                 <FormItem>
                                    <FormLabel>Profile</FormLabel>
                                    <FormControl>
                                       <>
                                          <ImagePick
                                             className="flex flex-col items-center gap-y-4"
                                             url={imageURL}
                                             onChange={async (e) => {
                                                field.onChange(
                                                   await onSelectImage(e)
                                                );
                                             }}
                                          />
                                       </>
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              );
                           }}
                        />
                     </div>
                  </div>
                  <div>
                     <Separator className="bg-muted/70" />
                     <div className="flex justify-end gap-x-2">
                        <Button
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
                  </div>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
};

export default CreateMemberModal;
