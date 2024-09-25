import { api } from "~/trpc/server";
import { FragranceCard } from "./_components/FragranceCard";

const YourCollectionPage = async () => {
  const userFragrances = await api.userFragrances.getAll();
  console.log({ userFragrances });
  return (
    <div className="flex h-full w-full flex-col items-center p-4 gap-6">
      <h1 className="text-2xl font-bold">Your fragrances</h1>
      <div className="flex gap-8 flex-wrap">
        {userFragrances.map((fragrance) => (
          <FragranceCard key={fragrance.fragranceId} fragrance={fragrance} />
        ))}
      </div>
    </div>
  );
};

export default YourCollectionPage;
