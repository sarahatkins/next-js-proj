"use client";

import { useState } from "react";
import { Grid, Rows3, Search } from "lucide-react";
import DateStrip from "./homepage/DateStrip";
import { api } from "~/trpc/react";
import CreateEntryBtn from "./journal/CreateEntryBtn";
import JournalFeed from "./homepage/JournalFeed";

export default function HomePage() {
  const utils = api.useUtils();
  const [view, setView] = useState<"compact" | "spaced">("spaced");
  const [query, setQuery] = useState<string>("");

  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null,
  );

  const handleUpdate = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      utils.journal.getEntries.invalidate();
    }, 1000);

    setDebounceTimer(timer);
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Row 1 - Date Picker */}
      <DateStrip />

      {/* Row 2 - Search + View Switch */}
      <div className="sticky top-[3rem] z-10 flex items-center justify-center gap-2 p-2">
        <div className="flex w-full max-w-3xl items-center rounded-full bg-white px-4 py-2 shadow-lg">
          <Search className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              handleUpdate();
            }}
            className="ml-2 flex-1 bg-transparent placeholder-gray-400 outline-none"
          />
        </div>
        {/* 
        <button
          onClick={() =>
            setView((prev) => (prev === "compact" ? "spaced" : "compact"))
          }
        >
          {view === "compact" ? "Compact View" : "Spaced View"}
        </button> 
        */}
      </div>

      {/* Row 3 - Journal Entries */}
      <div className="h-full overflow-hidden px-20">
        <div className="ml-3 w-fit cursor-pointer rounded-xl p-2 transition hover:text-purple-400">
          {view === "compact" ? (
            <Grid onClick={() => setView("spaced")} />
          ) : (
            <Rows3 onClick={() => setView("compact")} />
          )}
        </div>
        <div className="h-full">
          <JournalFeed view={view} query={query} />
        </div>
      </div>
      <div className="absolute right-10 bottom-10">
        <CreateEntryBtn summarised={true} />
      </div>
    </div>
  );
}
