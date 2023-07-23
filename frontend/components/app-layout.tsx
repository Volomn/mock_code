import { ReactNode } from "react";
import DarkModeToggle from "./dark-mode-toggle";
import Link from "next/link";
import Mantine from "./mantine-provider";

export default function AppLayout({
  children,
  isAuthenticated = false,
}: {
  children: ReactNode;
  isAuthenticated?: boolean;
}) {
  return (
    <>
      <header className="px-5">
        <nav className="max-w-7xl mx-auto h-20 font-primary font-semibold flex items-center justify-between text-primary-01 dark:text-neutral-00">
          <Link href={isAuthenticated ? "/dashboard" : "/"}>
            <span className="mr-auto text-xl">Mock</span>
          </Link>
          <div className="flex items-center">
            <DarkModeToggle />
            {!isAuthenticated && (
              <>
                <Link href="/login">
                  <button className="px-8 py-5 rounded-lg bg-transparent">
                    Login
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="px-8 py-5 rounded-lg bg-primary-01 dark:bg-neutral-00 text-white dark:text-primary-01">
                    Signup
                  </button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <Mantine>{children}</Mantine>
      <footer className="px-5 mt-auto pt-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center border-t dark:border-gray-600 text-[#181818] dark:text-slate-300 py-6 font-secondary text-sm">
          <span>© 2023 Volomn - All rights reserved</span>

          <div className="flex gap-2 sm:gap-10">
            <Link href="">Privacy policy</Link>
            <Link href="">Terms and conditions</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
