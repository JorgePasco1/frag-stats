import Link from "next/link";

export const HomeView = () => {
  return (
    <div className="flex flex-col gap-4 text-center">
      <div>Welcome! What do you want to do?</div>
      <Link href="/fragrances/add">Add new fragrance</Link>
    </div>
  );
};
