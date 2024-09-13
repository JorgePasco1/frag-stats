import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { HomeView } from "./_components/HomeView";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <SignedOut>
        <div>To continue:</div>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <HomeView />
      </SignedIn>
    </div>
  );
}
