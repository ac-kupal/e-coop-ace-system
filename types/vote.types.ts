
type voters = {
   id:string,
   candidateId: 1,
   voterName:string,
   votes:number[],
}

type candidate = {
   candidateId:number,
   candidateName:string,
}

export type reportsTypes = {
     total: number[]
     voters:voters[]
     sum:number
     candidates:candidate[]
}