import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/nextjs";
import { NavBar } from "./_components/NavBar";
import { ThemeProvider } from "~/components/theme-provider";

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
        <body className="flex min-h-screen flex-col bg-slate-700 text-slate-100">
          <TRPCReactProvider>
            <ThemeProvider attribute="class" defaultTheme="dark">
              <NavBar />
              <div className="flex min-h-full flex-col items-center justify-center">
                <SignedOut>
                  <div>To continue:</div>
                  <SignInButton />
                </SignedOut>
                <SignedIn>{children}</SignedIn>
              </div>
            </ThemeProvider>
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
