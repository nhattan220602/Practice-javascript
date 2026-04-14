const dashboardData = {
    "7d": {
        periodLabel: "Last 7 days",
        kpis: [
            { title: "Revenue", value: "$12.4K", change: "+8.4%" },
            { title: "Users", value: "2,184", change: "+4.9%" },
            { title: "Conversion", value: "3.8%", change: "+0.7%" },
            { title: "Retention", value: "74%", change: "-1.2%" }
        ],
        revenue: [1200, 1600, 1400, 2100, 1800, 2200, 2400]
    },
    "30d": {
        periodLabel: "Last 30 days",
        kpis: [
            { title: "Revenue", value: "$49.8K", change: "+14.2%" },
            { title: "Users", value: "8,241", change: "+11.1%" },
            { title: "Conversion", value: "4.1%", change: "+0.9%" },
            { title: "Retention", value: "77%", change: "+2.6%" }
        ],
        revenue: [900, 1300, 1600, 1800, 2200, 2400, 2700, 2900, 3200, 3400]
    },
    "90d": {
        periodLabel: "Last 90 days",
        kpis: [
            { title: "Revenue", value: "$134.6K", change: "+28.7%" },
            { title: "Users", value: "24,530", change: "+19.4%" },
            { title: "Conversion", value: "4.4%", change: "+1.1%" },
            { title: "Retention", value: "80%", change: "+3.3%" }
        ],
        revenue: [700, 1100, 1300, 1700, 1900, 2100, 2500, 2800, 3100, 3600, 3900, 4200]
    }
};

const kpiCards = document.getElementById("kpiCards");
const periodLabel = document.getElementById("periodLabel");
const chartCanvas = document.getElementById("revenueChart");
const themeToggle = document.getElementById("themeToggle");
const periodButtons = document.querySelectorAll(".period-btn");
const chartContext = chartCanvas.getContext("2d");

function renderKpiCards(kpiData) {
    kpiCards.innerHTML = "";
    kpiData.forEach((kpi) => {
        const card = document.createElement("article");
        card.className = "kpi-card";

        const title = document.createElement("p");
        title.className = "kpi-title";
        title.textContent = kpi.title;

        const value = document.createElement("p");
        value.className = "kpi-value";
        value.textContent = kpi.value;

        const change = document.createElement("p");
        change.className = `kpi-change ${kpi.change.startsWith("+") ? "up" : "down"}`;
        change.textContent = kpi.change;

        card.append(title, value, change);
        kpiCards.appendChild(card);
    });
}

function renderRevenueChart(series) {
    const width = chartCanvas.width;
    const height = chartCanvas.height;
    chartContext.clearRect(0, 0, width, height);

    const max = Math.max(...series);
    const gap = width / (series.length + 1);
    const barWidth = Math.min(46, gap * 0.6);

    chartContext.fillStyle = getComputedStyle(document.body).getPropertyValue("--border");
    chartContext.fillRect(0, height - 28, width, 1);

    series.forEach((value, index) => {
        const barHeight = (value / max) * (height - 50);
        const x = gap * (index + 1) - barWidth / 2;
        const y = height - barHeight - 28;

        chartContext.fillStyle = getComputedStyle(document.body).getPropertyValue("--accent");
        chartContext.fillRect(x, y, barWidth, barHeight);
    });
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem("dashboard-theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    }
}

function toggleTheme() {
    document.body.classList.toggle("dark");
    const nextValue = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("dashboard-theme", nextValue);
}

function filterDashboard(period) {
    const selected = dashboardData[period];
    periodLabel.textContent = selected.periodLabel;
    renderKpiCards(selected.kpis);
    renderRevenueChart(selected.revenue);
}

periodButtons.forEach((button) => {
    button.addEventListener("click", () => {
        periodButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        filterDashboard(button.dataset.period);
    });
});

themeToggle.addEventListener("click", () => {
    toggleTheme();
    const active = document.querySelector(".period-btn.active");
    filterDashboard(active.dataset.period);
});

applySavedTheme();
filterDashboard("7d");
