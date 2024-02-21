"use client";
import React, { ReactNode } from "react";
import ElectionSideBar from "./_components/election-sidebar";

interface Props {
   children?: ReactNode;
}

const layout = ({ children }: Props) => {
   return (
      <div className="flex p-5 shadow-md rounded-xl">
         <ElectionSideBar />
         <div className="border w-full bg-background ">{children}</div>
      </div>
   );
};

export default layout;
