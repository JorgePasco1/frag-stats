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
    <div className="flex w-80 flex-col rounded-lg border-4 border-solid border-slate-900">
      <div className="flex justify-center bg-white">
        <Image
          src={fragrance.imageUrl}
          width={200}
          height={100}
          alt={`${fragrance.name}'s photo`}
          className="rounded-t-lg"
        />
      </div>
      <div className="flex flex-col items-center gap-4 bg-slate-800 p-6">
        <h3 className="text-lg">{fragrance.house}</h3>
        <h2 className="text-xl font-bold">{fragrance.name}</h2>
        <p>Added on {new Date(fragrance.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};
