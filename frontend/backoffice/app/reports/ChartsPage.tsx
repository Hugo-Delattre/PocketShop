"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/DateRangePicker/DateRangePicker";
import { Charts } from "@/components/charts/Charts";

export function ChartsPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2025, 1, 8),
    to: new Date(),
  });

  return (
    <div className="p-4">
      <DateRangePicker value={date} onChange={setDate} />
      <Charts dateRange={date} />
    </div>
  );
}
