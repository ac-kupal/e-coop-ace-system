"use client";
import {  Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModalHead from "@/components/modals/modal-head";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import { z } from "zod";

import { createManyMember,  } from "@/hooks/api-hooks/member-api-hook";
import { read, utils } from "xlsx";
import { importCSVSchema } from "@/validation-schema/import-csv";
import { TMember } from "@/types";

type Props = {
   state: boolean;
   onOpenSkippedModal:(state:boolean)=> void;
   onClose: (state: boolean) => void;
   onCancel?: () => void;
   id:number
};

export type TImportSchema = z.infer<typeof importCSVSchema>;

const ImportFileModal = ({ state, onClose, onCancel,id, onOpenSkippedModal }: Props) => {
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
    const onOpenSkippedMember=()=>{
      onOpenSkippedModal(true)
    }

    const createManyMemberMutation = createManyMember({onCancelandReset,onOpenSkippedMember}) 
   const isLoading = createManyMemberMutation.isPending;

   const onSubmit = (e: any) => {
     e.preventDefault();
     createManyMemberMutation.mutate({member:Members,eventId:id})
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
