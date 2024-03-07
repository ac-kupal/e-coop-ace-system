"use client";
import {  useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

import { createEventWithElectionWithUploadSchema } from "@/validation-schema/event";
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
import { EventType } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import useImagePick from "@/hooks/use-image-pick";
import { useCreateEvent } from "@/hooks/api-hooks/event-api-hooks";
import { onUploadImage } from "@/hooks/api-hooks/image-upload-api-hook";
import ImagePick from "@/components/image-pick";
import { v4 as uuid, v4 } from "uuid";
import { TEvent } from "@/types";
type Props = {
   state: boolean;
   onClose: (state: boolean) => void;
   onCancel?: () => void;
};
export type EventSchemaType = z.infer<
   ReturnType<typeof createEventWithElectionWithUploadSchema>
>;

const CreateEventModal = ({ state, onClose, onCancel}: Props) => {

   const [isElection, setIsElection] = useState(false);

   // Create the schema
   const EventSchema = createEventWithElectionWithUploadSchema(isElection);

   const { imageURL, imageFile, onSelectImage, resetPicker } = useImagePick({
      initialImageURL: "/images/default.png",
      maxOptimizedSizeMB: 1,
      maxWidthOrHeight: 800,
   });

   const defaultValues = {
      title: "",
      description: "",
      location: "",
      category: EventType.event,
      date: undefined,
      electionName: "",
      coverImage: imageFile,
   };

   const eventForm = useForm<EventSchemaType>({
      resolver: zodResolver(EventSchema),
      defaultValues: defaultValues,
   });

   const reset = () => {
      eventForm.reset(defaultValues);
   };
   const onCancelandReset = () => {
      reset();
      onClose(false);
   };

   const createEvent = useCreateEvent({ onCancelandReset });

   const uploadImage = onUploadImage();

   const onSubmit = async (formValues: EventSchemaType) => {
      try {
            const image = await uploadImage.mutateAsync({
               fileName: `${v4()}`,
               folderGroup: "event",
               file: formValues.coverImage,
            });
            createEvent.mutate({
               ...formValues,
               coverImage: !image ? "/images/default.png" : image,
            });
         resetPicker();

      } catch (error) {
         console.log(error);
      }
   };

   const isLoading = createEvent.isPending;
   const isUploading = uploadImage.isPending;

   return (
      <Dialog
         open={state}
         onOpenChange={(state) => {
            onClose(state);
            reset();
         }}
      >
         <DialogContent
            className={cn(
               "border-none overflow-auto overflow-y-auto max-h-[700px] shadow-2 sm:rounded-2xl  max-w-[1200px] font-inter"
            )}
         >
            <ModalHead
               title="Create Event"
               description="Creating an event will also generate an election. The election may be optional as well."
            />
            <Form {...eventForm}>
               <form
                  onSubmit={eventForm.handleSubmit(onSubmit)}
                  className="flex flex-col space-y-3 w-full overflow-auto overflow-y-auto"
               >
                  <div className="flex flex-col px-2 lg:flex-row lg:space-x-5">
                  <div className="w-full  space-y-2 lg:space-y-5 ">
                     <FormField
                        control={eventForm.control}
                        name="title"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Event Name</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="event name"
                                    className="placeholder:text-foreground/40"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={eventForm.control}
                        name="description"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Event Description</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="short description of the event"
                                    className="placeholder:text-foreground/40"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={eventForm.control}
                        name="location"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Event Address</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="address of the Event"
                                    className="placeholder:text-foreground/40"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={eventForm.control}
                        name="date"
                        render={({ field }) => (
                           <FormItem className="flex flex-col">
                              <FormLabel>Date of Event</FormLabel>
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
                                       disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
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
                  </div>
                  <div className="w-full space-y-2 lg:space-y-5 ">
                     <FormField
                        control={eventForm.control}
                        name="category"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>category </FormLabel>
                              <Select
                                 onValueChange={(newValue: EventType) => {
                                    field.onChange(newValue);
                                    if (newValue === EventType.election) {
                                       setIsElection(true);
                                    } else {
                                       setIsElection(false);
                                       eventForm.setValue(
                                          "electionName",
                                          undefined
                                       );
                                    }
                                 }}
                                 defaultValue={field.value}
                              >
                                 <FormControl>
                                    <SelectTrigger>
                                       <SelectValue placeholder="Select a catergory" />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    <SelectItem value={EventType.election}>
                                       {EventType.election}
                                    </SelectItem>
                                    <SelectItem value={EventType.event}>
                                       {EventType.event}
                                    </SelectItem>
                                 </SelectContent>
                              </Select>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={eventForm.control}
                        name="electionName"
                        render={({ field }) => (
                           <FormItem className="">
                              <FormLabel>Election Name</FormLabel>
                              <FormControl>
                                 <Input
                                    disabled={!isElection}
                                    placeholder="Election name"
                                    className="placeholder:text-foreground/40"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={eventForm.control}
                        name="coverImage"
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

export default CreateEventModal;
