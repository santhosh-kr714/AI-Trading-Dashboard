import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { useState } from "react";
import axios from "axios";
import CandleChart from "./components/CandleChart";

import {
  LayoutDashboard,
  Star,
  Wallet,
  Settings,
  Newspaper,
  Brain,
} from "lucide-react";

function App() {
  const [ticker, setTicker] = useState("RELIANCE.NS");
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [candleData, setCandleData] = useState([]);
  const [chartPeriod, setChartPeriod] = useState("1y");
  const [loading, setLoading] = useState(false);

  const loadChart = async (symbol, period) => {
    try {
      const chart = await axios.get(
  `https://ai-trading-dashboard-glj4.onrender.com/chart/${symbol}?period=${period}`
);

      setChartData(
        Array.isArray(chart.data)
          ? chart.data
          : []
      );
    } catch (err) {
      console.log(err);
      setChartData([]);
    }
  };

  const loadCandles = async (symbol, period) => {
    try {
      const res = await axios.get(
  `https://ai-trading-dashboard-glj4.onrender.com/candles/${symbol}?period=${period}`
);

      setCandleData(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (err) {
      console.log(err);
      setCandleData([]);
    }
  };

  const analyzeStock = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
  `https://ai-trading-dashboard-glj4.onrender.com/stock/${ticker}`
);
      setData(res.data);

      await loadChart(
        ticker,
        chartPeriod
      );

      await loadCandles(
        ticker,
        chartPeriod
      );
    } catch (err) {
      console.log(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <div style={sidebar}>
        <h2>📈 AI Trader</h2>

        <SidebarItem
          icon={<LayoutDashboard />}
          text="Dashboard"
        />

        <SidebarItem
          icon={<Star />}
          text="Watchlist"
        />

        <SidebarItem
          icon={<Wallet />}
          text="Portfolio"
        />

                <SidebarItem
          icon={<Settings />}
          text="Settings"
        />
      </div>

      <div style={main}>
        <h1 style={title}>
          AI Trading Dashboard
        </h1>

        <div style={searchArea}>
          <input
            value={ticker}
            onChange={(e) =>
              setTicker(e.target.value)
            }
            onKeyDown={(e) =>
              e.key === "Enter" &&
              analyzeStock()
            }
            style={searchBox}
            placeholder="RELIANCE.NS, TCS.NS, AAPL, TSLA, BTC-USD..."
          />

          <button
            style={button}
            onClick={analyzeStock}
          >
            {loading
              ? "Loading..."
              : "Analyze"}
          </button>
        </div>

        {!data && (
          <div style={empty}>
            📈 Search RELIANCE.NS,
            TCS.NS, AAPL, TSLA or
            BTC-USD
          </div>
        )}

        {data && (
          <>
            <div style={topGrid}>
              <Card
                title="💰 Price"
                value={`₹${data.current_price}`}
              />

              <Card
                title="📈 RSI"
                value={data.rsi}
              />

              <Card
                title="📉 Trend"
                value={data.trend}
              />

              <Card
                title="🎯 Confidence"
                value={`${data.confidence}%`}
              />
            </div>

            <div style={secondGrid}>
              <Card
                title="🧠 Signal"
                value={data.signal}
              />

              <Card
                title="🛑 Stop Loss"
                value={`₹${data.stop_loss}`}
              />

              <Card
                title="🚀 All Time High"
                value={`₹${data.all_time_high}`}
              />

              <Card
                title="📉 All Time Low"
                value={`₹${data.all_time_low}`}
              />
            </div>

            <div style={thirdGrid}>
              <Card
                title="🔥 52W High"
                value={`₹${data.high_52}`}
              />

              <Card
                title="❄️ 52W Low"
                value={`₹${data.low_52}`}
              />
            </div>

            <div style={glass}>
              <h2>
                📈 Historical Price Chart
              </h2>

              <div
                style={periodContainer}
              >
                {[
                  "1mo",
                  "3mo",
                  "6mo",
                  "1y",
                  "5y",
                  "max",
                ].map((p) => (
                                    <button
                    key={p}
                    style={{
                      ...periodButton,
                      background:
                        chartPeriod === p
                          ? "#6366f1"
                          : "rgba(255,255,255,0.1)",
                    }}
                    onClick={async () => {
                      setChartPeriod(p);

                      await loadChart(
                        ticker,
                        p
                      );

                      await loadCandles(
                        ticker,
                        p
                      );
                    }}
                  >
                    {p.toUpperCase()}
                  </button>
                ))}
              </div>

              <div
                style={{
                  width: "100%",
                  height: "450px",
                }}
              >
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <LineChart
                    data={chartData}
                  >
                    <CartesianGrid stroke="#334155" />

                    <XAxis
                      dataKey="date"
                      hide={
                        chartPeriod ===
                        "max"
                      }
                    />

                    <YAxis />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Candlestick Chart */}

            <div style={glass}>
              <h2>
                🕯️ Candlestick Chart
              </h2>

              <CandleChart
                data={candleData}
              />
            </div>

            {/* AI Verdict */}

            <div style={glass}>
              <h2>
                <Brain />
                &nbsp; AI Verdict
              </h2>

              <h1
                style={{
                  fontSize: "50px",
                  marginTop: "20px",
                }}
              >
                {data.signal}
              </h1>

              <p
                style={{
                  fontSize: "22px",
                  marginTop: "20px",
                }}
              >
                Confidence:
                {" "}
                {data.confidence}%
              </p>

              <p
                style={{
                  fontSize: "22px",
                  marginTop: "10px",
                }}
              >
                Trend:
                {" "}
                {data.trend}
              </p>

              <p
                style={{
                  fontSize: "22px",
                  marginTop: "10px",
                }}
              >
                News:{data.news_sentiment}
              </p>

              <p
                style={{
                  fontSize: "22px",
                  marginTop: "10px",
                }}
              >
                Target Price:
                {" "}
                ₹{data.target_price}
              </p>
            </div>

            {/* Latest News */}

            <div style={glass}>
              <h2>
                <Newspaper />
                &nbsp; Latest News
              </h2>

              {data.headlines?.map(
                (news, index) => (
                  <div
                    key={index}
                    style={newsCard}
                  >
                    📰 {news}
                  </div>
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* Card Component */

function Card({
  title,
  value,
}) {
  return (
    <div style={card}>
      <h2>{title}</h2>

      <div style={valueStyle}>
        {String(value)}
      </div>
    </div>
  );
}

/* Sidebar Component */

function SidebarItem({
  icon,
  text,
}) {
  return (
    <div style={sidebarItem}>
      {icon}
      {text}
    </div>
  );
}

/* Styles */

const page = {
  minHeight: "100vh",
  display: "flex",
  width: "100%",
  background:
    "linear-gradient(135deg,#020617,#071133,#1e1b4b)",
  color: "white",
};
const isMobile = window.innerWidth < 768;
const sidebar = {
  width: isMobile ? "90px" : "280px",
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(20px)",
  padding: isMobile ? "15px" : "30px",
};

const main = {
  flex: 1,
  padding: "40px",
};

const title = {
   textAlign: "center",
  fontSize: isMobile ? "35px" : "70px",
};

const searchArea = {
  textAlign: "center",
  marginBottom: "50px",
};

const searchBox = {
  width: "60%",
  padding: "20px",
  borderRadius: "20px",
  border: "none",
  fontSize: "20px",
};

const button = {
  padding: "20px",
  marginLeft: "20px",
  borderRadius: "20px",
  border: "none",
  background:
    "linear-gradient(45deg,#3b82f6,#8b5cf6)",
  color: "white",
  cursor: "pointer",
};
const topGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, 1fr)",
  gap: "30px",
  marginTop: "30px",
};

const secondGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, 1fr)",
  gap: "30px",
  marginTop: "30px",
};

const thirdGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2, 1fr)",
  gap: "30px",
  marginTop: "30px",
  width: "50%",
};

const card = {
  background:
    "rgba(255,255,255,0.05)",
  backdropFilter: "blur(20px)",
  padding: "35px",
  borderRadius: "30px",
  textAlign: "center",
};

const valueStyle = {
  fontSize: "40px",
  fontWeight: "bold",
};

const glass = {
  marginTop: "40px",
  background:
    "rgba(255,255,255,0.05)",
  backdropFilter: "blur(20px)",
  padding: "40px",
  borderRadius: "30px",
};

const newsCard = {
  background:
    "rgba(255,255,255,0.05)",
  padding: "20px",
  borderRadius: "20px",
  marginTop: "15px",
};

const sidebarItem = {
  display: "flex",
  gap: "15px",
  marginTop: "25px",
  fontSize: isMobile ? "18px" : "28px",
  cursor: "pointer",
  alignItems: "center",
};

const periodContainer = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "20px",
  marginBottom: "20px",
};

const periodButton = {
  padding: "12px 20px",
  border: "none",
  borderRadius: "15px",
  color: "white",
  cursor: "pointer",
};

const empty = {
  textAlign: "center",
  marginTop: "150px",
  fontSize: "30px",
};

export default App;
