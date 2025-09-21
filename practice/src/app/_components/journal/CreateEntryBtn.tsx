import { useState } from "react";
import type { Entry } from "~/server/api/routers/journal";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
interface ButtonProps {
  summarised?: boolean;
  styling?: string;
}

const CreateEntryBtn: React.FC<ButtonProps> = ({
  summarised = false,
  styling,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const createEntry = api.journal.create.useMutation({
    onSuccess: (entry) => {
      setLoading(false);
      if (!entry) return;
      router.push(`/${entry.id}`);
    },
  });

  return (
    <button
      className={`${
        styling
          ? styling
          : "rounded-xl h-10 w-fit cursor-pointer bg-gradient-to-r from-violet-400 to-violet-600 px-6 py-2 font-semibold text-white shadow-md transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg focus:outline-none active:scale-95"
      } `}
      onClick={() => {
        setLoading(true);
        createEntry.mutate({ title: "", content: "" });
      }}
    >
      {loading ? (
        <svg
          className="ml-2 h-5 animate-spin text-white"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <div>
          + {!summarised ? " New Entry" : ""}
        </div>
      )}
    </button>
  );
};

export default CreateEntryBtn;
