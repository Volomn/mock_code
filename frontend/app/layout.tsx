import "./globals.css";
import { Montserrat, Sora } from "next/font/google";
import Theme from "@/components/theme";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

export const metadata = {
  title: "Mock Code",
  description: "Mock Code",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${sora.variable} font-primary dark:bg-[#14171F] min-h-screen flex flex-col`}
      >
        <Theme>{children}</Theme>
      </body>
    </html>
  );
}
