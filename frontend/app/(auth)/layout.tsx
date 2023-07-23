import Image from "next/image";
import { ReactNode } from "react";
import SideShape from "@/public/shape.svg";
import DarkModeToggle from "@/components/dark-mode-toggle";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <section className="relative min-h-screen flex flex-col">
      <header className="text-primary-01 dark:text-neutral-00">
        <nav className="max-w-7xl mx-auto h-16 flex justify-end items-center">
          <DarkModeToggle />
        </nav>
      </header>
      {children}
      <div className="absolute bottom-0 left-0">
        <Image src={SideShape} alt="vector" />
      </div>
    </section>
  );
}
