import Image from "next/image";
import { Star } from "lucide-react";

import type { UserFragrance } from "~/types/UserFragrance.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type FragranceCardProps = {
  fragrance: UserFragrance;
};

export const FragranceCard = ({ fragrance }: FragranceCardProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <CardComponent fragrance={fragrance} />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top">
        <DropdownMenuItem>Details</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const CardComponent = ({ fragrance }: FragranceCardProps) => {
  const averageRatingText = fragrance.averageRating
    ? fragrance.averageRating.toFixed(2)
    : "Not rated yet";
  return (
    <div className="flex w-80 flex-col rounded-lg border-4 border-solid border-slate-900 bg-slate-800">
      <div className="flex justify-center bg-white">
        <Image
          src={fragrance.imageUrl}
          width={200}
          height={100}
          alt={`${fragrance.name}'s photo`}
          className="rounded-t-lg"
        />
      </div>
      <div className="flex flex-col items-center gap-4 p-6">
        <h3 className="text-lg">{fragrance.house}</h3>
        <div>
          <h2 className="text-center text-xl font-bold">{fragrance.name} </h2>
          <div className="flex items-center justify-center gap-2">
            <Star size={20} fill="#f59e0b" strokeWidth={0} />
            <div className="mt-[3px]">{averageRatingText}</div>
          </div>
        </div>
        <p>Added on {new Date(fragrance.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};
