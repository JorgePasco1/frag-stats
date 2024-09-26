import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export const NavBar = () => {
  return (
    <nav className="h-1/20 text-l flex flex-wrap items-center justify-between bg-slate-900 p-6">
      {/* Home nav item */}
      <div className="flex gap-8">
        <Link href="/">Home</Link>
        <Link href="/fragrances/add">New Fragrance</Link>
        <Link href="/fragrances/collection">Collection</Link>
      </div>
      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
};
