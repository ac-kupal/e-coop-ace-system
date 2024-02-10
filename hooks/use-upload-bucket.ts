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
        if (!imageFile) return;
        setUploading(true);
        const fileExtension = imageFile.name.match(/\.([^.]+)$/)?.[1];

        let uploadResult = await createClient()
            .storage.from(bucket)
            .upload(`${fileName}.${fileExtension}`, imageFile, {
                cacheControl: "3600",
                upsert,
            });

        if (uploadResult.error) throw new Error("Could not upload image");
        
        setUploading(false)
        return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${uploadResult.data.path}`;
    };

    return { uploading, handleUpload };
};

export default useUploadBucket;
