import z from "zod";
import db from "@/lib/database";


export const getElection = async (id: number) => {
     try {
        const electionId = Number(id)
        const election = await db.election.findUnique({
           where: { id:electionId},
        });
        return election
     } catch (error) {
        console.log(error);
     }
  };
  