// app/journal/JournalClient.tsx (Client Component)
"use client";

import { useEffect, useState } from "react";
import type { Entry } from "~/server/api/routers/journal";
import JournalWidget from "./journal/JournalWidget";

import { api } from "~/trpc/react";
import CreateEntryBtn from "./journal/CreateEntryBtn";

export default function JournalClient() {
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [journalEntries] = api.journal.getAll.useSuspenseQuery({ id: "1234" });
  const [entriesLoaded, setEntriesLoaded] = useState<boolean>(false);
  useEffect(() => {
    console.log(journalEntries);
    setEntriesLoaded(true);
  }, [journalEntries]);
  // Three rows
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Calendar and List Panel */}
      <div
        className={` justify-center overflow-y-auto border-r bg-white pt-5 transition-all duration-300 ${
          selectedEntry ? "w-1/3" : "w-2/5"
        }`}
      >
        <div className="w-full px-10 pb-5">
          <CreateEntryBtn />
        </div>
        <div>
          {entriesLoaded &&
            Array.isArray(journalEntries) &&
            journalEntries.map((e: Entry) => (
              <JournalWidget
                key={e.id}
                entry={e}
                onSelectedWidget={setSelectedEntry}
              />
            ))}
        </div>
      </div>

      {/* Journal Entry Detail */}
      {selectedEntry && (
        <div className="flex-1 overflow-y-auto p-6">
          <button onClick={() => setSelectedEntry(null)}>← Back</button>
          <h2 className="mt-4 text-2xl font-bold">
            {selectedEntry.createdAt.toString()}
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-gray-700">
            {selectedEntry.content}
          </p>
        </div>
      )}
    </div>
  );
}
