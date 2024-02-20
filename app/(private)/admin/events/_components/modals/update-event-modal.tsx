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

import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

import { mutationErrorHandler } from "@/errors/mutation-error-handler";
import {
   updateEventSchema,
} from "@/validation-schema/event";
import { z } from "zod";
import { useCallback, useEffect } from "react";
import { TEventWithElection } from "@/types";

type Props = {
   event: TEventWithElection;
   state: boolean;
   onClose: (state: boolean) => void;
};

type TUpdateEventSchema = z.infer<typeof updateEventSchema>;

const UpdateEventModal = ({ event, state, onClose }: Props) => {
   const queryClient = useQueryClient();

   const eventForm = useForm<TUpdateEventSchema>({
      resolver: zodResolver(updateEventSchema),
   });

   const defaultValues = useCallback(() => {
      eventForm.setValue("title", event.title);
      eventForm.setValue("description", event.description);
      eventForm.setValue("location", event.location);
      eventForm.setValue("date", event.date);
   }, [eventForm, event]);

   useEffect(() => {
      defaultValues();
   }, [eventForm, event, defaultValues]);


   const createUpdateEventMutation = useMutation<TUpdateEventSchema,string, unknown>({
      mutationKey: ["update-event"],
      mutationFn: async (data) => {
         try {
            const response = await axios.patch(`/api/v1/event/${event.id}`,data);
            return response.data;
         } catch (error) {
            mutationErrorHandler(error);
         }
      },
      onSuccess: () => {
        onClose(false)
        queryClient.invalidateQueries({ queryKey: ["event-list-query"] });
         toast.success("Event created successfully");
      },
   });

   const isLoading = createUpdateEventMutation.isPending;

   const onSubmit = async (formValues: TUpdateEventSchema) =>{
    createUpdateEventMutation.mutate(formValues);
   }

   return (
      <Dialog
         open={state}
         onOpenChange={(state) => {
            onClose(state);
         }}
      >
         <DialogContent className="border-none shadow-2 sm:rounded-2xl max-w-[600px] font-inter">
            <ModalHead
               title="Edit Event"
               description="Edit Event: You will be able to edit the basic information of this event, but not its category."
            />
            <Form {...eventForm}>
               <form onSubmit={eventForm.handleSubmit(onSubmit)} className=" space-y-3">
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
                  <Separator className="bg-muted/70" />
                  <div className="flex justify-end gap-x-2">
                     <Button
                        disabled={isLoading}
                        onClick={(e) => {
                           e.preventDefault();
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

export default UpdateEventModal;
