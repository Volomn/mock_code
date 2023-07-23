"use client";

import { usePreferredColorMode } from "@/hooks/color-mode";
import { FC, ReactNode, useEffect, useState } from "react";
interface Props {
  children: ReactNode;
}

const Theme: FC<Props> = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  usePreferredColorMode();
  useEffect(function () {
    setIsInitializing(false);
  }, []);

  if (isInitializing)
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <h3 className="text-3xl">Loading MockCode...</h3>
      </div>
    );
  return <>{children}</>;
};

export default Theme;
