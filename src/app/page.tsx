import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { HydrateClient } from "~/trpc/server";
import { HomeView } from "./_components/HomeView";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="flex h-full flex-col items-center justify-center">
        <SignedOut>
          <div>Welcome. To continue:</div>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <HomeView />
        </SignedIn>
      </div>
    </HydrateClient>
  );
}
