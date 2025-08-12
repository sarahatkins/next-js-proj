import React, { useEffect, useState } from "react";
import { api } from "~/trpc/react";

type WidgetProps = {
  onClose: (open: boolean) => void;
};

const CreateEntryWidget: React.FC<WidgetProps> = ({ onClose }) => {
  const createEntry = api.journal.create.useMutation();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const handleCreateClick = async () => {
    if (title.trim().length <= 0 || content.trim().length <= 0) return;

    await createEntry.mutate({
      title,
      content,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blackout background */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => onClose(false)}
      ></div>

      {/* Widget container */}
      <div className="animate-fadeIn relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={() => onClose(false)}
          className="absolute top-4 right-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-200 text-gray-600 shadow-sm transition-all duration-200 ease-in-out hover:bg-gray-300 hover:text-gray-800 hover:shadow-md focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Widget content */}
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Create New Entry
        </h2>
        <p className="mb-6 text-gray-600">
          Fill out the details below to create your journal entry.
        </p>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Write your entry..."
            rows={4}
            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            type="submit"
            className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 font-semibold text-white shadow-md transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-blue-400 focus:outline-none active:scale-95"
            onClick={(e) => {
              e.preventDefault();
              handleCreateClick();
            }}
          >
            Save Entry
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEntryWidget;
