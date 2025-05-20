import { api } from "~/trpc/server";
import { FragranceCard } from "./_components/FragranceCard";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { SortBy } from "./_components/SortBy";

const YourCollectionPage = async ({
  searchParams,
}: {
  searchParams: { sort?: string };
}) => {
  const orderBy = () => {
    if (
      searchParams.sort === "name" ||
      searchParams.sort === "rating" ||
      searchParams.sort === "lastUsed"
    ) {
      return searchParams.sort;
    }
    return "name";
  };


  const userFragrances = await api.userFragrances.getAll({ orderBy: orderBy() });
  const bottles = userFragrances.filter((fragrance) => !fragrance.isDecant);
  const bottlesCount = bottles.length;

  const decants = userFragrances.filter((fragrance) => fragrance.isDecant);
  const decantsCount = decants.length;
  return (
    <div className="flex h-fit min-h-full w-full flex-col items-center gap-6 p-4">
      <h1 className="text-2xl font-bold">Your fragrances</h1>
      <SortBy
        currentSort={orderBy()}
        searchParams={searchParams}
      />
      <Tabs
        defaultValue="bottles"
        className="flex w-full flex-col items-center gap-4"
      >
        <TabsList>
          <TabsTrigger value="bottles">Bottles ({bottlesCount})</TabsTrigger>
          <TabsTrigger value="decants">Decants ({decantsCount})</TabsTrigger>
        </TabsList>
        <TabsContent value="bottles">
          <div className="flex w-full flex-wrap justify-center gap-8">
            {bottles.map((fragrance) => (
              <FragranceCard
                fragrance={fragrance}
                key={fragrance.fragranceId}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="decants">
          <div className="flex w-full flex-wrap justify-center gap-8">
            {decants.map((fragrance) => (
              <FragranceCard
                key={fragrance.fragranceId}
                fragrance={fragrance}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default YourCollectionPage;
