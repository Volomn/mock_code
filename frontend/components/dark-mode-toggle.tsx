"use client";

import { useSwitchMode } from "@/hooks/color-mode";
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [mode, toggle] = useSwitchMode();
  const [lightMode, setLightMode] = useState(mode === "light");

  return (
    <div className="flex gap-4 items-center" tabIndex={1}>
      <span>Theme</span>
      <div
        className="rounded-full bg-[#78788029] dark:bg-[#3615BD] flex justify-between items-center py-[2px] cursor-pointer"
        onClick={() => {
          setLightMode((mode) => !mode);
          toggle();
        }}
      >
        <span className="inline-block h-7 w-7 border rounded-full shadow bg-white dark:order-1"></span>
        <div className="px-2">
          {lightMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={17}
              height={16}
              fill="none"
            >
              <path
                stroke="#181818"
                strokeLinejoin="round"
                d="M16 10.62A7.78 7.78 0 0 1 5.88.5a7.782 7.782 0 0 0 2.9 15A7.781 7.781 0 0 0 16 10.62Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              fill="none"
            >
              <path
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.636 3.636 5.05 5.05m9.9 9.9 1.414 1.414M1 10h2m14 0h2M3.635 16.363 5.05 14.95m9.899-9.9 1.414-1.415M10 19v-2m0-14V1m0 13c2.219 0 4-1.763 4-3.982A4.003 4.003 0 0 0 10 6c-2.219 0-4 1.781-4 4 0 2.219 1.781 4 4 4Z"
                opacity={0.3}
              />
              <path
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 1v2m6.5.5L15 5M10 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM3.5 3.5 5 5m5 14v-2m6.5-.5L15 15M3.5 16.5 5 15m-4-5h2m14 0h2"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
