import { api } from "~/trpc/server";
import { NewLogModal } from "./_components/NewLogModal";

const LogsIndex = () => {
  void api.userFragrances.getAll.prefetch();

  return (
    <div className="flex flex-col items-center gap-4 pb-4 pt-4">
      <h1 className="text-xl font-bold">Logs</h1>
      <NewLogModal />
    </div>
  );
};

export default LogsIndex;
