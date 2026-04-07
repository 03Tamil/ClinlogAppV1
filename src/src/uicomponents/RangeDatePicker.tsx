import * as React from "react"
import { format, subDays } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "src/shadutils/utils"
import { Button } from "src/uicomponents/ui/button"
import { Calendar } from "src/uicomponents/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/uicomponents/ui/popover"

export function RangeDatePicker({
  className,
  dateState,
  type,
}: React.HTMLAttributes<HTMLDivElement> | any) {
  const { date, setDate } = dateState

  return (
    <div className={cn("flex", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal font-semibold",
              type === "patientsTable" && "border-0 pr-0",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-5 w-5" />
            <div className={cn(type === "patientsTable" && "text-[17px]")}>
              {date?.from ? (
                date?.to ? (
                  <>
                    {format(date?.from, "LLL dd, y")} -{" "}
                    {format(date?.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date?.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
