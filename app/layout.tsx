import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

import { Providers } from "./providers";

const dm_sans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://expensz.vercel.app'),
  title: "Expensz by Chill31",
  description:
    "Expense tracker web app created with the help of Next.js and Tailwind CSS.",
    openGraph: {
      title: 'Expensz by Chill31',
      description: 'Expense tracker web app created with the help of Next.js and Tailwind CSS.',
      url: 'https://expensz.vercel.app',
      siteName: 'Expensz',
      images: '/logo-with-text.png',
      locale: 'en_IN',
      type: 'website',
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={dm_sans.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
