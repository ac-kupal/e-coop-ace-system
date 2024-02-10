import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import ModalHead from "@/components/modals/modal-head";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

import { branchType } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import { createBranchSchema } from "@/validation-schema/branch";

type Props = {
    state: boolean;
    onClose: (state: boolean) => void;
    onCancel? : () => void;
    onCreate? : (newBranch: branchType) => void;
};

const CreateBranchModal = ({ state, onClose, onCancel, onCreate }: Props) => {

    const createBranch = useMutation<branchType, string>({
        mutationKey: ["create-branch"],
        mutationFn: async (data) => {
            try {
                const response = await axios.post("/api/v1/branch", { data });
                if(onCreate !== undefined) onCreate(response.data)
                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw handleAxiosErrorMessage(e);
            }
        },
    });

    const handleOnCancel = () => {
        if(onCancel) onCancel();
        onClose(false);
    }

    const form = useForm<z.infer<typeof createBranchSchema>>({
        defaultValues : {
            branchPicture : "",
            branchName : "",
            branchDescription : "",
            branchAddress : "",
        }
    })

    const isLoading = createBranch.isPending

    return (
        <Dialog open={state} onOpenChange={onClose}>
            <DialogContent className="border-none shadow-2 sm:rounded-2xl font-inter">
                <ModalHead title="Create Branch" description="By creating a branch, you will be able to reference other records to the branch." />
                
                <div className="flex justify-end gap-x-2">
                    <Button disabled={isLoading} onClick={handleOnCancel} variant={"ghost"} className="bg-muted/60 hover:bg-muted">
                        Cancel
                    </Button>
                    <Button disabled={isLoading} onClick={()=> createBranch.mutate()}>{
                        isLoading ? <Loader2 className="h-3 w-3 animate-spin" strokeWidth={1}/> : "Save"
                    }</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateBranchModal;
