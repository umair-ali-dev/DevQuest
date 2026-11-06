import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const ActivityChart = ({ activity = [], isLoading = false }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Coding Activity
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Unique problems solved this week
          </p>
        </div>

        <span className="rounded-lg bg-violet-100 px-3 py-2 text-xs font-bold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
          Last 7 Days
        </span>
      </div>

      <div className="h-64 w-full">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Loading activity...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activity}>
              <defs>
                <linearGradient
                  id="activityGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#8b5cf6"
                    stopOpacity={0.35}
                  />

                  <stop
                    offset="95%"
                    stopColor="#8b5cf6"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#94a3b8"
                opacity={0.15}
                vertical={false}
              />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                allowDecimals={false}
              />

              <Tooltip
                contentStyle={{
                  background: "#1e1b2e",
                  border: "1px solid #38334f",
                  borderRadius: "12px",
                  color: "#fff",
                }}
                formatter={(value) => [
                  value,
                  "Problems solved",
                ]}
              />

              <Area
                type="monotone"
                dataKey="solved"
                stroke="#8b5cf6"
                strokeWidth={3}
                fill="url(#activityGradient)"
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ActivityChart;
