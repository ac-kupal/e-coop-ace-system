import { cn } from "@/lib/utils";
import { Check, Copy, Send } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = { url : string, duration? : number };

const CopyURL = ( { url, duration = 3 }: Props) => {
    const [coppied, setCoppied] = useState(false);

    const handleCopy = () => {
        if(coppied) return;
        try{
            navigator.clipboard.writeText(url)
            toast.success("Event link coppied")
            setCoppied(true)
            setTimeout(()=> setCoppied(false), duration * 1000 )
        }catch(e){
            toast.error("Sorry, Couldn't copy link")
        }
    }

    return (
        <div onClick={handleCopy} className={cn("flex gap-x-4 px-3 group duration-200 cursor-pointer text-foreground/70 hover:text-foreground py-2 bg-secondary rounded-xl text-sm", coppied && "bg-green-300/20")}>
            <p>{url}</p>
            {
                coppied ? <Check className="size-4 text-green-700" strokeWidth={1} /> : <Copy className="h-4 w-4" strokeWidth={1} />
            }
        </div>
    );
};

export default CopyURL;
