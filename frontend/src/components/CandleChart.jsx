import React from "react";
import {
  ChartCanvas,
  Chart,
  CandlestickSeries,
  BarSeries,
  XAxis,
  YAxis,
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
  EdgeIndicator,
  OHLCTooltip,
} from "react-financial-charts";

import { scaleTime } from "d3-scale";
import { timeFormat } from "d3-time-format";

function CandleChart({ data = [] }) {
  if (!data.length) {
    return (
      <div
        style={{
          height: "600px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: "20px",
        }}
      >
        No Candle Data Available
      </div>
    );
  }

  const chartData = data.map((d) => ({
    date: new Date(d.date),
    open: Number(d.open),
    high: Number(d.high),
    low: Number(d.low),
    close: Number(d.close),
    volume: Number(d.volume),
  }));

  const xAccessor = (d) => d.date;

  const start =
    chartData[Math.max(0, chartData.length - 100)];

  const end = chartData[chartData.length - 1];

  const xExtents = [
    xAccessor(start),
    xAccessor(end),
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "650px",
        background: "#111827",
        borderRadius: "20px",
        padding: "10px",
        overflowX: "auto",
      }}
    >
      <ChartCanvas
        height={630}
        width={
          window.innerWidth < 768
            ? window.innerWidth - 40
            : 1200
        }
        ratio={window.devicePixelRatio || 1}
        margin={{
          left: 70,
          right: 70,
          top: 20,
          bottom: 40,
        }}
        data={chartData}
        xAccessor={xAccessor}
        displayXAccessor={xAccessor}
        xScale={scaleTime}
        xExtents={xExtents}
        seriesName="Stock"
      >
        {/* Candlestick Chart */}
        <Chart
          id={1}
          yExtents={(d) => [d.high, d.low]}
        >
          <XAxis
            strokeStyle="#ffffff"
            tickLabelFill="#ffffff"
          />

          <YAxis
            strokeStyle="#ffffff"
            tickLabelFill="#ffffff"
          />

          <CandlestickSeries />

          <MouseCoordinateX
            displayFormat={timeFormat("%d-%b-%Y")}
            fill="#ffffff"
            textFill="#000000"
          />

          <MouseCoordinateY
            fill="#ffffff"
            textFill="#000000"
          />

          <EdgeIndicator
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={(d) => d.close}
            fill={(d) =>
              d.close > d.open
                ? "#22c55e"
                : "#ef4444"
            }
            textFill="#ffffff"
          />

          <OHLCTooltip
            textFill="#ffffff"
            labelFill="#ffffff"
          />
        </Chart>

        {/* Volume Chart */}
        <Chart
          id={2}
          height={150}
          origin={(w, h) => [0, h - 150]}
          yExtents={(d) => d.volume}
        >
          <YAxis
            ticks={4}
            strokeStyle="#ffffff"
            tickLabelFill="#ffffff"
          />

          <BarSeries
            yAccessor={(d) => d.volume}
          />
        </Chart>

        <CrossHairCursor
          strokeStyle="#ffffff"
        />
      </ChartCanvas>
    </div>
  );
}

export default CandleChart;