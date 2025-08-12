import { useState, type SetStateAction } from "react";
import CreateEntryWidget from "./CreateEntryWidget";

const CreateEntryBtn = () => {
  const [showCreateWidget, setShowCreateWidget] = useState<boolean>(false);


  return showCreateWidget ? (
    <CreateEntryWidget onClose={setShowCreateWidget} />
  ) : (
    <button
      className="w-full h-10 cursor-pointer rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-2 font-semibold text-white shadow-md transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-blue-400 focus:outline-none active:scale-95"
      onClick={() => setShowCreateWidget(true)}
    >
      + New Entry
    </button>
  );
};

export default CreateEntryBtn;
