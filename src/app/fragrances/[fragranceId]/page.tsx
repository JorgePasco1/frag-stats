"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

const FragranceDetailsPage = ({
  params,
}: {
  params: { fragranceId: string };
}) => {
  const { fragranceId } = params;

  const [file, setFile] = useState<File | null>(null);
  console.log({ file });
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0] ?? null);
    }
  };

  const { mutate } =
    api.fragrances.loadFragranceDataFromFragrantica.useMutation();
  const handleUploadConfirm = async () => {
    if (!file) return;
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    mutate(uint8Array);
  };

  return (
    <div>
      <div>{fragranceId}</div>
      <Link href={`/stats/${fragranceId}/`}>Your stats</Link>
      <br />
      <input type="file" onChange={handleFileChange} />
      <Button disabled={!file} onClick={handleUploadConfirm}>
        Confirm
      </Button>
    </div>
  );
};

export default FragranceDetailsPage;
