"use client"
import z from "zod";
import { v4 } from "uuid"
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
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
import  { createClient } from "@/lib/supabase";
import { handleAxiosErrorMessage } from "@/utils";
import { createBranchSchema } from "@/validation-schema/branch";
import useImagePick from "@/hooks/use-image-pick";
import useUploadBucket from "@/hooks/use-upload-bucket";


type Props = {
    state: boolean;
    onClose: (state: boolean) => void;
    onCancel?: () => void;
    onCreate?: (newBranch: branchType) => void;
};

type createBranchType = z.infer<typeof createBranchSchema>;

const CreateBranchModal = ({ state, onClose, onCancel, onCreate }: Props) => {
    const queryClient = useQueryClient();
    const { imageFile, imageURL, onSelectImage, resetPicker } = useImagePick({ maxOptimizedSizeMB : 0.5, fileType : "image/jpeg", maxWidthOrHeight : 300 });
    const { uploading, handleUpload } = useUploadBucket({ imageFile, bucket : "branch-logos" })

    const form = useForm<createBranchType>({
        resolver: zodResolver(createBranchSchema),
        defaultValues: {
            branchPicture: undefined,
            branchName: "",
            branchDescription: "",
            branchAddress: "",
        },
    });

    const reset = () => {
        form.reset();
        resetPicker();
        onClose(false);
    }

    const createBranch = useMutation<branchType, string, createBranchType>({
        mutationKey: ["create-branch"],
        mutationFn: async (data) => {
            try {
                data.branchPicture = await handleUpload()
                const response = await axios.post("/api/v1/branch", { data });

                queryClient.invalidateQueries({ queryKey: ["branch-list-query"] });
                if (onCreate !== undefined) onCreate(response.data);
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

    const isLoading = createBranch.isPending || uploading;

    console.log('rerender')

    return (
        <Dialog open={state} onOpenChange={(state)=> reset() }>
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
                        <FormItem className="flex flex-col items-center">
                            <UserAvatar
                                className="size-36 mb-2"
                                fallback="📷"
                                src={ imageURL }
                            />
                            <FormLabel>Branch Logo</FormLabel>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={onSelectImage}
                            />
                        </FormItem>
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

export default CreateBranchModal;
