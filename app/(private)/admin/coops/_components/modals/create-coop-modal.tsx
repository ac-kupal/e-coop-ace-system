"use client";
import z from "zod";
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

import { TBranch } from "@/types";
import { createBranchSchema } from "@/validation-schema/branch";
import { createBranch } from "@/hooks/api-hooks/branch-api-hooks";
import { useCoopList, useCreateCoop } from "@/hooks/api-hooks/coop-api-hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCoopSchema } from "@/validation-schema/coop";
import useImagePick from "@/hooks/use-image-pick";

type Props = {
  state: boolean;
  onClose: (state: boolean) => void;
};

type TCreateCoop = z.infer<typeof createCoopSchema>;

const CreateCoopModal = ({ state, onClose }: Props) => {
  const { imageURL, imageFile, onSelectImage, resetPicker } = useImagePick({
    initialImageURL: "/images/default.png",
    maxOptimizedSizeMB: 0.5,
    maxWidthOrHeight: 300,
  });

  const form = useForm<TCreateCoop>({
    resolver: zodResolver(createCoopSchema),
    defaultValues: {
      coopName: "",
      coopDescription: "",
    },
  });

  const reset = () => {
    form.reset();
    resetPicker();
    onClose(false);
  };

  const { createCoop, isCreating } = useCreateCoop(()=> reset());

  const isLoading = isCreating;

  return (
    <Dialog open={state} onOpenChange={(state) => reset()}>
      <DialogContent className="border-none shadow-2 sm:rounded-2xl font-inter">
        <ModalHead
          title="Create Branch"
          description="By creating a branch, you will be able to reference other records to the branch."
        />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((formValues) => {})}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="coopName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coop Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="coop name"
                      className="placeholder:text-foreground/40"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coopDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coop Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="short description of the coop"
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
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                {isLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" strokeWidth={1} />
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

export default CreateCoopModal;
