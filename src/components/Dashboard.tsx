import { useEffect, useMemo, useState } from "react";
import {
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import "./Dashboard.css";

type SalesPoint = {
  time: string;
  ventes: number;
};

type ChannelShare = {
  name: string;
  value: number;
};

const CHANNEL_COLORS = ["#7dd3fc", "#f59e0b", "#a78bfa", "#34d399"];

const initialSales: SalesPoint[] = [
  { time: "08:00", ventes: 120 },
  { time: "09:00", ventes: 160 },
  { time: "10:00", ventes: 140 },
  { time: "11:00", ventes: 190 },
  { time: "12:00", ventes: 210 },
  { time: "13:00", ventes: 230 },
];

const initialShares: ChannelShare[] = [
  { name: "E-commerce", value: 42 },
  { name: "Mobile", value: 26 },
  { name: "Retail", value: 18 },
  { name: "Partenaires", value: 14 },
];

function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(value));
}

function useAnimatedNumber(target: number, duration = 700) {
  const [value, setValue] = useState(target);

  useEffect(() => {
    let animationFrame = 0;
    const startTime = performance.now();
    const startValue = value;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const nextValue = startValue + (target - startValue) * progress;
      setValue(nextValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(tick);
      }
    };

    animationFrame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return value;
}

export function Dashboard() {
  const [sales, setSales] = useState<SalesPoint[]>(initialSales);
  const [shares, setShares] = useState<ChannelShare[]>(initialShares);
  const [lastUpdate, setLastUpdate] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSales((currentSales) => {
        const lastPoint = currentSales[currentSales.length - 1];
        const nextHour = `${String((Number(lastPoint.time.slice(0, 2)) + 1) % 24).padStart(2, "0")}:00`;
        const nextValue = Math.max(
          90,
          Math.round(lastPoint.ventes + (Math.random() * 70 - 20)),
        );
        return [
          ...currentSales.slice(-7),
          { time: nextHour, ventes: nextValue },
        ];
      });

      setShares((currentShares) => {
        const updatedShares = currentShares.map((entry) => {
          const delta = Math.random() * 8 - 4;
          return {
            ...entry,
            value: Math.max(8, Math.round(entry.value + delta)),
          };
        });

        const total = updatedShares.reduce(
          (sum, entry) => sum + entry.value,
          0,
        );
        return updatedShares.map((entry) => ({
          ...entry,
          value: Math.round((entry.value / total) * 100),
        }));
      });

      setLastUpdate(new Date());
    }, 3000);

    return () => window.clearInterval(interval);
  }, []);

  const totalSales = useMemo(
    () => sales.reduce((sum, entry) => sum + entry.ventes, 0),
    [sales],
  );

  const averageSales = useMemo(
    () => totalSales / sales.length,
    [sales.length, totalSales],
  );

  const salesAnimation = useAnimatedNumber(totalSales);
  const averageAnimation = useAnimatedNumber(averageSales);
  const conversionAnimation = useAnimatedNumber(
    4.8 + (sales[sales.length - 1].ventes % 7) * 0.1,
    450,
  );

  return (
    <main className="dashboard-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Flux temps réel</p>
          <h1>Dashboard analytique dynamique</h1>
          <p className="hero-copy">
            Les données simulées arrivent toutes les 3 secondes pour illustrer
            une mise à jour fluide, sans rechargement de page, comme avec un
            WebSocket réel.
          </p>
        </div>

        <div className="hero-status">
          <span className="pulse" />
          <div>
            <p>Dernière synchronisation</p>
            <strong>{lastUpdate.toLocaleTimeString("fr-FR")}</strong>
          </div>
        </div>
      </section>

      <section className="metrics-grid" aria-label="Indicateurs clés">
        <article className="metric-card">
          <span>Ventes cumulées</span>
          <strong>{formatNumber(salesAnimation)}</strong>
        </article>
        <article className="metric-card">
          <span>Ventes moyennes</span>
          <strong>{formatNumber(averageAnimation)}</strong>
        </article>
        <article className="metric-card">
          <span>Taux de conversion</span>
          <strong>{conversionAnimation.toFixed(1)}%</strong>
        </article>
      </section>

      <section className="charts-grid">
        <article className="chart-card chart-card--wide">
          <div className="card-header">
            <div>
              <p className="card-label">Ventes</p>
              <h2>Évolution linéaire</h2>
            </div>
            <p className="card-caption">
              Mise à jour continue des points de données
            </p>
          </div>

          <div className="chart-frame">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart
                data={sales}
                margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="salesLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7dd3fc" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  stroke="rgba(255,255,255,0.55)"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.55)"
                  tickLine={false}
                  axisLine={false}
                  width={42}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(6, 11, 20, 0.92)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 16,
                    color: "#f5f7ff",
                  }}
                  cursor={{
                    stroke: "rgba(125, 211, 252, 0.2)",
                    strokeWidth: 2,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ventes"
                  stroke="url(#salesLine)"
                  strokeWidth={4}
                  dot={{ r: 4, strokeWidth: 2, fill: "#08111f" }}
                  activeDot={{ r: 7 }}
                  isAnimationActive
                  animationDuration={700}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="chart-card">
          <div className="card-header">
            <div>
              <p className="card-label">Répartition</p>
              <h2>Camembert des canaux</h2>
            </div>
            <p className="card-caption">
              Parts recalculées à chaque flux simulé
            </p>
          </div>

          <div className="chart-frame chart-frame--pie">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={shares}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={72}
                  outerRadius={112}
                  paddingAngle={3}
                  isAnimationActive
                  animationDuration={700}
                >
                  {shares.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={CHANNEL_COLORS[index % CHANNEL_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(6, 11, 20, 0.92)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 16,
                    color: "#f5f7ff",
                  }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>
    </main>
  );
}
