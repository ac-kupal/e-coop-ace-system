"use client";
import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";

import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { loginSchema } from "@/validation-schema/auth";
import { useRouter } from "next/navigation";

type Props = {
    callbackUrl? : string
}

const LoginForm = ({ callbackUrl } : Props) => {
    const router = useRouter();
    const [viewPassword, setViewPassword] = useState(false);
    const [error, setError] = useState('')

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof loginSchema>) => {
        setError('')

        const result = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false
        });

        if(result?.error){
            setError(result.error)
        }

        router.push(callbackUrl ?? "/admin")
    };

    const isLoading = form.formState.isSubmitting;

    return (
        <div className="p-16 font-nunitosans rounded-2xl">
            <div>
                <div className="px-2">
                    <div>
                        <div>
                            <p className="text-4xl font-medium text-center">
                                ACE System
                            </p>
                        </div>
                        <div>
                            <p className="py-8 text-base text-center text-secondary-foreground">
                                Sign in to the app
                            </p>
                        </div>
                    </div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="w-full py-3 space-y-5"
                        >
                            <div className="space-y-5">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-bold uppercase text-zinc-500">
                                                email
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isLoading}
                                                    placeholder="email"
                                                    {...field}
                                                ></Input>
                                            </FormControl>
                                            <FormMessage></FormMessage>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-bold uppercase text-zinc-500">
                                                Password
                                            </FormLabel>
                                            <FormControl className="">
                                                <div className="relative">
                                                    {viewPassword ? (
                                                        <EyeIcon
                                                            onClick={() =>
                                                                setViewPassword(
                                                                    !viewPassword
                                                                )
                                                            }
                                                            className="absolute w-4 h-auto hover:scale-105 right-3 top-3"
                                                        ></EyeIcon>
                                                    ) : (
                                                        <EyeOffIcon
                                                            onClick={() =>
                                                                setViewPassword(
                                                                    !viewPassword
                                                                )
                                                            }
                                                            className="absolute w-4 h-auto hover:scale-105 right-3 top-3"
                                                        ></EyeOffIcon>
                                                    )}
                                                    <Input
                                                        disabled={isLoading}
                                                        type={
                                                            viewPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        className="bg-transparent "
                                                        placeholder="password"
                                                        {...field}
                                                    ></Input>
                                                </div>
                                            </FormControl>
                                            <FormMessage className="my-2 text-center text-rose-400"></FormMessage>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <p className="text-sm text-center">{ error }</p>
                            <Button
                                disabled={isLoading}
                                className="w-full space-x-2"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin"></Loader2>
                                ) : (
                                    <p> Sign in</p>
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;