import { v4 } from "uuid";
import { useState } from "react";

import { TBuckets } from "@/types";
import { createClient } from "@/lib/supabase";

type UploadBucketProps = {
    imageFile: File | null;
    bucket: TBuckets;
    upsert?: boolean;
};

const useUploadBucket = ({
    imageFile,
    bucket,
    upsert = false,
}: UploadBucketProps) => {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (fileName: string = v4()) => {
        if (!imageFile) return fileName.startsWith("/images") ? fileName : undefined
        setUploading(true);
        const fileExtension = imageFile.name.match(/\.([^.]+)$/)?.[1];

        const trimPath = fileName.startsWith("/images") ? `${fileName}.${fileExtension}` : fileName.replaceAll(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/`, "") 

        let uploadResult = await createClient()
            .storage.from(bucket)
            .upload( trimPath, imageFile, {
                cacheControl: "3600",
                upsert,
            });

        if (uploadResult.error) {
            setUploading(false)
            throw new Error("Could not upload image");
        }
        
        setUploading(false)
        return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${uploadResult.data.path}`;
    };

    return { uploading, handleUpload };
};

export default useUploadBucket;
