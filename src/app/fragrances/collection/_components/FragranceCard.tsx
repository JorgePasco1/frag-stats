import type { inferRouterOutputs } from "@trpc/server";
import Image from "next/image";
import type { AppRouter } from "~/server/api/root";

type UserFragrance =
  inferRouterOutputs<AppRouter>["userFragrances"]["getAll"][number];

type FragranceCardProps = {
  fragrance: UserFragrance;
};

export const FragranceCard = ({ fragrance }: FragranceCardProps) => {
  return (
    <div className="flex flex-col border-solid border-slate-900 border-4 rounded-lg">
      <Image
        src={fragrance.imageUrl}
        width={300}
        height={200}
        alt={`${fragrance.name}'s photo`}
        className="rounded-t-lg"
      />
      <div className="flex flex-col items-center gap-4 p-6 bg-slate-800">
        <h3 className="text-lg">{fragrance.house}</h3>
        <h2 className="text-xl font-bold">{fragrance.name}</h2>
        <p>Added on {new Date(fragrance.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};
