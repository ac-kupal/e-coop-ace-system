import { currentUserOrThrowAuthError } from "@/lib/auth";
import Election from "./_components/election";


type Props = {
  params: { id: number; electionId: number };
};

const page =async ({params}:Props) => {
 
   const user =await currentUserOrThrowAuthError()

  return (
    <Election params={params} user={user} ></Election>
  )
}

export default page