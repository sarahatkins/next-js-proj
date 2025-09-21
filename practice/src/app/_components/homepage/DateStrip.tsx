"use client";

import { useState } from "react";
import { addDays, format, startOfToday } from "date-fns";

export default function DateStrip() {
  const today = startOfToday();
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  // Generate a range of days (example: 14 days centered around today)
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 3));

  return (
    <div className="no-scrollbar flex justify-center overflow-x-auto bg-white">
      <div className="flex space-x-4 px-4 py-2">
        {days.map((day) => {
          const isSelected =
            format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={`flex flex-col items-center rounded-lg px-3 py-2 transition ${
                isSelected
                  ? "bg-violet-400 font-semibold text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-lg">{format(day, "d")}</span>
              <span className="text-xs uppercase">{format(day, "EEE")}</span>
              {/* <span className="text-xs">{format(day, "MMM")}</span> */}
            </button>
          );
        })}
      </div>
    </div>
  );
}
