"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { usePathname, useRouter } from "next/navigation";

const SORT_OPTIONS = [
  {
    value: "name",
    label: "Name",
  },
  {
    value: "rating",
    label: "Rating",
  },
  {
    value: "lastUsed",
    label: "Last Used",
  },
] as const;

type SortByProps = {
  currentSort: "name" | "rating" | "lastUsed";
  searchParams: { sort?: string };
};

export function SortBy({ currentSort, searchParams }: SortByProps) {
  const [open, setOpen] = React.useState(false);
   const router = useRouter();
   const pathname = usePathname();

   const updateOrderBy = (sort: "name" | "rating" | "lastUsed") => {
     const newParams = new URLSearchParams(searchParams);
     newParams.set("sort", sort);
     router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
   };

  return (
    <div className="flex items-center gap-2">
      <div className="text-sm">Sort by</div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {currentSort
              ? SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label
              : "Select framework..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandGroup>
                {SORT_OPTIONS.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.value}
                    onSelect={(currentValue) => {
                      const parsedValue = () => {
                        if (
                          currentValue === "name" ||
                          currentValue === "rating" ||
                          currentValue === "lastUsed"
                        ) {
                          return currentValue;
                        }
                        return "name";
                      }
                      updateOrderBy(parsedValue());
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        currentSort === opt.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {opt.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
