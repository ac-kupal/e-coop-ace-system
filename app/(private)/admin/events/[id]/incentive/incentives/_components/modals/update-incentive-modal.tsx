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

import { TBranch, TIncentive } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import { updateIncentiveSchema } from "@/validation-schema/incentive";
import { useEffect } from "react";


type Props = {
    state: boolean;
    incentive : TIncentive;
    onClose: (state: boolean) => void;
    onCancel?: () => void;
    onCreate?: (newBranch: TBranch) => void;
};

type updateTIncentives = z.infer<typeof updateIncentiveSchema>;

const UpdateIncentiveModal = ({ state, onClose, incentive, onCreate }: Props) => {
    const queryClient = useQueryClient();

    const form = useForm<updateTIncentives>({
        resolver: zodResolver(updateIncentiveSchema),
        defaultValues: {
            itemName : incentive.itemName 
        },
    });

    useEffect(()=>{
        form.setValue("itemName", incentive.itemName)
    }, [incentive, form]);

    const reset = () => {
        form.reset();
        onClose(false);
    }

    const updateIncentive = useMutation<TIncentive, string, updateTIncentives>({
        mutationKey: ["update-incentive"],
        mutationFn: async (data) => {
            try {
                const response = await axios.patch(`/api/admin/v1/event/${incentive.eventId}/incentives/${incentive.id}`, { data });

                queryClient.invalidateQueries({ queryKey: ["incentive-withclaimcount-list"] });
                if (onCreate !== undefined) onCreate(response.data);
                reset();
                toast.success("Incentive updated successfully")
                return response.data;
            } catch (e) {
                const errorMessage =  handleAxiosErrorMessage(e);

                toast.error(errorMessage);
                throw errorMessage
            }
        },
    });

    const isLoading = updateIncentive.isPending;


    return (
        <Dialog open={state} onOpenChange={(state)=> reset() }>
            <DialogContent className="border-none shadow-2 sm:rounded-2xl font-inter">
                <ModalHead
                    title="Update Incentive"
                    description="Update incentive information"
                />
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((formValues) =>
                            updateIncentive.mutate(formValues)
                        )}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="itemName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Item Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Item name"
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

export default UpdateIncentiveModal;
