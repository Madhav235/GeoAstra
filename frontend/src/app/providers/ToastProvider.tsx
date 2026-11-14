import React from "react";
import { ToastContainer } from "@/components/feedback/Toast";

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
};

