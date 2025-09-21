import React, { useState, type Dispatch, type SetStateAction } from "react";
import type { Entry } from "~/server/api/routers/journal";

interface WidgetProps {
  entry: Entry,
  selected: boolean;
  onSelectedWidget: Dispatch<SetStateAction<Entry | null>>;
}

const JournalWidget: React.FC<WidgetProps> = ({ entry, onSelectedWidget, selected=false }) => {
  return (
    <button
      type="button"
      onClick={() => onSelectedWidget(entry)}
      aria-label={`Open entry ${entry.title ?? "Untitled"}`}
      className={`
        cursor-pointer
        w-full text-left transition-shadow duration-150
        rounded-xl p-4
        border
        focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400
        ${selected ? "bg-blue-50 border-blue-200 shadow-md" : "bg-white border-gray-200 hover:shadow-sm"}
      `}
    >
      <div className="flex flex-col gap-1">
        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 truncate">
          {entry.title ?? "Untitled"}
        </h3>

        {/* Snippet — multi-line clamp (requires @tailwindcss/line-clamp plugin).
            If you don't have the plugin, see the fallback below in the comment. */}
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
          {entry.content}
        </p>

        {/* Optional meta row */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
          <span>{entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : ""}</span>
          <span>{/* e.g. reading time or tags if you want */}</span>
        </div>
      </div>
    </button>
  );
};

export default JournalWidget;
