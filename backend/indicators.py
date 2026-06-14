import pandas as pd
import numpy as np


def calculate_rsi(data, period=14):
    close = data["Close"]

    if len(close) < period:
        return 50

    delta = close.diff()

    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)

    avg_gain = gain.rolling(period).mean()
    avg_loss = loss.rolling(period).mean()

    rs = avg_gain / avg_loss

    rsi = 100 - (100 / (1 + rs))

    value = rsi.iloc[-1]

    if pd.isna(value):
        return 50

    return float(value)


def calculate_macd(data):
    close = data["Close"]

    if len(close) < 26:
        return 0, 0

    ema12 = close.ewm(
        span=12,
        adjust=False,
    ).mean()

    ema26 = close.ewm(
        span=26,
        adjust=False,
    ).mean()

    macd = ema12 - ema26

    signal_line = macd.ewm(
        span=9,
        adjust=False,
    ).mean()

    macd_value = macd.iloc[-1]
    signal_value = signal_line.iloc[-1]

    if pd.isna(macd_value):
        macd_value = 0

    if pd.isna(signal_value):
        signal_value = 0

    return (
        float(macd_value),
        float(signal_value),
    )