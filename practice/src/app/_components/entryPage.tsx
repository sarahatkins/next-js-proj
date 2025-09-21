// app/journal/page.tsx (Next.js 13+ App Router)
// or pages/journal.tsx (if using Pages Router)

"use client";

import { useState } from "react";
import type { Entry } from "~/server/api/routers/journal";
import JournalFeed from "./homepage/JournalFeed";
import { api } from "~/trpc/react";
import CreateEntryBtn from "./journal/CreateEntryBtn";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface EntryPageProps {
  entryId: number;
}

const EntryPage: React.FC<EntryPageProps> = ({ entryId }) => {
    const router = useRouter();
  const { data: entry } = api.journal.getEntryById.useQuery({
    id: entryId,
  });
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
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
      updateEntry.mutate({
        id: entryId,
        title,
        content,
      });
    }, 1000);

    setDebounceTimer(timer);
  };
  return (
    <div className="h-screen bg-white text-gray-900">
      {/* Sidebar */}
      <div className="flex h-[5vh] w-full justify-between bg-indigo-100">
        <button className="pl-6" onClick={() => router.push(`./`)}><MoveLeft /></button>
        <CreateEntryBtn
          summarised={true}
          styling={`w-fit px-5 flex items-center hover:bg-indigo-200`}
        />
      </div>

      <div className="flex h-[95vh] w-full">
        <aside className="w-1/3 overflow-y-auto border-r border-slate-50">
          <JournalFeed view={"spaced"} query={""} />
        </aside>

        {/* Main Content */}
        {entry && (
          <div className="flex w-full flex-col overflow-y-auto pt-6 pl-6">
            <input
              className="mb-4 text-2xl font-semibold focus:outline-none"
              value={title}
              onInput={(e) => setTitle(e.currentTarget.value)}
              onBlur={() => handleUpdate()}
              placeholder="No title..."
            />
            <div className="h-full w-full overflow-y-hidden">
              <textarea
                className="h-full w-full leading-relaxed whitespace-pre-line text-gray-800 focus:outline-none"
                value={content}
                placeholder={"Start writing here >:)"}
                onInput={(e) => setContent(e.currentTarget.value)}
                onBlur={() => handleUpdate()}
                autoComplete="on"
                autoCorrect="on"
                autoFocus
                spellCheck
                onChange={() => handleUpdate()}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default EntryPage;
