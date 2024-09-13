"use client";

import { useUser } from "@clerk/nextjs";

export const AddFragranceForm = () => {
  const { user } = useUser();
  console.log({ user });

  return <div>Form</div>;
};
