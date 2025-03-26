import React, { useState, useRef, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

function Note({ note, onChange, onDelete, isExpanded, setExpandedIndex, index }) {
  const noteRef = useRef(null);

  // Detect clicks outside to collapse the note
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (noteRef.current && !noteRef.current.contains(event.target)) {
        setExpandedIndex(null); // Collapse the note if clicked outside
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, setExpandedIndex]);

  return (
    <div
      ref={noteRef}
      className={`relative bg-[#212121] hover:bg-[#3d3d3d] p-4 rounded-xl border border-gray-600 min-h-28 flex flex-col transition-all duration-300 ease-in-out cursor-pointer ${
        isExpanded ? "h-auto" : "h-28 "
      }`}
      onClick={() => setExpandedIndex(index)}
    >
      {/* Timestamp at top-right */}
      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
        {note.timestamp}
      </div>

      {/* Delete Button (Only visible when expanded) */}
      {isExpanded && (
        <button
          className="absolute bottom-3 right-3 text-red-400 hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation(); // Prevent collapsing when clicking delete
            onDelete();
          }}
        >
          <Trash2 size={18} />
        </button>
      )}

      {/* Editable Title */}
      <input
        type="text"
        value={note.title}
        onChange={(e) => onChange("title", e.target.value)}
        className={`text-lg font-semibold text-gray-300 bg-transparent outline-none resize-none ${
          isExpanded ? "" : "line-clamp-1"
        }`}
        placeholder="Enter title..."
      />

      {/* Editable Content */}
      <textarea
        value={note.content}
        onChange={(e) => onChange("content", e.target.value)}
        className={`text-gray-400 text-sm mt-2 bg-transparent outline-none resize-none ${
          isExpanded ? "" : "line-clamp-2"
        }`}
        placeholder="Enter content..."
      />
    </div>
  );
}

function Notes({ player }) {
  const [notes, setNotes] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null); // Track which note is expanded

  // Function to handle input changes
  const handleNoteChange = (index, field, value) => {
    const updatedNotes = [...notes];
    updatedNotes[index][field] = value;
    setNotes(updatedNotes);
  };

  // Function to delete a note
  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
    if (expandedIndex === index) {
      setExpandedIndex(null); // Collapse the note if it's being deleted
    }
  };

  // Function to format timestamp from seconds -> HH:MM:SS
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

  // Function to add a new note with timestamp from video
  const addNewNote = () => {
    if (player && player.getCurrentTime) {
      const currentTime = formatTimestamp(player.getCurrentTime());

      setNotes([
        ...notes,
        {
          title: "",
          content: "",
          timestamp: currentTime, // Get timestamp from video
        },
      ]);
    } else {
      console.error("YouTube Player not initialized yet!");
    }
  };

  return (
    <div className="relative mt-5 w-full border border-gray-500 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl text-white">Notes</h1>
        <button
          onClick={addNewNote}
          className="bg-[#212121] hover:bg-[#333333] p-2 rounded-full"
        >
          <Plus className="text-gray-400 w-7 h-7" />
        </button>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-3 gap-4">
        {notes.map((note, index) => (
          <Note
            key={index}
            note={note}
            onChange={(field, value) => handleNoteChange(index, field, value)}
            onDelete={() => deleteNote(index)}
            isExpanded={expandedIndex === index}
            setExpandedIndex={setExpandedIndex}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

export default Notes;
