"use client";
import { useEffect, useState } from "react";
import ConfirmModal from "@/components/modals/confirm-modal";


const ConfirmModalProvider = () => {
  const [isMount, setIsMount] = useState(false);
  
  useEffect(() => {
    setIsMount(true);
  }, []);

  if (!isMount) { return null; }

  return (<ConfirmModal />);
};

export default ConfirmModalProvider;
