"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { handleAxiosErrorMessage } from "@/utils";
import { testdts } from "@/validation-schema/testzd";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import ReactInputMask from "react-input-mask";
import { toast } from "sonner";

type Props = {};

const TestPage = (props: Props) => {
    const [val, setVal] = useState("");

    const { mutate } = useMutation<any, string>({
        mutationFn: async () => {
            try {
                console.log("BEFORE SEND ", val);
                const payload = testdts.parse({ bday : val });
                console.log("AFTER VALIDATE", payload);
                const request = await axios.post("/api/testz/", payload);
                console.log("RESPONSE FROM SERVER", request.data);
                return request.data;
            } catch (e) {
                console.log(e)
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    });

    return (
        <div>
            <ReactInputMask
                value={val}
                onChange={(e)=>setVal(e.target.value)}
                mask="99/99/9999"
                placeholder="input birthday"
                className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    "text-xl text-center font-medium placeholder:font-normal placeholder:text-base placeholder:text-foreground/70"
                )}
            />
            <Button onClick={() => mutate()}>Send Date {val}</Button>
        </div>
    );
};

export default TestPage;
