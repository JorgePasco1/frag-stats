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
    <div className="pt-4 flex flex-col items-center gap-4">
      <div className="text-lg">Farewell {name}</div>
      <FarewellForm />
    </div>
  );
};

export default FragranceFarewellPage;
