"use client";

import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

import type { ChartPoint, DistributionPoint, MonthlyTrendPoint } from "@/lib/types";
import { formatCompactCurrency } from "@/lib/formatters";

const PIE_COLORS = ["#326cff", "#0f766e", "#8b5cf6", "#f97316", "#0891b2", "#65a30d"];

export function GrowthLineChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 12, left: -24, bottom: 0 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(value) => formatCompactCurrency(value)} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value: number) => formatCompactCurrency(value)} />
          <Line type="monotone" dataKey="invested" stroke="#94a3b8" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="projected" stroke="#326cff" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DistributionChart({ data }: { data: DistributionPoint[] }) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={4}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => formatCompactCurrency(value)} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MonthlyTrendChart({ data }: { data: MonthlyTrendPoint[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 12, left: -24, bottom: 0 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(value) => formatCompactCurrency(value)} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value: number) => formatCompactCurrency(value)} />
          <Line type="monotone" dataKey="invested" stroke="#0f766e" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
