"use client";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ModalHead from "@/components/modals/modal-head";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";

import { mutationErrorHandler } from "@/errors/mutation-error-handler";
import { useRouter } from "next/navigation";
import { TCreatePosition } from "@/types";
import { createPositionSchema } from "@/validation-schema/position";
import { z } from "zod";
import { DialogTitle } from "@radix-ui/react-dialog";

type Props = {
   electionId: number | undefined;
   state: boolean;
   onClose: (state: boolean) => void;
   onCancel?: () => void;
};

type createTPosition = z.infer<typeof createPositionSchema>;

const CreatePostionModal = ({
   state,
   onClose,
   onCancel,
   electionId,
}: Props) => {
   const router = useRouter();

   const queryClient = useQueryClient();

   const defaultValues = {
      positionName: "",
      numberOfSelection: 0,
      electionId: electionId,
   };

   const positionForm = useForm<createTPosition>({
      resolver: zodResolver(createPositionSchema),
      defaultValues: defaultValues,
   });

   const reset = () => {
      positionForm.reset(defaultValues);
   };
   const onCancelandReset = () => {
      reset();
      onClose(false);
   };
   const createPosition = useMutation<TCreatePosition, string, unknown>({
      mutationKey: ["create-position-key"],
      mutationFn: async (data) => {
         try {
            const response = await axios.post("/api/v1/position", data);
            return response.data;
         } catch (e) {
            mutationErrorHandler(e);
         }
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["position-list-query"] });
         onCancelandReset();
         toast.success("Event created successfully");
      },
   });

   const isLoading = createPosition.isPending;

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
               title="Create Position"
               description="You are about to create a position. you must need to provide atleast 1 number of seats!"
            />
            <Form {...positionForm}>
               <form
                  onSubmit={positionForm.handleSubmit((formValues) => {
                     createPosition.mutate(formValues);
                  })}
                  className=" space-y-3"
               >
                  <FormField
                     control={positionForm.control}
                     name="positionName"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Position Name</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="enter position name"
                                 className="placeholder:text-foreground/40"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={positionForm.control}
                     name="numberOfSelection"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>number of Seats</FormLabel>
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

export default CreatePostionModal;
