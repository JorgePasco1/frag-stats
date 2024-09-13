import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { NavBar } from "./_components/NavBar";

export const metadata: Metadata = {
  title: "Frag Stats",
  description: "Trace the use of your fragrances",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body className="flex h-screen flex-col bg-slate-700 text-slate-100">
          <TRPCReactProvider>
            <NavBar />
            <main className="flex-grow">{children}</main>
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}


