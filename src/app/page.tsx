import Image from "next/image";
import { db } from "~/server/db";
import { HydrateClient } from "~/trpc/server";

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
  const fragrances = await db.query.fragrances.findMany();
  return (
    <div>
      {fragrances.map((fragrance) => (
        <div key={fragrance.id}>
          <div>
            {fragrance.house} {fragrance.name}
          </div>
          <Image
            src={fragrance.imageUrl}
            alt={fragrance.name}
            width={200}
            height={200}
          />
        </div>
      ))}
    </div>
  );
};
