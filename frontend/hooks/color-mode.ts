"use client";

import { useEffect, useLayoutEffect } from "react";
import { setCookie, removeCookie, getCookie } from "typescript-cookie";

export function usePreferredColorMode() {
  useLayoutEffect(function () {
    if (
      getCookie("volomn_theme") === "dark" ||
      (!getCookie("volomn_theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
}

export function useSwitchMode(): [string, () => void] {
  function getMode() {
    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
  }
  function toggle() {
    document.documentElement.classList.toggle("dark");
    const mode = getMode();
    if (mode === "dark") {
      removeCookie("volomn_theme");
    } else {
      setCookie("volomn_theme", mode);
    }
  }

  return [getMode(), toggle];
}
