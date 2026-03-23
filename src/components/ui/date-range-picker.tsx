"use client"

import * as React from "react"
import { format, subDays, startOfMonth, endOfMonth, startOfYear } from "date-fns"
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DatePickerWithRangeProps {
  className?: string;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({
  className,
  date,
  setDate
}: DatePickerWithRangeProps) {
  
  const handlePresetChange = (value: string) => {
    // Generate a fresh Date locked to exactly 00:00:00 local time
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Ensure all presets use pure 00:00:00 bounds to prevent react-day-picker state machine breaking
    switch (value) {
      case "today":
        setDate({ from: new Date(today), to: new Date(today) });
        break;
      case "yesterday":
        const yesterday = subDays(today, 1);
        setDate({ from: new Date(yesterday), to: new Date(yesterday) });
        break;
      case "7days":
        setDate({ from: subDays(today, 6), to: new Date(today) });
        break;
      case "30days":
        setDate({ from: subDays(today, 29), to: new Date(today) });
        break;
      case "thisMonth":
        // using startOfDay ensures even end of month is 00:00:00 to prevent calendar jump bugs
        const monthEnd = endOfMonth(today);
        monthEnd.setHours(0, 0, 0, 0);
        setDate({ from: startOfMonth(today), to: monthEnd });
        break;
      case "thisYear":
        setDate({ from: startOfYear(today), to: new Date(today) });
        break;
      default:
        break;
    }
  };

  const handleDateSelect = (newDate: DateRange | undefined) => {
      if (!newDate) {
          setDate(undefined);
          return;
      }
      
      // CRITICAL FIX: Do NOT mutate original dates. Do NOT set hours to 23:59:59.
      // react-day-picker expects `to` to ALSO be 00:00:00 to correctly recognize "same day" clicks!
      // If `to` is 23:59:59, the component fails to collapse the range and shifts backwards due to internal logic loops.
      const from = newDate.from ? new Date(newDate.from) : undefined;
      const to = newDate.to ? new Date(newDate.to) : undefined;
      
      if (from) from.setHours(0, 0, 0, 0);
      if (to) to.setHours(0, 0, 0, 0);
      
      setDate({ from, to });
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] md:w-[300px] justify-start text-left font-normal bg-card",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 flex flex-col md:flex-row shadow-xl" align="end">
          <div className="border-b md:border-b-0 md:border-r border-border p-3 flex flex-col gap-2 min-w-[150px] bg-muted/20">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 px-2">Presets</p>
            <Button variant="ghost" className="justify-start text-sm h-8" onClick={() => handlePresetChange("today")}>Today</Button>
            <Button variant="ghost" className="justify-start text-sm h-8" onClick={() => handlePresetChange("yesterday")}>Yesterday</Button>
            <Button variant="ghost" className="justify-start text-sm h-8" onClick={() => handlePresetChange("7days")}>Last 7 Days</Button>
            <Button variant="ghost" className="justify-start text-sm h-8" onClick={() => handlePresetChange("30days")}>Last 30 Days</Button>
            <Button variant="ghost" className="justify-start text-sm h-8" onClick={() => handlePresetChange("thisMonth")}>This Month</Button>
            <Button variant="ghost" className="justify-start text-sm h-8" onClick={() => handlePresetChange("thisYear")}>This Year</Button>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            className="p-3"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
