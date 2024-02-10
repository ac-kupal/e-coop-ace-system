import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

import { branchType } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import { createBranchSchema } from "@/validation-schema/branch";

type Props = {
    state: boolean;
    onClose: (state: boolean) => void;
    onCancel?: () => void;
    onCreate?: (newBranch: branchType) => void;
};

type createBranchType = z.infer<typeof createBranchSchema>;

const CreateBranchModal = ({ state, onClose, onCancel, onCreate }: Props) => {
    const queryClient = useQueryClient()
    const createBranch = useMutation<branchType, string, createBranchType>({
        mutationKey: ["create-branch"],
        mutationFn: async (data) => {
            try {
                const response = await axios.post("/api/v1/branch", { data });
                queryClient.invalidateQueries({ queryKey : ["branch-list-query"]})
                onClose(false)
                if (onCreate !== undefined) onCreate(response.data);
                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw handleAxiosErrorMessage(e);
            }
        },
    });

    const form = useForm<createBranchType>({
        resolver : zodResolver(createBranchSchema),
        defaultValues: {
            branchPicture: undefined,
            branchName: "",
            branchDescription: "",
            branchAddress: "",
        },
    });

    const isLoading = createBranch.isPending;

    return (
        <Dialog open={state} onOpenChange={onClose}>
            <DialogContent className="border-none shadow-2 sm:rounded-2xl font-inter">
                <ModalHead
                    title="Create Branch"
                    description="By creating a branch, you will be able to reference other records to the branch."
                />
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((formValues) =>
                            createBranch.mutate(formValues)
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
                                onClick={(e)=>{
                                    if (onCancel) onCancel();
                                    form.reset();
                                    onClose(false);
                                    e.preventDefault()
                                }}
                                variant={"ghost"}
                                className="bg-muted/60 hover:bg-muted"
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={isLoading}
                                type="submit"
                            >
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

export default CreateBranchModal;
