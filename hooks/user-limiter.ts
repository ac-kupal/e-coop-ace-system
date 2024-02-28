import { useEffect, useState } from "react";

const useLimiter = <T>(data : T, delay : number) => {
    const [limiterVal, setLimiterVal] = useState<T>(data)

    console.log("update val", data);

    useEffect(()=>{
        const limiterTimer = setTimeout(()=>{
            setLimiterVal(data) 
        },delay)

        return ()=> clearTimeout(limiterTimer);
    }, [data])

    return limiterVal;
}

export default useLimiter;
