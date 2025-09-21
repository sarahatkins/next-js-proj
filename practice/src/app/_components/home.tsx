"use client";

import { useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Grid, Rows3, Search } from "lucide-react";
import DateStrip from "./homepage/DateStrip";
import type { Entry } from "~/server/api/routers/journal";
import { api } from "~/trpc/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import CreateEntryBtn from "./journal/CreateEntryBtn";
import JournalFeed from "./homepage/JournalFeed";

export default function HomePage() {
  const [view, setView] = useState<"compact" | "spaced">("spaced");
  const [query, setQuery] = useState<string>("");

  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null,
  );

  // get entry
  const updateEntry = api.journal.update.useMutation({
    onSuccess: () => {
      console.log("successful update");
    },
  });

  const handleUpdate = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      
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
            onChange={(e) => setQuery(e.target.value)}
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
      <div className="px-20">
        <div className="p-2 hover:scale-105 transition hover:text-purple-400 w-fit ml-3 cursor-pointer rounded-xl">{view === "compact" ? <Grid onClick={() => setView("spaced")}/> : <Rows3 onClick={() => setView("compact")}/>}</div>
        <JournalFeed view={view} query={query} />
      </div>
      <div className="absolute right-10 bottom-10">
        <CreateEntryBtn summarised={true} />
      </div>
    </div>
  );
}
