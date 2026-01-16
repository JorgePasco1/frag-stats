import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

type TextInputStepProps = {
  rawText: string;
  onChange: (text: string) => void;
  onLoad: () => void;
};

export function TextInputStep({
  rawText,
  onChange,
  onLoad,
}: TextInputStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="bulk-text-input">Paste your fragrance logs</Label>
        <Textarea
          id="bulk-text-input"
          value={rawText}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Lunes 29
Aventus: noche
Coromandel

Martes 30
Viking Cologne: almuerzo con Potrillo
Limmensite 7

Miercoles 14
spice blend night mild`}
          className="mt-2 min-h-[300px] font-mono text-sm"
        />
      </div>
      <Button onClick={onLoad} disabled={!rawText.trim()}>
        Parse Entries
      </Button>
    </div>
  );
}
