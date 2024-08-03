import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

import { Providers } from "./providers";

const dm_sans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Expensz by Chill31",
  description:
    "Expense tracker web app created with the help of Next.js and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={dm_sans.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
