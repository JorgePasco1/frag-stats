import type { UserFragranceLog } from "~/types/UserFragranceLog.types";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Button } from "~/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Card, CardContent } from "~/components/ui/card";

type LogGroupProps = {
  date: string;
  logs: UserFragranceLog[];
  defaultOpen: boolean;
};

export const LogGroup = ({ date, logs, defaultOpen }: LogGroupProps) => {
  return (
    <Collapsible
      className="flex flex-col items-center"
      defaultOpen={defaultOpen}
    >
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="lg">
          <span className="text-lg">{date}</span>
          <CaretSortIcon className="h-4 w-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-4 p-2">
        {logs.map((log) => (
          <Card key={`log-card-${log.id}`}>
            <CardContent className="flex flex-col items-center justify-center p-4 cursor-pointer">
              <div>{log.fragranceFullName}</div>
            </CardContent>
          </Card>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
