"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

const FragranceDetailsPage = ({
  params,
}: {
  params: { fragranceId: string };
}) => {
  const { fragranceId } = params;

  const [file, setFile] = useState<File | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0] ?? null);
    }
  };

  const { mutate, isPending } =
    api.fragrances.loadFragranceDataFromFragrantica.useMutation({
      onSuccess: () => {
        toast.success("Fragrance data loaded successfully");
        setFile(null);
      },
      onError: (error) => {
        toast.error("Failed to load fragrance data", {
          description: error.message || "Please try again.",
        });
      },
    });
  const handleUploadConfirm = async () => {
    if (!file) return;
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    mutate(uint8Array);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="text-lg font-medium">Fragrance #{fragranceId}</div>
      <Link
        href={`/stats/fragrance/${fragranceId}/`}
        className="text-primary hover:underline"
      >
        View your stats
      </Link>
      <div className="flex flex-col gap-2">
        <input
          type="file"
          onChange={handleFileChange}
          disabled={isPending}
          className="text-sm"
        />
        <Button disabled={!file || isPending} onClick={handleUploadConfirm}>
          {isPending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Uploading..." : "Confirm"}
        </Button>
      </div>
    </div>
  );
};

export default FragranceDetailsPage;
