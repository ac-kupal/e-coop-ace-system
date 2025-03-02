import { PutObjectCommand } from "@aws-sdk/client-s3";

import { TFolderUploadGroups } from "@/types";
import s3Client, { getS3BaseURL } from "@/lib/aws-s3";

export const uploadFile = async (
    file: Buffer,
    fileName: string,
    folder: TFolderUploadGroups,
    type?: string
) => {
    const fileBuffer = file;

    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${folder}/${fileName}`,
        Body: fileBuffer,
        ContentType: type,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    return `${getS3BaseURL()}${params.Key}`;
};
