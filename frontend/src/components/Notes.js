import React, { useState, useRef, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { getNotes, trackNotes } from "../utils/notes";
function Note({
  note,
  onChange,
  onDelete,
  isExpanded,
  setExpandedIndex,
  index,
}) {
  const noteRef = useRef(null);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (noteRef.current && !noteRef.current.contains(event.target)) {
        setExpandedIndex(null); 
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

function Notes({ player, trackingId, videoId }) {
  const [notes, setNotes] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null); 
  console.log(notes);
  
  const handleNoteChange = (index, field, value) => {
    const updatedNotes = [...notes];
    updatedNotes[index][field] = value;
    setNotes(updatedNotes);
  };


  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
    if (expandedIndex === index) {
      setExpandedIndex(null); 
    }
  };

 
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
    if (player && player.getCurrentTime) {
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


  useEffect(()=> {
    getNotes(trackingId, videoId, setNotes);
    console.log("note")
  }, [])
  return (
    <div className="relative mt-5 w-full border border-gray-500 rounded-2xl p-5">
  
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl text-white">Notes</h1>
        <button
          onClick={addNewNote}
          className="bg-[#212121] hover:bg-[#333333] p-2 rounded-full"
        >
          <Plus className="text-gray-400 w-7 h-7" />
        </button>
      </div>


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
