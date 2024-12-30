import { api } from "~/trpc/server";
import { FragranceCard } from "./_components/FragranceCard";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

const YourCollectionPage = async () => {
  const userFragrances = await api.userFragrances.getAll();
  const orderedFragrances = userFragrances.sort((a, b) =>
    a.house.localeCompare(b.house),
  );
  const bottles = orderedFragrances.filter((fragrance) => !fragrance.isDecant);
  const decants = orderedFragrances.filter((fragrance) => fragrance.isDecant);
  return (
    <div className="flex h-fit min-h-full w-full flex-col items-center gap-6 p-4">
      <h1 className="text-2xl font-bold">Your fragrances</h1>
      <Tabs
        defaultValue="bottles"
        className="flex w-full flex-col items-center gap-4"
      >
        <TabsList>
          <TabsTrigger value="bottles">Bottles</TabsTrigger>
          <TabsTrigger value="decants">Decants</TabsTrigger>
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
