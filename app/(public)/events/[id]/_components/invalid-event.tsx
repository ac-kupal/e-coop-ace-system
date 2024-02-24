"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const InvalidEvent = ({
  message = "Sorry, but this is invalid",
}: {
  message?: string;
}) => {
  const router = useRouter();
  return (
    <div className="h-dvh w-dvw flex-col gap-y-4 flex items-center justify-center">
      <p>{message}</p>
      <Button onClick={() => router.back()} variant="secondary">
        Go Back
      </Button>
    </div>
  );
};

export default InvalidEvent;
