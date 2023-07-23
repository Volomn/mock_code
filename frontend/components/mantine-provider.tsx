"use client";
import { MantineProvider } from "@mantine/core";
import { ReactNode } from "react";

export default function Mantine({ children }: { children: ReactNode }) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        /** Put your mantine theme override here */
        colorScheme: "light",
      }}
    >
      {children}
    </MantineProvider>
  );
}
