import { api } from "~/trpc/server";
import { FarewellForm } from "./_components";

const FragranceFarewellPage = async ({
  params,
}: {
  params: { fragranceId: string };
}) => {
  const { fragranceId } = params;
  const { name } =
    (await api.fragrances.getFragranceName({
      fragranceId: parseInt(fragranceId),
    })) ?? {};
  return (
    <div className="flex flex-col items-center gap-4 pt-4">
      <div className="text-lg">Farewell {name}</div>
      <FarewellForm fragranceId={parseInt(fragranceId)} />
    </div>
  );
};

export default FragranceFarewellPage;
