/* ── DATA ─────────────────────────────────────────────────────────── */
const dashboardData = {
  "7d": {
    periodLabel: "Last 7 days",
    kpis: [
      { title: "Revenue", value: "$12.4K", change: "+8.4%" },
      { title: "Users", value: "2,184", change: "+4.9%" },
      { title: "Conversion", value: "3.8%", change: "+0.7%" },
      { title: "Retention", value: "74%", change: "-1.2%" },
    ],
    revenue: [1200, 1600, 1400, 2100, 1800, 2200, 2400],
  },
  "30d": {
    periodLabel: "Last 30 days",
    kpis: [
      { title: "Revenue", value: "$49.8K", change: "+14.2%" },
      { title: "Users", value: "8,241", change: "+11.1%" },
      { title: "Conversion", value: "4.1%", change: "+0.9%" },
      { title: "Retention", value: "77%", change: "+2.6%" },
    ],
    revenue: [900, 1300, 1600, 1800, 2200, 2400, 2700, 2900, 3200, 3400],
  },
  "90d": {
    periodLabel: "Last 90 days",
    kpis: [
      { title: "Revenue", value: "$134.6K", change: "+28.7%" },
      { title: "Users", value: "24,530", change: "+19.4%" },
      { title: "Conversion", value: "4.4%", change: "+1.1%" },
      { title: "Retention", value: "80%", change: "+3.3%" },
    ],
    revenue: [
      700, 1100, 1300, 1700, 1900, 2100, 2500, 2800, 3100, 3600, 3900, 4200,
    ],
  },
};

/* ── DOM REFS ─────────────────────────────────────────────────────── */
const kpiCards = document.getElementById("kpiCards");
const periodLabel = document.getElementById("periodLabel");
const chartCanvas = document.getElementById("revenueChart");
const themeToggle = document.getElementById("themeToggle");
const periodButtons = document.querySelectorAll(".period-btn");
const ctx = chartCanvas.getContext("2d");
let activePeriod = "7d";

/* ── HELPERS ──────────────────────────────────────────────────────── */
/**
 * Read a computed CSS custom property at call-time.
 * This ensures the canvas always uses the current theme's palette,
 * fixing the bug where chart colors were stale after toggling.
 */
function getCssVar(name) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

/* ── THEME ────────────────────────────────────────────────────────── */
function updateThemeIcon() {
  const isDark = document.body.classList.contains("dark");
  themeToggle.setAttribute("aria-pressed", String(isDark));
  // Re-create Lucide icons so SVG strokes inherit updated CSS variables
}

function applySavedTheme() {
  const saved = localStorage.getItem("dashboard-theme");
  const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = saved ? saved === "dark" : preferDark;
  document.body.classList.toggle("dark", dark);
  updateThemeIcon();
}

function toggleTheme() {
  const goingDark = !document.body.classList.contains("dark");
  document.body.classList.toggle("dark", goingDark);
  localStorage.setItem("dashboard-theme", goingDark ? "dark" : "light");
  updateThemeIcon();
  // Redraw chart so canvas picks up the new CSS variable values
  renderRevenueChart(dashboardData[activePeriod].revenue);
}

themeToggle.addEventListener("click", toggleTheme);

/* ── KPI CARDS ────────────────────────────────────────────────────── */
function renderKpiCards(data) {
  kpiCards.innerHTML = "";
  data.forEach((kpi) => {
    const card = document.createElement("article");
    card.className = "kpi-card";

    const title = document.createElement("p");
    title.className = "kpi-title";
    title.textContent = kpi.title;

    const value = document.createElement("p");
    value.className = "kpi-value";
    value.textContent = kpi.value;

    const change = document.createElement("span");
    const isUp = kpi.change.startsWith("+");
    change.className = `kpi-change ${isUp ? "up" : "down"}`;
    change.textContent = (isUp ? "▲ " : "▼ ") + kpi.change;

    card.append(title, value, change);
    kpiCards.appendChild(card);
  });
}

/* ── CHART ────────────────────────────────────────────────────────── */
function renderRevenueChart(series) {
  const dpr = window.devicePixelRatio || 1;
  const rect = chartCanvas.getBoundingClientRect();
  const W = rect.width || 800;
  const H = rect.height || 200;

  chartCanvas.width = Math.round(W * dpr);
  chartCanvas.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  // Read live CSS variables — always in sync with current theme
  const accent = getCssVar("--accent");
  const borderColor = getCssVar("--border");
  const mutedColor = getCssVar("--text-muted");

  const PAD_B = 28;
  const PAD_T = 10;
  const usableH = H - PAD_T - PAD_B;
  const max = Math.max(...series);
  const step = W / (series.length + 1);
  const barW = Math.min(44, step * 0.55);
  const GRID = 4;

  // Dashed grid lines + Y-axis labels
  for (let i = 1; i <= GRID; i++) {
    const y = PAD_T + usableH - (i / GRID) * usableH;

    ctx.beginPath();
    ctx.strokeStyle = borderColor || "rgba(100,116,139,0.15)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
    ctx.setLineDash([]);

    const labelVal = Math.round((i / GRID) * max);
    const label =
      labelVal >= 1000 ? `$${(labelVal / 1000).toFixed(1)}k` : `$${labelVal}`;
    ctx.fillStyle = mutedColor || "#94a3b8";
    ctx.font = "500 11px 'Segos UI', system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(label, 4, y - 4);
  }

  // Baseline
  ctx.beginPath();
  ctx.strokeStyle = borderColor || "rgba(100,116,139,0.15)";
  ctx.lineWidth = 1;
  ctx.moveTo(0, H - PAD_B);
  ctx.lineTo(W, H - PAD_B);
  ctx.stroke();

  // Bars with rounded top corners
  series.forEach((val, i) => {
    const barH = (val / max) * usableH;
    const x = step * (i + 1) - barW / 2;
    const y = PAD_T + usableH - barH;
    const r = Math.min(6, barW / 2);

    ctx.fillStyle = accent || "#2563eb";
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + barW - r, y);
    ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
    ctx.lineTo(x + barW, H - PAD_B);
    ctx.lineTo(x, H - PAD_B);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
  });
}

/* ── FILTER ───────────────────────────────────────────────────────── */
function filterDashboard(period) {
  activePeriod = period;
  const d = dashboardData[period];
  periodLabel.textContent = d.periodLabel;
  renderKpiCards(d.kpis);
  renderRevenueChart(d.revenue);
}

periodButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    periodButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    filterDashboard(btn.dataset.period);
  });
});

window.addEventListener("resize", () => {
  renderRevenueChart(dashboardData[activePeriod].revenue);
});

/* ── BOOT ─────────────────────────────────────────────────────────── */
applySavedTheme();
filterDashboard("7d");

document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();
  updateThemeIcon();
});
