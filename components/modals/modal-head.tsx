import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Props = { title : string, description : string | ReactNode };

const ModalHead = ({ title, description }: Props) => {
    return (
        <>
            <DialogHeader>
                <DialogTitle className="font-medium">{ title }</DialogTitle>
            </DialogHeader>
            <DialogDescription className="my-2">
                { description }
            </DialogDescription>
            <Separator className="bg-muted/70" />
        </>
    );
};

export default ModalHead;
