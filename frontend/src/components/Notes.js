import React, {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Plus, Trash2 } from "lucide-react";
import { getNotes, trackNotes } from "../utils/notes";
import { debounce } from "lodash";

function Note({
  note,
  onChange,
  onDelete,
  isExpanded,
  setExpandedIndex,
  index,
  onCollapse,
}) {
  const noteRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (noteRef.current && !noteRef.current.contains(event.target)) {
        onCollapse(index);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, onCollapse]);

  return (
    <div
      data-note
      ref={noteRef}
      className={`relative bg-[#212121] hover:bg-[#3d3d3d] p-4 rounded-xl border border-gray-600 min-h-28 flex flex-col transition-all duration-300 ease-in-out cursor-pointer ${
        isExpanded ? "h-auto" : "h-28 "
      }`}
      onClick={(e) => {
        if (e.target.closest("button")) return;
        setExpandedIndex(index);
      }}
    >
      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
        {note.timestamp}
      </div>

      {isExpanded && (
        <button
          className="absolute bottom-3 right-3 text-red-400 hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 size={18} />
        </button>
      )}
      <input
        type="text"
        value={note.title}
        onChange={(e) => onChange("title", e.target.value)}
        onInput={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = e.target.scrollHeight + "px";
        }}
        className={`text-lg font-semibold text-gray-300 bg-transparent outline-none resize-none overflow-hidden ${
          isExpanded ? "" : "line-clamp-3"
        }`}
        placeholder="Enter Title"
      />

      <textarea
        type="text"
        value={note.content}
        onChange={(e) => onChange("content", e.target.value)}
        onInput={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = e.target.scrollHeight + "px";
        }}
        className={`text-gray-400 text-sm mt-2 bg-transparent outline-none resize-none overflow-hidden ${
          isExpanded ? "" : "line-clamp-5"
        }`}
        placeholder="Enter content"
      />
    </div>
  );
}

const Notes = ({ player, trackingId, videoId, searchNotes }, ref) => {
  const [notes, setNotes] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const debouncedSave = useRef(null);

  const formatTimestamp = (seconds) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const addNewNote = () => {
    if (player && player.getCurrentTime && notes.length <= 10) {
      const currentTime = formatTimestamp(player.getCurrentTime());
      setNotes([
        ...notes,
        {
          title: "",
          content: "",
          timestamp: currentTime,
        },
      ]);
    } else {
      console.error("YouTube Player not initialized yet!");
    }
  };
  const addSeachNote = (title, content) => {
    if (player && player.getCurrentTime && notes.length <= 10) {
      const currentTime = formatTimestamp(player.getCurrentTime());
      const newNote = {
        title,
        content,
        timestamp: currentTime,
      };
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      setExpandedIndex(updatedNotes.length - 1);
      console.log("added search note:", title, content);
    } else {
      console.error("YouTube Player not initialized yet!");
    }
  };

  const debouncedTrackNotes = useRef(
    debounce((updatedNotes) => {
      trackNotes(trackingId, videoId, updatedNotes);
    }, 3000)
  ).current;

  const handleNoteChange = (index, field, value) => {
    const updatedNotes = [...notes];
    updatedNotes[index][field] = value;
    setNotes(updatedNotes);

    if (expandedIndex === index) {
      debouncedTrackNotes(updatedNotes);
    }
  };

  const deleteNote = (index) => {
    debouncedTrackNotes.flush();

    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);

    if (expandedIndex === index) {
      setExpandedIndex(null);
    }

    trackNotes(trackingId, videoId, updatedNotes);
  };

  const handleCollapse = (index) => {
    debouncedTrackNotes.flush();
    setExpandedIndex(null);
    trackNotes(trackingId, videoId, notes);
  };

  useEffect(() => {
    if (trackingId && videoId) {
      getNotes(trackingId, videoId, setNotes);
    }
  }, [trackingId, videoId]);

  useImperativeHandle(ref, () => ({
    addSeachNote,
  }));

  useEffect(() => {
    if (expandedIndex !== null) {
      const noteEl = document.querySelectorAll("[data-note]")[expandedIndex];
      noteEl?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [expandedIndex]);

  return (
    <div className="relative w-full border border-gray-500 rounded-md md:rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl text-white">Notes</h1>
        <button
          onClick={addNewNote}
          className={`bg-[#212121] hover:bg-[#333333] p-2 rounded-full ${
            notes.length >= 10 ? `hidden` : ``
          }`}
          disabled={notes.length >= 10}
        >
          <Plus className="text-gray-400 w-7 h-7" />
        </button>
      </div>

      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        {notes.map((note, index) => (
          <Note
            key={index}
            note={note}
            onChange={(field, value) => handleNoteChange(index, field, value)}
            onDelete={() => deleteNote(index)}
            isExpanded={expandedIndex === index}
            setExpandedIndex={setExpandedIndex}
            index={index}
            onCollapse={handleCollapse}
          />
        ))}
      </div>
    </div>
  );
};
export default forwardRef(Notes);
