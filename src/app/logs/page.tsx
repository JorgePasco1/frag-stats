import { api } from "~/trpc/server";
import { NewLogModal } from "./_components/NewLogModal";
import { groupLogsByDate } from "./_lib/groupHelper";
import { LogGroup } from "./_components/LogGroup";

const LogsIndex = async () => {
  const userFragranceLogs =
    await api.userFragranceLogs.getAllUserFragranceLogs();
  const logGroups = groupLogsByDate(userFragranceLogs);
  const sortedLogGroups = Object.entries(logGroups).sort(
    ([a], [b]) => new Date(b).getTime() - new Date(a).getTime(),
  );

  return (
    <div className="flex flex-col items-center gap-4 pb-4 pt-4">
      <h1 className="text-xl font-bold">Logs</h1>
      <NewLogModal />
      {sortedLogGroups.map(([date, logs], idx) => (
        <LogGroup
          date={date}
          logs={logs}
          key={`group-${idx}`}
          defaultOpen={idx === 0}
        />
      ))}
    </div>
  );
};

export default LogsIndex;
