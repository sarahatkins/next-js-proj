"use client";

import { useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import type { Entry } from "~/server/api/routers/journal";
import { useRouter } from "next/navigation";

interface JournalFeedProps {
  view: "compact" | "spaced";
  query: string;
}

export default function JournalFeed({ view, query }: JournalFeedProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);

  // Query journal entries
  const { data: entryData } = api.journal.getEntries.useInfiniteQuery(
    {
      userId: session?.user?.id ?? "",
      query,
    },
    {
      enabled: !!session?.user?.id,
      getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    },
  );

  // Normalize entries
  useMemo(() => {
    if (!entryData?.pages) {
      setEntries([]);
      return;
    }
    const all = entryData.pages.flatMap((page) => page?.res ?? []);
    setEntries(all);
  }, [entryData]);

  // Virtualizer setup
  const virtualizer = useVirtualizer({
    count: entries.length,
    estimateSize: () => 160,
    getScrollElement: () => scrollRef.current,
  });

  // React Table setup
  const columns = useMemo<ColumnDef<Entry>[]>(
    () => [{ accessorKey: "title", header: "Title" }],
    [],
  );

  const reactTable = useReactTable({
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id.toString(),
  });

  return (
    <div
      ref={scrollRef}
      className="h-full w-full overflow-y-auto px-2 pt-1"
    >
      <div
        className={` ${
          view === "compact"
            ? "grid grid-cols-4 gap-4"
            : "flex w-full h-full flex-col gap-4"
        }`}
      >
        {virtualizer.getVirtualItems().map((vr) => {
          const cols = view === "compact" ? 4 : 1;
          const startIndex = vr.index * cols;
          const rowItems = entries.slice(startIndex, startIndex + cols);

          if (!rowItems) return null;

          return rowItems.map((entry) => (
            <div
              key={entry.id}
              className={`cursor-pointer rounded-xl bg-white p-4 shadow-lg ring-purple-300 transition hover:scale-101 hover:ring-3 ${
                view === "compact" ? "w-full" : "w-full"
              }`}
              onClick={() => router.push(`/${entry.id}`)}
            >
              <h3 className="font-semibold">
                {entry.title?.trim()
                  ? entry.title
                  : "Untitled Entry"}
              </h3>
              <p className="text-sm text-gray-600">
                {entry.content.trim()
                  ? entry.content
                  : "Nothing entered..."}
              </p>
            </div>
          ));
        })}
      </div>
    </div>
  );
}
