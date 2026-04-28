"use client";

import { useEffect, useRef, useState } from "react";
import { format, parseISO } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { formatDateDisplay } from "@/lib/formatters";
import { cn } from "@/lib/utils";

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
  const selectedDate = value ? parseISO(value) : undefined;

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

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
        <div className="absolute left-0 top-[calc(100%+0.5rem)] z-30 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl">
          <DayPicker
            mode="single"
            selected={selectedDate}
            captionLayout="dropdown"
            startMonth={new Date(2000, 0)}
            endMonth={new Date(new Date().getFullYear() + 20, 11)}
            onSelect={(date) => {
              if (!date) return;
              onChange(format(date, "yyyy-MM-dd"));
              setOpen(false);
            }}
            className="text-slate-900"
            classNames={{
              root: "w-[21.5rem]",
              months: "flex flex-col",
              month: "space-y-3",
              month_caption: "mb-3 grid grid-cols-[1fr_5.5rem_auto] items-center gap-2",
              dropdowns: "flex min-w-0 items-center gap-2",
              dropdown_root: "relative min-w-0",
              dropdown:
                "select select-sm h-9 min-h-0 w-full rounded-xl border-slate-200 bg-transparent pr-8 text-sm text-transparent focus:outline-none focus:ring-0",
              months_dropdown: "w-[8rem]",
              years_dropdown: "w-[5.5rem]",
              caption_label:
                "pointer-events-none absolute inset-0 inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 pr-8 text-sm text-slate-700",
              chevron: "h-4 w-4 text-slate-400",
              nav: "absolute right-3 flex w-[4.75rem] shrink-0 items-center justify-end gap-1",
              button_previous:
                "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50",
              button_next:
                "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50",
              month_grid: "w-full border-collapse",
              weekdays: "grid grid-cols-7 gap-1",
              weekday:
                "flex h-8 w-9 items-center justify-center text-xs font-semibold uppercase tracking-[0.08em] text-slate-400",
              week: "grid grid-cols-7 gap-1 mt-1",
              day: "h-9 w-9",
              day_button:
                "flex h-9 w-9 items-center justify-center rounded-xl text-sm text-slate-700 transition hover:bg-slate-100",
              selected:
                "bg-brand-600 text-white hover:bg-brand-600 hover:text-white",
              today: "border border-brand-200 text-brand-700",
              outside: "text-slate-300",
              disabled: "text-slate-200"
            }}
            components={{
              Chevron: ({ orientation, className: chevronClassName }) =>
                orientation === "left" ? (
                  <ChevronLeft className={cn("h-4 w-4", chevronClassName)} />
                ) : orientation === "right" ? (
                  <ChevronRight className={cn("h-4 w-4", chevronClassName)} />
                ) : (
                  <ChevronRight
                    className={cn(
                      "absolute right-3 h-4 w-4 rotate-90 text-slate-400",
                      chevronClassName
                    )}
                  />
                )
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
