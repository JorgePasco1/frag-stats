const FragranceStatsPage = ({
  params,
}: {
  params: { fragranceId: string };
}) => {
  const { fragranceId } = params;
  return (
    <div>
      <div>{fragranceId}</div>
      <h1>Stats here</h1>
    </div>
  );
};

export default FragranceStatsPage;
