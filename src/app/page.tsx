import { SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import { db } from "~/server/db";
import { HydrateClient } from "~/trpc/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="flex h-full flex-col items-center justify-center">
        <Fragrances />
      </div>
    </HydrateClient>
  );
}

const Fragrances = async () => {
  return (
    <div>
      <SignedOut>
        <div>Wecolme. To continue:</div>
        <SignInButton/>
      </SignedOut>
    </div>
  );
};
