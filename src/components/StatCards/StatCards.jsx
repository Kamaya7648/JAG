import "./StatCards.css";
import { useEffect, useState } from "react";
import {
  FaCarSide,
  FaTools,
  FaCheckCircle,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { useApp } from "../../context/AppContext";

const DAILY_KEY = "gms_daily_history";
const MONTHLY_KEY = "gms_monthly_history";

function dateKey(d) {
  return d.toISOString().split("T")[0];
}

function monthKey(d) {
  return `${d.getFullYear()}-${d.getMonth() + 1}`;
}

function loadJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveJSON(key, obj) {
  try {
    localStorage.setItem(key, JSON.stringify(obj));
  } catch {}
}

function StatCards() {
  const { vehicles } = useApp();
  const [compare, setCompare] = useState({
    vehiclesToday: null,
    inRepair: null,
    completed: null,
    revenue: null,
  });

  const todayStr = dateKey(new Date());
  const vehiclesToday = vehicles.filter(
    (v) => v.createdAt && dateKey(new Date(v.createdAt)) === todayStr
  ).length;
  const inRepair = vehicles.filter((v) => v.status === "Repairing").length;
  const completed = vehicles.filter((v) => v.status === "Completed").length;
  const monthlyRevenue = vehicles
    .filter((v) => v.status === "Completed")
    .reduce((sum, v) => sum + (v.revenue || 0), 0);

  useEffect(() => {
    const now = new Date();
    const today = dateKey(now);

    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = dateKey(yesterdayDate);

    const lastMonthDate = new Date(now);
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    const currentMonth = monthKey(now);
    const lastMonth = monthKey(lastMonthDate);

    const daily = loadJSON(DAILY_KEY);
    const monthly = loadJSON(MONTHLY_KEY);

    daily[today] = { vehiclesToday, inRepair, completed };
    saveJSON(DAILY_KEY, daily);

    if (!monthly[currentMonth]) monthly[currentMonth] = { revenue: 0 };
    monthly[currentMonth].revenue = monthlyRevenue;
    saveJSON(MONTHLY_KEY, monthly);

    const yData = daily[yesterday];
    const lmData = monthly[lastMonth];

    const pct = (todayVal, prevVal) => {
      if (prevVal === undefined || prevVal === null) return null;
      if (prevVal === 0) return todayVal === 0 ? 0 : 100;
      return Math.round(((todayVal - prevVal) / prevVal) * 100);
    };

    setCompare({
      vehiclesToday: pct(vehiclesToday, yData?.vehiclesToday),
      inRepair: pct(inRepair, yData?.inRepair),
      completed: pct(completed, yData?.completed),
      revenue: pct(monthlyRevenue, lmData?.revenue),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehiclesToday, inRepair, completed, monthlyRevenue]);

  const renderChange = (change, periodLabel) => {
    if (change === null) {
      return <span className="stat-change neutral">No data from {periodLabel}</span>;
    }
    const isUp = change >= 0;
    return (
      <span className={`stat-change ${isUp ? "up" : "down"}`}>
        {isUp ? <FaArrowUp /> : <FaArrowDown />} {Math.abs(change)}% from {periodLabel}
      </span>
    );
  };

  const cards = [
    {
      label: "Vehicles Today",
      value: vehiclesToday,
      icon: <FaCarSide />,
      color: "#3B82F6",
      change: renderChange(compare.vehiclesToday, "yesterday"),
    },
    {
      label: "In Repair",
      value: inRepair,
      icon: <FaTools />,
      color: "#F97316",
      change: renderChange(compare.inRepair, "yesterday"),
    },
    {
      label: "Completed",
      value: completed,
      icon: <FaCheckCircle />,
      color: "#22C55E",
      change: renderChange(compare.completed, "yesterday"),
    },
    {
      label: "Monthly Revenue",
      value: `Rs. ${monthlyRevenue.toLocaleString()}`,
      icon: <FaChartLine />,
      color: "#8B5CF6",
      change: renderChange(compare.revenue, "last month"),
    },
  ];

  return (
    <div className="stat-cards">
      {cards.map((c) => (
        <div className="stat-card" key={c.label}>
          <div className="stat-icon" style={{ background: c.color }}>{c.icon}</div>
          <div className="stat-text">
            <h3>{c.value}</h3>
            <p>{c.label}</p>
            {c.change}
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatCards;
