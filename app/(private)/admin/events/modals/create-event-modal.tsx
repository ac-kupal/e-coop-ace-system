"use client";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
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

import { handleAxiosErrorMessage } from "@/utils";
import { createEventWithElectionSchema } from "@/validation-schema/event";
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
import { TCreateEventWithElection } from "@/types/event/TCreateEvent";
import { useState } from "react";
import { mutationErrorHandler } from "@/errors/mutation-error-handler";
type Props = {
   state: boolean;
   onClose: (state: boolean) => void;
   onCancel?: () => void;
};

const CreateEventModal = ({ state, onClose, onCancel }: Props) => {
   
   const queryClient = useQueryClient();
   const [isElection, setIsElection] = useState(false);
   
   const defaultValues = {
      title: "",
      description: "",
      location: "",
      category: EventType.event,
      date: undefined,
      electionName: "",
   };
   
   const EventSchema = createEventWithElectionSchema(isElection);

   const eventForm = useForm<TCreateEventWithElection>({
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

   const createEvent = useMutation<typeof EventSchema, string, unknown>({
      mutationKey: ["create-event"],
      mutationFn: async (data: any) => {
         try {
            const response = await axios.post("/api/v1/event", { data });
            return response.data;
         } catch (e) {
            mutationErrorHandler(e);
         }
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["event-list-query"] });
         onCancelandReset();
         toast.success("Event created successfully");
      },
   });

   const isLoading = createEvent.isPending;
   const onSubmitEvent = async (formValues: TCreateEventWithElection) => createEvent.mutate(formValues);

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
               title="Create Event"
               description="Creating Event, you will be able to create also a election or any type of event etc."
            />
            <Form {...eventForm}>
               <form
                  onSubmit={eventForm.handleSubmit(onSubmitEvent)}
                  className=" space-y-3"
               >
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
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                 />
                              </PopoverContent>
                           </Popover>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
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
                           onCancelandReset();
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

export default CreateEventModal;
