import { signInWithGoogle } from "../auth";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function DialogWithForm({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-md bg-[#181818] border border-gray-700 rounded-2xl shadow-2xl p-6 mx-4"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-lg sm:text-xl font-semibold">
                Sign in to continue
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-2 transition-colors rounded-full hover:bg-[#2b2b2b]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-6">
              <p className="text-sm text-gray-400">
                Sync your playlists, take notes, and track your progress — all in one place.
              </p>

              <button
                onClick={signInWithGoogle}
                className="flex items-center justify-center gap-2 text-white bg-[#3d3d3d] hover:bg-[#505050] px-5 py-3 rounded-xl text-sm font-medium shadow-md hover:shadow-xl transition duration-300 ease-in-out"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google Icon"
                  className="w-5 h-5"
                />
                Sign in with Google
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
