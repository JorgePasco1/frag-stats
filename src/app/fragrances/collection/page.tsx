import { api } from "~/trpc/server";

const YourCollectionPage = async () => {
  const userFragrances = await api.userFragrances.getAll();
  console.log({ userFragrances });
  return (
    <div className="flex h-full w-full flex-col items-center p-4">
      <h1 className="text-xl font-bold">Your fragrances</h1>
    </div>
  );
};

export default YourCollectionPage;
