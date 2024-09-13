
import Link from "next/link";

export const NavBar = () => {
  return (
    <nav className="h-1/20 text-l flex flex-wrap items-center justify-between bg-slate-900 p-6">
      {/* Home nav item */}
      <Link href="/">Home</Link>
      <Link href="/login">Log in</Link>
    </nav>
  );
};
