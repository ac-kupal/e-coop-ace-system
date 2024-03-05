"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
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
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

import {  gender } from "@prisma/client";
import { useCallback, useEffect, useRef } from "react";
import { z } from "zod";
import useImagePick from "@/hooks/use-image-pick";
import { onUploadImage } from "@/hooks/api-hooks/image-upload-api-hook";
import ImagePick from "@/components/image-pick";
import { v4 } from "uuid";
import { createMemberWithUploadSchema } from "@/validation-schema/member";
import { updateMember } from "@/hooks/api-hooks/member-api-hook";
import { TMember } from "@/types";
import InputMask from "react-input-mask";

type Props = {
   state: boolean;
   onClose: (state: boolean) => void;
   onCancel?: () => void;
   member: TMember;
};
export type createTMember = z.infer<typeof createMemberWithUploadSchema>;

const UpdateMemberModal = ({ member, state, onClose, onCancel }: Props) => {
   

   const { imageURL, imageFile, onSelectImage, resetPicker } = useImagePick({
      initialImageURL: !member.picture ? "/images/default.png" : member.picture,
      maxOptimizedSizeMB: 0.5,
      maxWidthOrHeight: 300,
   });

   const memberForm = useForm<createTMember>({
      resolver: zodResolver(createMemberWithUploadSchema),
   });

   const defaultValues = useCallback(() => {
      memberForm.setValue("passbookNumber", member.passbookNumber);
      memberForm.setValue("firstName", member.firstName);
      memberForm.setValue("middleName", member.middleName);
      memberForm.setValue("lastName", member.lastName);
      memberForm.setValue("gender", member.gender);
      memberForm.setValue("birthday", member.birthday);
      memberForm.setValue("picture",member.picture)
      memberForm.setValue("contact", member.contact);
      memberForm.setValue("emailAddress", member.emailAddress);
      memberForm.setValue("eventId", member.eventId);
   }, [memberForm,member]);

   useEffect(() => {
      defaultValues();
   }, [memberForm,member]);

   const reset = () => {
      memberForm.reset();
   };
   const onCancelandReset = () => {
      reset();
      onClose(false);
   };

   const isMemberOnchange = memberForm.watch().passbookNumber === member.passbookNumber && memberForm.watch().firstName === member.firstName && memberForm.watch().middleName === member.middleName && memberForm.watch().lastName === member.lastName && memberForm.watch().birthday === member.birthday && memberForm.watch().emailAddress === member.emailAddress && memberForm.watch().contact === member.contact && memberForm.watch().picture === member.picture && memberForm.watch().gender === member.gender
    
   const updateMemberMutation = updateMember({ onCancelandReset });

   const uploadImage = onUploadImage();



   const onSubmit = async (formValues: createTMember) => {
      console.log(member.picture)
      try {
         if (!imageFile) {
            updateMemberMutation.mutate({
               member: {
                  ...formValues,
                  picture: member.picture,
               },
               memberId: member.id,
               eventId:member.eventId
            });
         } else {
            const image = await uploadImage.mutateAsync({
               fileName: `${v4()}`,
               folderGroup: "member",
               file: formValues.picture,
            });

            updateMemberMutation.mutate({
               member: {
                  ...formValues,
                  picture: !image ? "/images/default.png" : image,
               },
               memberId: member.id,
               eventId:member.eventId
            });
         }
         resetPicker();
      } catch (error) {
         console.log(error);
      }
   };
   const isLoading = updateMemberMutation.isPending;
   const isUploading = uploadImage.isPending;
   const inputRef = useRef(null);

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
               title="update Member"
               description="You are about to update the member information."
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
                              <FormLabel className="flex justify-between"><h1>Birthday</h1> <span className="text-[12px] italic text-muted-foreground">yyyy/mm/dd</span></FormLabel>
                              <InputMask
                                 mask="9999/99/99"
                                 ref={inputRef}
                                 value={field.value as any}
                                 onChange={field.onChange}
                                 placeholder="input birthday"
                                 className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              />
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
                                       value={field.value as any}
                                        onChange={field.onChange}
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
                                             field.onChange(value !== "" ? value : null);
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
                                    defaultValue={field.value as any}
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
                        <Button disabled={isMemberOnchange} type="submit">
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

export default UpdateMemberModal;
