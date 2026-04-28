"use client";

import { useEffect, useRef, useState } from "react";
import { format, parseISO } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { formatDateDisplay } from "@/lib/formatters";

type DatePickerProps = {
  value?: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  allowClear?: boolean;
  className?: string;
};

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  allowClear = false,
  className
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const selectedDate = value ? parseISO(value) : undefined;

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
      >
        <span className={cn(!value && "text-slate-400")}>
          {value ? formatDateDisplay(value) : placeholder}
        </span>
        <div className="flex items-center gap-2">
          {allowClear && value ? (
            <span
              role="button"
              tabIndex={0}
              onClick={(event) => {
                event.stopPropagation();
                onChange("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onChange("");
                }
              }}
              className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </span>
          ) : null}
          <CalendarDays className="h-4 w-4 text-slate-400" />
        </div>
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+0.5rem)] z-30 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (!date) return;
              onChange(format(date, "yyyy-MM-dd"));
              setOpen(false);
            }}
            className="text-slate-900"
            classNames={{
              root: "w-full",
              months: "flex flex-col",
              month: "space-y-3",
              caption: "flex items-center justify-between gap-2 px-1",
              caption_label: "text-sm font-semibold text-slate-900",
              nav: "flex items-center gap-1",
              button_previous:
                "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
              button_next:
                "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
              month_grid: "w-full border-collapse",
              weekdays: "grid grid-cols-7 gap-1",
              week: "grid grid-cols-7 gap-1 mt-1",
              head_cell:
                "h-8 w-9 text-center text-xs font-medium uppercase tracking-[0.08em] text-slate-400",
              cell: "h-9 w-9",
              day: "h-9 w-9 rounded-xl text-sm text-slate-700 hover:bg-slate-100",
              selected:
                "bg-brand-600 text-white hover:bg-brand-600 hover:text-white",
              today: "border border-brand-200 text-brand-700",
              outside: "text-slate-300",
              disabled: "text-slate-200"
            }}
            components={{
              Chevron: ({ orientation }) =>
                orientation === "left" ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
