import z from "zod"
import axios from "axios";
import { v4 } from "uuid";
import { useMutation } from "@tanstack/react-query"

import { uploadSchema } from "@/validation-schema/upload";
import { toast } from "sonner";

export const uploadImage = ({ onUploadComplete } : { onUploadComplete : (imageURL : string) => void }) => { 
    const upload = useMutation<string, string, z.infer<typeof uploadSchema>>({
        mutationFn : async (data) => {
            try{
                const upload = await axios.postForm("/api/v1/upload/image", {
                    file : data.file,
                    fileName : data.fileName,
                    folderGroup : data.folderGroup
                })
                
                onUploadComplete(upload.data)

                return upload.data;
            }catch(e){
                toast.error(`Failed to upload image : ${e}`)
            }
        }
    })

    return upload;
}