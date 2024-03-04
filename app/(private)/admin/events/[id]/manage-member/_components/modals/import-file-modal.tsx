"use client";
import axios from "axios";
import { toast } from "sonner";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarIcon, Loader2, Rows } from "lucide-react";
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
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { EventType, gender } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import useImagePick from "@/hooks/use-image-pick";
import { onUploadImage } from "@/hooks/api-hooks/image-upload-api-hook";
import ImagePick from "@/components/image-pick";
import { v4 as uuid, v4 } from "uuid";
import { createMemberWithUploadSchema, memberEmailSchema } from "@/validation-schema/member";
import { createManyMember, createMember } from "@/hooks/api-hooks/member-api-hook";
import { read, utils, writeFile } from "xlsx";
import { importCSVSchema } from "@/validation-schema/import-csv";
import { TMember } from "@/types";

type Props = {
   state: boolean;
   onClose: (state: boolean) => void;
   onCancel?: () => void;
   id:number
};

export type TImportSchema = z.infer<typeof importCSVSchema>;

const ImportFileModal = ({ state, onClose, onCancel,id }: Props) => {
   const [Members, setMembers] = useState<TMember[] | any>([]);

   const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files?.length) {
         const file = files[0];
         const reader = new FileReader();
         reader.onload = (event) => {
            const wb = read(event.target?.result);
            const sheets = wb.SheetNames;
            if (sheets.length) {
               const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
               setMembers(rows);
            }
         };
         reader.readAsArrayBuffer(file);
      }
   };
    const onCancelandReset =()=>{
     onClose(false)
     setMembers([])
    }
    const createManyMemberMutation = createManyMember({onCancelandReset}) 
   const isLoading = createManyMemberMutation.isPending;

   const onSubmit = (e: any) => {
      console.log(Members)
     createManyMemberMutation.mutate({member:Members,eventId:id})
      e.preventDefault();
   };

   return (
      <Dialog
         open={state}
         onOpenChange={(state) => {
            onClose(state);
            onCancelandReset()
         }}
      >
         <DialogContent className="border-none shadow-2 sm:rounded-2xl font-inter">
            <ModalHead
               title="Import Member"
               description="When importing members, ensure that any duplicate passbook entries are skipped. Please ensure to clean your file before saving."
            />
            <form onSubmit={onSubmit}>
               <Input
                  type="file"
                  name="file"
                  onChange={handleImport}
                  accept=".xlsx, .xls, .csv, .xlm"
               />
               <div className="flex justify-end gap-x-2">
                  <Button
                     onClick={(e) => {
                        e.preventDefault();
                        onCancelandReset()
                     }}
                     variant={"secondary"}
                     className="bg-muted/60 hover:bg-muted"
                  >
                     cancel
                  </Button>
                  <Button disabled={Members.length === 0 ? true:false} type="submit">
                     {isLoading ? (
                        <Loader2
                           className="h-3 w-3 animate-spin"
                           strokeWidth={1}
                        />
                     ) : (
                        "Import"
                     )}
                  </Button>
               </div>
            </form>
         </DialogContent>
      </Dialog>
   );
};

export default ImportFileModal;
