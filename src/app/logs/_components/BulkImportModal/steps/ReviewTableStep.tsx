import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Trash2 } from "lucide-react";
import type { ParsedLogEntry } from "../BulkImport.types";
import type { UserFragranceBasicData } from "~/types/UserFragrance.types";
import { cn } from "~/lib/utils";

type ReviewTableStepProps = {
  entries: ParsedLogEntry[];
  userFragrances: UserFragranceBasicData[];
  onUpdateEntry: (id: string, updates: Partial<ParsedLogEntry>) => void;
  onDeleteEntry: (id: string) => void;
  onBack: () => void;
  onSave: () => void;
};

export function ReviewTableStep({
  entries,
  userFragrances,
  onUpdateEntry,
  onDeleteEntry,
  onBack,
  onSave,
}: ReviewTableStepProps) {
  const validCount = entries.filter((e) => e.isValid).length;

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toISOString().split("T")[0] ?? "";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm text-muted-foreground">
        {validCount} of {entries.length} entries ready to save
      </div>

      <div className="max-h-[400px] overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead className="min-w-[200px]">Fragrance</TableHead>
              <TableHead className="w-[100px]">Time</TableHead>
              <TableHead className="w-[100px]">Weather</TableHead>
              <TableHead className="w-[80px]">Rating</TableHead>
              <TableHead className="min-w-[150px]">Notes</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow
                key={entry.id}
                className={cn(
                  !entry.isValid && "bg-yellow-50 dark:bg-yellow-900/20",
                  entry.matchConfidence < 0.8 &&
                    entry.matchedFragranceId &&
                    "bg-orange-50 dark:bg-orange-900/20",
                )}
              >
                <TableCell>
                  <Input
                    type="date"
                    value={formatDate(entry.date)}
                    onChange={(e) => {
                      const newDate = e.target.value
                        ? new Date(e.target.value)
                        : null;
                      onUpdateEntry(entry.id, { date: newDate });
                    }}
                    className="h-8 text-xs"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={entry.matchedUserFragranceId?.toString() ?? ""}
                    onValueChange={(value) => {
                      const frag = userFragrances.find(
                        (f) => f.userFragranceId === parseInt(value),
                      );
                      if (frag) {
                        onUpdateEntry(entry.id, {
                          matchedFragranceId: frag.fragranceId,
                          matchedUserFragranceId: frag.userFragranceId,
                          matchConfidence: 1,
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue
                        placeholder={entry.fragranceName || "Select fragrance"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {userFragrances.map((frag) => (
                        <SelectItem
                          key={frag.userFragranceId}
                          value={frag.userFragranceId.toString()}
                          className="text-xs"
                        >
                          {frag.house} {frag.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={entry.timeOfDay ?? ""}
                    onValueChange={(value) => {
                      onUpdateEntry(entry.id, {
                        timeOfDay:
                          value === "day" || value === "night" ? value : null,
                      });
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day" className="text-xs">
                        Day
                      </SelectItem>
                      <SelectItem value="night" className="text-xs">
                        Night
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={entry.weather ?? ""}
                    onValueChange={(value) => {
                      onUpdateEntry(entry.id, {
                        weather:
                          value === "hot" ||
                          value === "cold" ||
                          value === "mild"
                            ? value
                            : null,
                      });
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hot" className="text-xs">
                        Hot
                      </SelectItem>
                      <SelectItem value="cold" className="text-xs">
                        Cold
                      </SelectItem>
                      <SelectItem value="mild" className="text-xs">
                        Mild
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={entry.enjoyment ?? ""}
                    onChange={(e) => {
                      const val = e.target.value
                        ? parseInt(e.target.value)
                        : null;
                      onUpdateEntry(entry.id, { enjoyment: val });
                    }}
                    className="h-8 text-xs"
                    placeholder="-"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    value={entry.notes ?? ""}
                    onChange={(e) => {
                      onUpdateEntry(entry.id, {
                        notes: e.target.value || null,
                      });
                    }}
                    className="h-8 text-xs"
                    placeholder="-"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteEntry(entry.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Edit Text
        </Button>
        <Button onClick={onSave} disabled={validCount === 0}>
          Save {validCount} {validCount === 1 ? "Entry" : "Entries"}
        </Button>
      </div>
    </div>
  );
}
