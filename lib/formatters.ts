import { format, parseISO } from "date-fns";

export function formatCurrency(value: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatDateDisplay(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  return format(parseISO(value), "dd-MM-yyyy");
}
