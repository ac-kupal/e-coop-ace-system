"use client"
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

import { useEffect } from "react";
import { TBranch } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import { createBranchSchema } from "@/validation-schema/branch";

type Props = { 
    branch : TBranch,
    state : boolean,
    close : () => void;
};

type TUpdateBranch = z.infer<typeof createBranchSchema>;

const UpdateBranchModal = ({ state, branch, close }: Props) => {
    const queryClient = useQueryClient();

    const form = useForm<TUpdateBranch>({ resolver: zodResolver(createBranchSchema) });

    const setDefaults = () => {
        form.setValue("branchName", branch.branchName)
        form.setValue("branchAddress", branch.branchAddress)
        form.setValue("branchDescription", branch.branchDescription)
        form.setValue("branchPicture", branch.branchPicture ?? "/images/default.png")
    }

    const reset = () => {
        form.reset();
        close();
    }

    useEffect(()=>{
        setDefaults()
    }, [branch, state])

    const updateBranch = useMutation<TBranch, string, TUpdateBranch>({
        mutationKey: ["update-branch"],
        mutationFn: async (data) => {
            try {
                const response = await axios.patch(`/api/v1/branch/${branch.id}`, { data });

                queryClient.invalidateQueries({ queryKey: ["branch-list-query"] });
                reset();
                
                return response.data;
            } catch (e) {
                let errorMessage = "";
                
                if (e instanceof Error) errorMessage = e.message;
                else errorMessage =  handleAxiosErrorMessage(e);

                toast.error(errorMessage);
                throw errorMessage
            }
        },
    });

    const isLoading = updateBranch.isPending // || uploading;

    return (
        <Dialog open={state} onOpenChange={reset}>
            <DialogContent className="border-none shadow-2 sm:rounded-2xl font-inter">
                <ModalHead
                    title="Update Branch"
                    description="Modify branch information"
                />
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((formValues) =>
                            updateBranch.mutate(formValues)
                        )}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="branchName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Branch Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="branch name"
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
                            name="branchDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Branch Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="short description of the branch"
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
                            name="branchAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Branch Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="address of the branch"
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

export default UpdateBranchModal;
