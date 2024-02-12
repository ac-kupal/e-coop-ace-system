"use client"
import z from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ModalHead from "@/components/modals/modal-head";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { TUser } from "@/types";
import { updateUserSchema } from "@/validation-schema/user";
import { branchList } from "@/hooks/api-hooks/branch-api-hooks";
import { updateUser } from "@/hooks/api-hooks/user-api-hooks";


type Props = {
    user : TUser;
    state : boolean,
    close : () => void;
};

type updateTUser = z.infer<typeof updateUserSchema>;

const UpdateUserModal = ({ state, user, close }: Props) => {
    const form = useForm<updateTUser>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            email : "",
            name : "",
            password : undefined,
            branchId : -1
        },
    });

    const { data : branches, isLoading : branchLoading } = branchList();

    const setDefaults = () => {
        form.setValue("email", user.email)
        form.setValue("name", user.name)
        form.setValue("password", undefined)
        form.setValue("branchId", user.branchId)
    }

    const reset = () => {
        form.reset();
        close();
    }

    useEffect(()=>{
        setDefaults()
    }, [user, state])

    const update = updateUser(user.id, (updatedUser) => { reset() })

    const isLoading = update.isPending || branchLoading;

    return (
        <Dialog open={state} onOpenChange={(state)=> reset() }>
            <DialogContent className="border-none shadow-2 sm:rounded-2xl font-inter">
                <ModalHead
                    title="Update User"
                    description="Update user basic information."
                />
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((formValues) =>
                            update.mutate(formValues)
                        )}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Name of user"
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="johndoe@gmail.com"
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
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="8 character password"
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
                        name="branchId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Branch</FormLabel>
                                    <Select disabled={branchLoading} onValueChange={field.onChange} defaultValue={field.value.toString()}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a branch" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                branches.map((branch)=> 
                                                    <SelectItem key={branch.id} value={branch.id.toString()}>{branch.branchName}</SelectItem>
                                                )
                                            }
                                        </SelectContent>
                                    </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Separator className="bg-muted/70" />
                        <span className="text-sm text-destructive">{branches.length === 0 ? "theres no branches available" : ""}</span>
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

export default UpdateUserModal;
