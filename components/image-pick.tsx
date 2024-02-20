import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import imageCompression from "browser-image-compression";
import UserAvatar from "./user-avatar";

type Props = {
    className? : string
};

const ImagePick = ({ className }: Props) => {
    const [file, setFile] = useState<File | null>();

    const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const imageFile = e.target.files[0];

        const options = {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 200,
            FileType : "image/jpeg",
            useWebWorker: true,
        };
        try {
            const compressedFile = await imageCompression(imageFile, options);
            setFile(compressedFile);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={className}>
            <UserAvatar
                className="size-36"
                fallback="📷"
                src={file ? URL.createObjectURL(file) : "/images/default.png"}
            />
            <Input type="file" accept="image/*" onChange={handleOnChange} />
        </div>
    );
};

export default ImagePick;
