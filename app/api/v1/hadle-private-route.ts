import { currentUserOrThrowAuthError } from "@/lib/auth";

export const handlePrivateRoute = async () => {
     if (process.env.PRIVATE_API === "true") {
        await currentUserOrThrowAuthError();
     }
  };
  