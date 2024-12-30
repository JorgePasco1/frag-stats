const FragranceDetailsPage = ({
  params,
}: {
  params: { fragranceId: string };
}) => {
  const { fragranceId } = params;
  return <div>{fragranceId}</div>;
};

export default FragranceDetailsPage;
