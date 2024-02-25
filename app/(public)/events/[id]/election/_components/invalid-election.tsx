import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const InvalidElection = ({message = "invalid election"} : { message? : string }) => {
    const router = useRouter();
    return (
        <div className="h-dvh w-dvw flex flex-col items-center justify-center">
            <p className="text-sm text-foreground/70">{message}</p>
            <Button onClick={()=> router.back()}>Go Back</Button>
        </div>
    );
};

export default InvalidElection; 
