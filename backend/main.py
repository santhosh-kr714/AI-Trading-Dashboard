from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf

from indicators import calculate_rsi, calculate_macd
from news_analysis import get_news_sentiment
from trading_ai import generate_signal

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "AI Trading Assistant Backend Running"}


@app.get("/stock/{ticker}")
def get_stock(ticker: str):
    try:
        stock = yf.Ticker(ticker)

        hist = stock.history(period="1y")

        if hist.empty:
            return {"error": "No stock data found"}

        current_price = float(hist["Close"].iloc[-1])

        rsi = calculate_rsi(hist)
        macd, macd_signal = calculate_macd(hist)

        news_sentiment, headlines = get_news_sentiment(ticker)

        (
            signal,
            confidence,
            trend,
            target_price,
            stop_loss,
        ) = generate_signal(
            current_price=current_price,
            rsi=rsi,
            macd=macd,
            news_sentiment=news_sentiment,
        )

        # All-Time High / Low
        full_hist = stock.history(period="max")

        all_time_high = round(
            float(full_hist["High"].max()),
            2,
        )

        all_time_low = round(
            float(full_hist["Low"].min()),
            2,
        )

        # 52 Week High / Low
        year_hist = stock.history(period="1y")

        high_52 = round(
            float(year_hist["High"].max()),
            2,
        )

        low_52 = round(
            float(year_hist["Low"].min()),
            2,
        )

        return {
            "ticker": ticker,
            "current_price": round(current_price, 2),
            "rsi": round(rsi, 2),
            "macd": round(macd, 2),
            "macd_signal": round(macd_signal, 2),
            "trend": trend,
            "confidence": confidence,
            "signal": signal,
            "target_price": round(target_price, 2),
            "stop_loss": round(stop_loss, 2),
            "news_sentiment": news_sentiment,
            "headlines": headlines,
            "all_time_high": all_time_high,
            "all_time_low": all_time_low,
            "high_52": high_52,
            "low_52": low_52,
        }

    except Exception as e:
        return {"error": str(e)}


@app.get("/chart/{ticker}")
def get_chart(
    ticker: str,
    period: str = "1y",
):
    try:
        valid_periods = [
            "1mo",
            "3mo",
            "6mo",
            "1y",
            "5y",
            "max",
        ]

        if period not in valid_periods:
            period = "1y"

        stock = yf.Ticker(ticker)

        hist = stock.history(
            period=period
        )

        if hist.empty:
            return []

        data = []

        for date, row in hist.iterrows():
            data.append(
                {
                    "date": date.strftime(
                        "%d-%b-%Y"
                    ),
                    "price": round(
                        float(row["Close"]),
                        2,
                    ),
                }
            )

        return data

    except Exception as e:
        return {"error": str(e)}


@app.get("/candles/{ticker}")
def get_candles(
    ticker: str,
    period: str = "1y",
):
    try:
        stock = yf.Ticker(ticker)

        hist = stock.history(
            period=period
        )

        if hist.empty:
            return []

        data = []

        for date, row in hist.iterrows():
            data.append(
                {
                    "date": date.strftime(
                        "%Y-%m-%d"
                    ),
                    "open": round(
                        float(row["Open"]),
                        2,
                    ),
                    "high": round(
                        float(row["High"]),
                        2,
                    ),
                    "low": round(
                        float(row["Low"]),
                        2,
                    ),
                    "close": round(
                        float(row["Close"]),
                        2,
                    ),
                    "volume": int(
                        row["Volume"]
                    ),
                }
            )

        return data

    except Exception as e:
        return {"error": str(e)}