import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <div className="flex h-full flex-col items-center justify-center">
        Work in progress
      </div>
    </HydrateClient>
  );
}
