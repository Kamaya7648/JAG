import garageLogoNavy from "../assets/icons/garage-logo-navy.svg";
import { useState, useMemo, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Calendar,
  FileDown,
  Download,
  ChevronDown,
  FileText,
  Filter,
  Repeat2,
  Layers,
  FileBarChart,
  ChevronRight,
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

/* ---------------- helpers ---------------- */

const STATUS_CONFIG = {
  Completed: "var(--green)",
  Repairing: "var(--steel-light)",
  Received: "var(--amber)",
  Diagnosis: "var(--rust)",
  "Quality Check": "var(--steel-light)",
};

const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function formatDateKey(date) {
  const d = new Date(date);

  if (Number.isNaN(d.getTime())) return "";

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDay(date) {
  const d = new Date(date);

  return `${DAY_LABELS[d.getDay()]} ${d.getDate()}`;
}

function getDaysBetween(fromStr, toStr) {
  const from = new Date(`${fromStr}T00:00:00`);
  const to = new Date(`${toStr}T00:00:00`);

  if (
    Number.isNaN(from.getTime()) ||
    Number.isNaN(to.getTime()) ||
    from > to
  ) {
    return [];
  }

  const days = [];
  const current = new Date(from);

  let guard = 0;

  while (current <= to && guard < 366) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
    guard++;
  }

  return days;
}

function getVehicleRevenue(vehicle) {
  const revenue = Number(vehicle?.revenue);

  return Number.isFinite(revenue) ? revenue : 0;
}

function downloadCSV(trend, kpis, vehicles) {
  const lines = [
    ["JAG Garage Management System - Report"],
    [],
    ["Metric", "Value"],
    ...kpis.map((k) => [k.label, k.value]),
    [],
    ["Date", "Jobs", "Revenue (LKR)"],
    ...trend.map((t) => [t.day, t.jobs, t.revenue]),
    [],
    [
      "Vehicle ID",
      "Vehicle Model",
      "Number Plate",
      "Status",
      "Customer Name",
      "Revenue",
    ],
    ...vehicles.map((v) => [
      v.id || v.vehicleId || "",
      v.model || "",
      v.plate || v.numberPlate || "",
      v.status || "",
      v.customerName || "",
      getVehicleRevenue(v),
    ]),
  ];

  const csv = lines
    .map((row) =>
      row
        .map((cell) =>
          `"${String(cell).replace(/"/g, '""')}"`
        )
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "jag-garage-report.csv";

  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

/* ---------------- gauge helper ---------------- */

function Gauge_({ pct, color }) {
  const safePct = Math.max(0, Math.min(100, pct || 0));

  const bg = `conic-gradient(
    ${color} ${safePct * 3.6}deg,
    var(--panel-alt) 0deg
  )`;

  return (
    <div
      className="gd-gauge-ring"
      style={{ background: bg }}
    >
      <span className="gd-gauge-val">{safePct}%</span>
    </div>
  );
}

/* ---------------- app ---------------- */

export default function ReportGeneration() {
  const { token } = useApp();

  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    if (!token) {
      return;
    }

    fetch("http://localhost:5000/api/vehicles", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch vehicles");
        }

        return res.json();
      })
      .then((data) => {
        setVehicles(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Report vehicle fetch error:", err);
        setVehicles([]);
      });
  }, [token]);

  const allVehicles = vehicles;

  const today = new Date();

  const defaultFrom = new Date(today);
  defaultFrom.setDate(today.getDate() - 6);

  const [dateFrom, setDateFrom] = useState(
    formatDateKey(defaultFrom)
  );

  const [dateTo, setDateTo] = useState(
    formatDateKey(today)
  );

  const [exportOpen, setExportOpen] = useState(false);
  const [reportType, setReportType] = useState("");
  const [groupBy, setGroupBy] = useState("");
  const [serviceFilter, setServiceFilter] = useState(
    "All Services"
  );
  const [mechanicFilter, setMechanicFilter] = useState(
    "All Mechanics"
  );
  const [statusFilter, setStatusFilter] = useState(
    "All Status"
  );

  const filteredVehicles = useMemo(() => {
    const from = new Date(`${dateFrom}T00:00:00`);
    const to = new Date(`${dateTo}T23:59:59`);

    return allVehicles.filter((vehicle) => {
      if (!vehicle.createdAt) return false;

      const created = new Date(vehicle.createdAt);

      if (Number.isNaN(created.getTime())) return false;

      if (created < from || created > to) return false;

      if (
        statusFilter !== "All Status" &&
        vehicle.status !== statusFilter
      ) {
        return false;
      }

      return true;
    });
  }, [
    allVehicles,
    dateFrom,
    dateTo,
    statusFilter,
  ]);

  const trend = useMemo(() => {
    const days = getDaysBetween(dateFrom, dateTo);

    return days.map((day) => {
      const key = formatDateKey(day);

      const dayVehicles = filteredVehicles.filter(
        (vehicle) =>
          vehicle.createdAt &&
          formatDateKey(vehicle.createdAt) === key
      );

      const revenue = dayVehicles
        .filter(
          (vehicle) => vehicle.status === "Completed"
        )
        .reduce(
          (sum, vehicle) =>
            sum + getVehicleRevenue(vehicle),
          0
        );

      return {
        date: key,
        day: formatDay(day),
        jobs: dayVehicles.length,
        revenue,
      };
    });
  }, [
    filteredVehicles,
    dateFrom,
    dateTo,
  ]);

  const kpis = useMemo(() => {
    const totalJobs = filteredVehicles.length;

    const completed = filteredVehicles.filter(
      (vehicle) => vehicle.status === "Completed"
    ).length;

    const pending = filteredVehicles.filter(
      (vehicle) =>
        vehicle.status !== "Completed"
    ).length;

    const customers = new Set(
      filteredVehicles
        .map(
          (vehicle) =>
            vehicle.customerName ||
            vehicle.customer?.name
        )
        .filter(Boolean)
    ).size;

    return [
      {
        label: "Total Jobs",
        value: String(totalJobs),
        pct: totalJobs > 0 ? 100 : 0,
        color: "var(--steel-light)",
        delta: null,
        positive: true,
      },
      {
        label: "Completed",
        value: String(completed),
        pct:
          totalJobs > 0
            ? Math.round(
                (completed / totalJobs) * 100
              )
            : 0,
        color: "var(--green)",
        delta: null,
        positive: true,
      },
      {
        label: "Pending",
        value: String(pending),
        pct:
          totalJobs > 0
            ? Math.round(
                (pending / totalJobs) * 100
              )
            : 0,
        color: "var(--amber)",
        delta: null,
        positive: false,
      },
      {
        label: "Customers",
        value: String(customers),
        pct:
          totalJobs > 0
            ? Math.round(
                (customers / totalJobs) * 100
              )
            : 0,
        color: "var(--rust)",
        delta: null,
        positive: true,
      },
    ];
  }, [filteredVehicles]);

  const statusData = useMemo(() => {
    const counts = {};

    filteredVehicles.forEach((vehicle) => {
      const status = vehicle.status || "Unknown";

      counts[status] = (counts[status] || 0) + 1;
    });

    return Object.entries(counts).map(
      ([label, value]) => ({
        label,
        value,
        pct:
          filteredVehicles.length > 0
            ? Number(
                (
                  (value /
                    filteredVehicles.length) *
                  100
                ).toFixed(1)
              )
            : 0,
        color:
          STATUS_CONFIG[label] ||
          "var(--steel-light)",
      })
    );
  }, [filteredVehicles]);

  const revenueTotal = useMemo(
    () =>
      trend.reduce(
        (sum, item) => sum + item.revenue,
        0
      ),
    [trend]
  );

  const serviceCategories = useMemo(() => {
    const categories = {};

    filteredVehicles.forEach((vehicle) => {
      const category =
        vehicle.serviceType ||
        vehicle.service ||
        vehicle.category;

      if (!category) return;

      categories[category] =
        (categories[category] || 0) + 1;
    });

    const total = Object.values(categories).reduce(
      (sum, value) => sum + value,
      0
    );

    return Object.entries(categories)
      .map(([name, value]) => ({
        name,
        value,
        pct:
          total > 0
            ? Number(
                ((value / total) * 100).toFixed(1)
              )
            : 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [filteredVehicles]);

  const mechanics = useMemo(() => {
    const data = {};

    filteredVehicles.forEach((vehicle) => {
      const mechanic =
        vehicle.mechanicName ||
        vehicle.mechanic?.name ||
        vehicle.assignedMechanic;

      if (!mechanic) return;

      if (!data[mechanic]) {
        data[mechanic] = {
          name: mechanic,
          completed: 0,
          pending: 0,
        };
      }

      if (vehicle.status === "Completed") {
        data[mechanic].completed++;
      } else {
        data[mechanic].pending++;
      }
    });

    return Object.values(data).slice(0, 5);
  }, [filteredVehicles]);

  const availableStatuses = useMemo(() => {
    return [
      ...new Set(
        allVehicles
          .map((vehicle) => vehicle.status)
          .filter(Boolean)
      ),
    ];
  }, [allVehicles]);

  const availableMechanics = useMemo(() => {
    return [
      ...new Set(
        allVehicles
          .map(
            (vehicle) =>
              vehicle.mechanicName ||
              vehicle.mechanic?.name ||
              vehicle.assignedMechanic
          )
          .filter(Boolean)
      ),
    ];
  }, [allVehicles]);

  const handlePrint = () => {
    setExportOpen(false);
    window.dispatchEvent(new Event("resize"));

    setTimeout(() => {
      window.print();
    }, 200);
  };

  const handleCsv = () => {
    setExportOpen(false);

    downloadCSV(
      trend,
      kpis,
      filteredVehicles
    );
  };

  const reportStatusOptions =
    statusData.length > 0
      ? statusData
      : [];

  return (
    <main className="main-panel gd-root">
      <img
        src={garageLogoNavy}
        alt="JAG"
        className="gd-print-logo"
      />

      <div className="gd-body">
        <div className="gd-toolbar">
          <div className="gd-range">
            <Calendar size={13} />

            <input
              type="date"
              value={dateFrom}
              onChange={(e) =>
                setDateFrom(e.target.value)
              }
              max={dateTo}
            />

            <span className="gd-range-sep">
              –
            </span>

            <input
              type="date"
              value={dateTo}
              onChange={(e) =>
                setDateTo(e.target.value)
              }
              min={dateFrom}
            />
          </div>

          <div className="gd-export-wrap">
            <button
              className="gd-export"
              onClick={() =>
                setExportOpen((v) => !v)
              }
            >
              <FileDown size={14} />
              Export Dashboard
              <ChevronDown size={13} />
            </button>

            {exportOpen && (
              <div className="gd-export-menu">
                <div
                  className="gd-export-item"
                  onClick={handlePrint}
                >
                  <FileDown size={14} />
                  Export as PDF
                </div>

                <div
                  className="gd-export-item"
                  onClick={handleCsv}
                >
                  <Download size={14} />
                  Export as CSV
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="gd-layout">
          <div className="gd-content">
            <div className="gd-gauges">
              {kpis.map((k) => (
                <div
                  className="gd-gauge-card"
                  key={k.label}
                >
                  <Gauge_
                    pct={k.pct}
                    color={k.color}
                  />

                  <div>
                    <div className="gd-gauge-label">
                      {k.label}
                    </div>

                    <div className="gd-gauge-num gd-mono">
                      {k.value}
                    </div>

                    <div className="gd-gauge-delta gd-neutral">
                      {k.delta === null
                        ? "Real data"
                        : k.delta}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="gd-panels">
              <div className="gd-panel">
                <div className="gd-panel-head">
                  <span className="gd-panel-title">
                    Service Trend — Selected Period
                  </span>

                  <span className="gd-panel-sub">
                    JOBS / REVENUE (LKR)
                  </span>
                </div>

                <ResponsiveContainer
                  width="100%"
                  height={200}
                >
                  <AreaChart
                    data={trend}
                    margin={{
                      left: -20,
                      right: 10,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="jobsFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#3C5A85"
                          stopOpacity={0.55}
                        />
                        <stop
                          offset="100%"
                          stopColor="#3C5A85"
                          stopOpacity={0}
                        />
                      </linearGradient>

                      <linearGradient
                        id="revFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#F0862F"
                          stopOpacity={0.45}
                        />
                        <stop
                          offset="100%"
                          stopColor="#F0862F"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      stroke="#E2E4E9"
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="day"
                      tick={{
                        fill: "#6B7280",
                        fontSize: 10.5,
                        fontFamily:
                          "IBM Plex Mono",
                      }}
                      axisLine={{
                        stroke: "#E2E4E9",
                      }}
                      tickLine={false}
                    />

                    <YAxis
                      tick={{
                        fill: "#6B7280",
                        fontSize: 10.5,
                        fontFamily:
                          "IBM Plex Mono",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        background: "#FFFFFF",
                        border: "1px solid #E2E4E9",
                        borderRadius: 6,
                        fontSize: 12,
                      }}
                      labelStyle={{
                        color: "#16181C",
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="jobs"
                      stroke="#3C5A85"
                      strokeWidth={2}
                      fill="url(#jobsFill)"
                    />

                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#F0862F"
                      strokeWidth={2}
                      fill="url(#revFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="gd-panel">
                <div className="gd-panel-head">
                  <span className="gd-panel-title">
                    Jobs by Status
                  </span>
                </div>

                {reportStatusOptions.length >
                0 ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <ResponsiveContainer
                      width={110}
                      height={110}
                    >
                      <PieChart>
                        <Pie
                          data={reportStatusOptions}
                          dataKey="value"
                          nameKey="label"
                          innerRadius={32}
                          outerRadius={52}
                          paddingAngle={2}
                        >
                          {reportStatusOptions.map(
                            (s) => (
                              <Cell
                                key={s.label}
                                style={{
                                  fill: s.color,
                                }}
                              />
                            )
                          )}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>

                    <div
                      className="gd-status-list"
                      style={{ flex: 1 }}
                    >
                      {reportStatusOptions.map(
                        (s) => (
                          <div
                            className="gd-status-block"
                            key={s.label}
                          >
                            <div className="gd-status-row">
                              <span
                                className="gd-status-dot"
                                style={{
                                  background:
                                    s.color,
                                }}
                              />

                              <span className="gd-status-name">
                                {s.label}
                              </span>

                              <span className="gd-status-num">
                                {s.value}{" "}
                                <span
                                  style={{
                                    color:
                                      "var(--text-dim)",
                                  }}
                                >
                                  ({s.pct}%)
                                </span>
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="gd-empty">
                    No vehicle status data available.
                  </div>
                )}
              </div>
            </div>

            <div
              className="gd-panel"
              style={{ marginBottom: 16 }}
            >
              <div className="gd-panel-head">
                <span className="gd-panel-title">
                  Revenue — Selected Period
                </span>

                <span className="gd-panel-sub">
                  LKR PER DAY
                </span>
              </div>

              <ResponsiveContainer
                width="100%"
                height={160}
              >
                <BarChart
                  data={trend}
                  margin={{
                    left: -20,
                    right: 10,
                  }}
                >
                  <CartesianGrid
                    stroke="#E2E4E9"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="day"
                    tick={{
                      fill: "#6B7280",
                      fontSize: 10.5,
                      fontFamily:
                        "IBM Plex Mono",
                    }}
                    axisLine={{
                      stroke: "#E2E4E9",
                    }}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{
                      fill: "#6B7280",
                      fontSize: 10.5,
                      fontFamily:
                        "IBM Plex Mono",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#FFFFFF",
                      border: "1px solid #E2E4E9",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                    labelStyle={{
                      color: "#16181C",
                    }}
                  />

                  <Bar
                    dataKey="revenue"
                    fill="#F0862F"
                    radius={[
                      4,
                      4,
                      0,
                      0,
                    ]}
                  />
                </BarChart>
              </ResponsiveContainer>

              <div
                style={{
                  fontSize: 12.5,
                  color: "var(--text-dim)",
                  marginTop: 8,
                }}
              >
                Total revenue this period:{" "}
                <b
                  style={{
                    color: "var(--text)",
                    fontFamily:
                      "IBM Plex Mono, monospace",
                  }}
                >
                  Rs{" "}
                  {revenueTotal.toLocaleString()}
                </b>
              </div>
            </div>

            <div className="gd-lower">
              <div className="gd-panel">
                <div className="gd-panel-head">
                  <span className="gd-panel-title">
                    Service Categories
                  </span>

                  <span className="gd-panel-sub">
                    {filteredVehicles.length} VEHICLES
                  </span>
                </div>

                {serviceCategories.length > 0 ? (
                  serviceCategories.map((c) => (
                    <div
                      className="gd-cat-row"
                      key={c.name}
                    >
                      <span className="gd-cat-name">
                        {c.name}
                      </span>

                      <div className="gd-cat-track">
                        <div
                          className="gd-cat-fill"
                          style={{
                            width:
                              c.pct + "%",
                          }}
                        />
                      </div>

                      <span className="gd-cat-val">
                        {c.value} ({c.pct}%)
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="gd-empty">
                    No service category data available.
                  </div>
                )}
              </div>

              <div className="gd-panel">
                <div className="gd-panel-head">
                  <span className="gd-panel-title">
                    Mechanic Performance
                  </span>
                </div>

                {mechanics.length > 0 ? (
                  mechanics.map((m) => (
                    <div
                      className="gd-mech-row"
                      key={m.name}
                    >
                      <div className="gd-mech-avatar">
                        {m.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <span className="gd-mech-name">
                        {m.name}
                      </span>

                      <span className="gd-mech-stat">
                        {m.completed}✓
                      </span>

                      <span className="gd-mech-stat">
                        {m.pending}⧗
                      </span>

                      <span className="gd-mech-rating">
                        —
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="gd-empty">
                    No mechanic data available.
                  </div>
                )}

                {mechanics.length > 0 && (
                  <div className="gd-view-all">
                    View All Mechanics{" "}
                    <ChevronRight size={13} />
                  </div>
                )}
              </div>
            </div>

            <div className="gd-ticket-panel">
              <div className="gd-ticket-head">
                <span className="gd-panel-title">
                  Recent Generated Reports
                </span>

                <span className="gd-panel-sub">
                  WORK ORDER LOG
                </span>
              </div>

              <div className="gd-empty">
                No generated reports available.
              </div>
            </div>
          </div>

          <div className="gd-side">
            <div className="gd-form-panel">
              <div
                className="gd-form-title gd-display"
                style={{
                  textTransform: "none",
                  letterSpacing: 0,
                }}
              >
                Generate Report
              </div>

              <div className="gd-field">
                <div className="gd-field-label">
                  <FileText size={12} />
                  Report Type
                </div>

                <div className="gd-select-wrap">
                  <select
                    value={reportType}
                    onChange={(e) =>
                      setReportType(
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select report type
                    </option>
                    <option>
                      Jobs Completed
                    </option>
                    <option>
                      Revenue Summary
                    </option>
                    <option>
                      Mechanic Performance
                    </option>
                    <option>
                      Inventory Usage
                    </option>
                  </select>

                  <ChevronDown size={13} />
                </div>
              </div>

              <div className="gd-field">
                <div className="gd-field-label">
                  <Calendar size={12} />
                  Date Range
                </div>

                <div
                  className="gd-range"
                  style={{ width: "100%" }}
                >
                  <Calendar size={13} />

                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) =>
                      setDateFrom(
                        e.target.value
                      )
                    }
                    max={dateTo}
                  />

                  <span className="gd-range-sep">
                    –
                  </span>

                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) =>
                      setDateTo(e.target.value)
                    }
                    min={dateFrom}
                  />
                </div>
              </div>

              <div className="gd-field">
                <div className="gd-field-label">
                  <Layers size={12} />
                  Group By
                </div>

                <div className="gd-select-wrap">
                  <select
                    value={groupBy}
                    onChange={(e) =>
                      setGroupBy(
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select group by
                    </option>
                    <option>Day</option>
                    <option>Mechanic</option>
                    <option>
                      Service Type
                    </option>
                    <option>Branch</option>
                  </select>

                  <ChevronDown size={13} />
                </div>
              </div>

              <div className="gd-field">
                <div className="gd-field-label">
                  <Filter size={12} />
                  Filters
                </div>

                <div className="gd-field-row">
                  <div className="gd-select-wrap">
                    <select
                      value={serviceFilter}
                      onChange={(e) =>
                        setServiceFilter(
                          e.target.value
                        )
                      }
                    >
                      <option>
                        All Services
                      </option>

                      {serviceCategories.map(
                        (category) => (
                          <option
                            key={category.name}
                          >
                            {category.name}
                          </option>
                        )
                      )}
                    </select>

                    <ChevronDown size={13} />
                  </div>

                  <div className="gd-select-wrap">
                    <select
                      value={mechanicFilter}
                      onChange={(e) =>
                        setMechanicFilter(
                          e.target.value
                        )
                      }
                    >
                      <option>
                        All Mechanics
                      </option>

                      {availableMechanics.map(
                        (mechanic) => (
                          <option
                            key={mechanic}
                          >
                            {mechanic}
                          </option>
                        )
                      )}
                    </select>

                    <ChevronDown size={13} />
                  </div>
                </div>
              </div>

              <div
                className="gd-field"
                style={{ marginBottom: 18 }}
              >
                <div className="gd-field-label">
                  Status
                </div>

                <div className="gd-select-wrap">
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(
                        e.target.value
                      )
                    }
                  >
                    <option>
                      All Status
                    </option>

                    {availableStatuses.map(
                      (status) => (
                        <option
                          key={status}
                        >
                          {status}
                        </option>
                      )
                    )}
                  </select>

                  <ChevronDown size={13} />
                </div>
              </div>

              <button
                className="gd-btn-primary"
                onClick={handleCsv}
              >
                <FileBarChart size={15} />
                Generate Report
              </button>

              <button className="gd-btn-outline">
                <Repeat2 size={15} />
                Schedule Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}