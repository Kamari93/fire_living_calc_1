// components/InfoPopover.jsx
import React, { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
// import { motion } from "framer-motion";

export default function InfoPopover({ label, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="ml-1 text-blue-500 hover:text-blue-700 cursor-pointer"
        aria-label={`${label} info`}
      >
        ?
      </button>

      {/* {open && (
        <div className="absolute z-10 -left-15 mt-2 w-72 p-3 bg-gray-100 border border-gray-300 rounded-xl shadow-lg text-sm text-gray-800">
          {children}
        </div>

      )} */}
      {open && (
        <div
          className={`absolute z-10 mt-2 w-72 p-3 bg-gray-100 border border-gray-300 rounded-xl shadow-lg text-sm text-gray-800 ${
            label === "Expenses" || label === "Estimated FI Year"
              ? "-left-50"
              : "-left-15"
          }`}
        >
          {children}
        </div>
      )}
      {/* {open && (
        <div
          className={`absolute z-10 mt-2 w-72 p-3 bg-gray-100 border border-gray-300 rounded-xl shadow-lg text-sm text-gray-800 ${positionClass}`}
        >
          {children}
        </div>
      )} */}
    </div>
  );
}

/**
Features:
Closes when clicking outside.
Click toggles visibility.
Reusable for any section.
Styled with Tailwind (adjust to fit your app).
 */
