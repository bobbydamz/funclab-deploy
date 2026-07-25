"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

const ACCENT = "#4bb4b4";
const ACCENT_DARK = "#0f5252";
const MUTED = "#6b6b66";
const BORDER = "#e8e4de";

function CurrencyTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#1a1a1a",
        color: "#fff",
        padding: "8px 12px",
        borderRadius: 6,
        fontSize: 12,
        boxShadow: "0 4px 16px rgba(0,0,0,.25)",
      }}
    >
      <div style={{ opacity: 0.7, marginBottom: 2 }}>{label}</div>
      <div style={{ fontWeight: 700 }}>Rs. {payload[0].value.toLocaleString("en-IN")}</div>
    </div>
  );
}

export function RevenueChart({ data }: { data: { label: string; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ACCENT} stopOpacity={0.28} />
            <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: MUTED }} axisLine={{ stroke: BORDER }} tickLine={false} />
        <YAxis
          tick={{ fontSize: 11, fill: MUTED }}
          axisLine={false}
          tickLine={false}
          width={40}
          tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : String(v))}
        />
        <Tooltip content={<CurrencyTooltip />} />
        <Area type="monotone" dataKey="revenue" stroke={ACCENT_DARK} strokeWidth={2} fill="url(#revenueFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function TopProductsChart({ data }: { data: { name: string; qty: number }[] }) {
  if (data.length === 0) {
    return <div className="empty">No sales data yet.</div>;
  }
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={BORDER} horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11, fill: MUTED }}
          axisLine={false}
          tickLine={false}
          width={110}
        />
        <Tooltip
          cursor={{ fill: "rgba(75,180,180,0.08)" }}
          contentStyle={{ background: "#1a1a1a", border: "none", borderRadius: 6, fontSize: 12 }}
          labelStyle={{ color: "#fff" }}
          itemStyle={{ color: "#fff" }}
        />
        <Bar dataKey="qty" fill={ACCENT} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
