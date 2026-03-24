import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

function LanguageChart({ languages }) {

  if (!languages) return null;

  // Convert object → array
  const data = Object.entries(languages).map(
    ([name, value]) => ({
      name,
      value
    })
  );

  // Colors for chart
  const COLORS = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#3b82f6",
    "#a855f7"
  ];

  return (
    <div className="bg-black/60 backdrop-blur-md border border-red-900 rounded-2xl shadow-lg p-6">

      <h3 className="text-lg font-semibold text-white mb-4">
        Languages Used
      </h3>

      <div className="w-full h-52">

        <ResponsiveContainer>

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label
            >

              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}

            </Pie>

            <Tooltip />
            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default LanguageChart;