import { Input } from "@/components/ui/input";
import React, { useEffect, useRef } from "react";

interface Props {
  globalFilter:string,
  setGlobalFilter:React.Dispatch<React.SetStateAction<string>>;
}

const SearchInput = ({globalFilter,setGlobalFilter}: Props) => {
     const onFocusSearch = useRef<HTMLInputElement | null>(null);
     useEffect(() => {
        const shortCutCommand = (event: KeyboardEvent) => {
           if (
              (event.ctrlKey && event.key === "k") ||
              (event.altKey && event.key === "k") ||
              (event.metaKey && event.key === "k")
           ) {
              event.preventDefault();
              onFocusSearch.current?.focus();
           }
        };
        window.addEventListener("keydown", shortCutCommand);
        return () => {
           window.removeEventListener("keydown", shortCutCommand);
        };
     }, []);

   return (
      <Input
         ref={onFocusSearch}
         placeholder="Search..."
         value={globalFilter}
         onChange={(event) => setGlobalFilter(event.target.value)}
         className="w-full pl-8 border-0 border-b bg-transparent   text-sm md:text-base ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
   );
};

export default SearchInput;
