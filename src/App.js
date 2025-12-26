import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "billion_tracker_v2";

export default function App() {
  const GOAL = 1_000_000_000;

  const MILESTONES = [
    { label: "$1 Million", value: 1_000_000 },
    { label: "$10 Million", value: 10_000_000 },
    { label: "$100 Million", value: 100_000_000 },
    { label: "$1 Billion", value: 1_000_000_000 },
  ];

  const [netWorth, setNetWorth] = useState(0);
  const [history, setHistory] = useState([]);

  const hasLoaded = useRef(false);

  // LOAD DATA (run once)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setNetWorth(parsed.netWorth || 0);
        setHistory(parsed.history || []);
      }
    } catch (e) {
      console.error("Failed to load data", e);
    }
    hasLoaded.current = true;
  }, []);

  // SAVE DATA (only after load)
  useEffect(() => {
    if (!hasLoaded.current) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ netWorth, history }));
    } catch (e) {
      console.error("Failed to save data", e);
    }
  }, [netWorth, history]);

  const progress = Math.min(100, (netWorth / GOAL) * 100);

  const addAmount = (type) => {
    const val = prompt(`Enter ${type} amount ($)`);
    if (!val || isNaN(val)) return;

    const amount = Number(val);
    const change = type === "Income" ? amount : -amount;

    setNetWorth((prev) => prev + change);
    setHistory((prev) => [
      {
        id: Date.now(),
        type,
        amount,
        date: new Date().toLocaleDateString(),
      },
      ...prev,
    ]);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #020617)",
        color: "white",
        padding: 20,
        fontFamily: "system-ui",
      }}
    >
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <h1 style={{ fontSize: 26, fontWeight: 700 }}>
          💎 Billion Dollar Tracker
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: 24 }}>
          Track your way to $1B
        </p>

        <div
          style={{
            background: "#020617",
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 14, color: "#94a3b8" }}>
            Current Net Worth
          </div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>
            ${netWorth.toLocaleString()}
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>
              Progress to $1B — {progress.toFixed(4)}%
            </div>
            <div
              style={{
                height: 8,
                background: "#1e293b",
                borderRadius: 8,
                marginTop: 6,
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "#22c55e",
                  borderRadius: 8,
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <button onClick={() => addAmount("Income")} style={btn("#16a34a")}>
            + Add Income
          </button>
          <button onClick={() => addAmount("Expense")} style={btn("#dc2626")}>
            − Add Expense
          </button>
        </div>

        <h3 style={{ fontSize: 16, marginBottom: 10 }}>🎯 Milestones to $1B</h3>

        {MILESTONES.map((m) => {
          const reached = netWorth >= m.value;
          return (
            <div
              key={m.value}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 12px",
                marginBottom: 8,
                borderRadius: 10,
                background: reached ? "#052e16" : "#020617",
                border: reached ? "1px solid #22c55e" : "1px solid #1e293b",
              }}
            >
              <span>{m.label}</span>
              <span style={{ color: reached ? "#22c55e" : "#94a3b8" }}>
                {reached ? "Completed" : "Pending"}
              </span>
            </div>
          );
        })}

        <p
          style={{
            marginTop: 30,
            fontSize: 12,
            color: "#64748b",
            textAlign: "center",
          }}
        >
          ⚠️ IMPORTANT: Install this app (Add to Home Screen) to keep data
          permanently.
        </p>
      </div>
    </div>
  );
}

function btn(bg) {
  return {
    flex: 1,
    background: bg,
    color: "white",
    border: "none",
    padding: "14px 10px",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 600,
  };
}
