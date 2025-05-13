"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MultiSelectProps
  extends React.ComponentPropsWithoutRef<"div"> {
  options: { id: number; name: string; image?: string }[];
  selectedValues: number[];
  onValuesChange: (selectedValues: number[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function MultiSelect({
  options,
  selectedValues,
  onValuesChange,
  placeholder = "Sélectionner...",
  className,
  disabled = false,
  ...props
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggleOption = (id: number) => {
    const newSelectedValues = selectedValues.includes(id)
      ? selectedValues.filter((value) => value !== id)
      : [...selectedValues, id];

    onValuesChange(newSelectedValues);
  };

  const handleRemoveValue = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onValuesChange(selectedValues.filter((value) => value !== id));
  };

  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.id)
  );

  return (
    <div
      className={cn("relative w-full", className)}
      ref={containerRef}
      {...props}
    >
      <div
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex min-h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "cursor-pointer flex flex-wrap gap-1 items-center"
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {selectedOptions.length > 0 ? (
          selectedOptions.map((option) => (
            <div
              key={option.id}
              className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center gap-1"
            >
              {option.image && (
                <img
                  src={option.image}
                  alt={option.name}
                  className="w-4 h-4 object-contain"
                />
              )}
              {option.name}
              <button
                type="button"
                onClick={(e) => handleRemoveValue(option.id, e)}
                className="text-blue-800 hover:text-blue-900 focus:outline-none"
                aria-label={`Supprimer ${option.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 max-h-60 overflow-auto">
          <div className="py-1">
            {options.map((option) => (
              <div
                key={option.id}
                className={cn(
                  "flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100",
                  selectedValues.includes(option.id) && "bg-blue-50"
                )}
                onClick={() => handleToggleOption(option.id)}
              >
                <div className="flex-1 flex items-center gap-2">
                  {option.image && (
                    <img
                      src={option.image}
                      alt={option.name}
                      className="w-5 h-5 object-contain"
                    />
                  )}
                  {option.name}
                </div>
                {selectedValues.includes(option.id) && (
                  <svg
                    className="h-4 w-4 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
