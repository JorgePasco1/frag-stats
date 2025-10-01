import { api } from "~/trpc/server";
import { FarewellForm } from "./_components";

const FragranceFarewellPage = async ({
  params,
}: {
  params: { fragranceId: string };
}) => {
  const { fragranceId } = params;
  const userFragranceId = parseInt(fragranceId); // This will need to be updated when URL structure changes
  const { name } =
    (await api.fragrances.getFragranceName({
      userFragranceId: userFragranceId,
    })) ?? {};
  return (
    <div className="flex flex-col items-center gap-4 pt-4">
      <div className="text-lg">Farewell {name}</div>
      <FarewellForm userFragranceId={userFragranceId} />
    </div>
  );
};

export default FragranceFarewellPage;
