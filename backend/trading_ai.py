def generate_signal(
    current_price,
    rsi,
    macd,
    news_sentiment,
):
    score = 0

    if rsi < 30:
        score += 2

    elif rsi > 70:
        score -= 2

    if macd > 0:
        score += 1
    else:
        score -= 1

    if news_sentiment == "POSITIVE":
        score += 1

    elif news_sentiment == "NEGATIVE":
        score -= 1

    if score >= 2:
        signal = "BUY"
        trend = "BULLISH"
        confidence = 75

    elif score <= -2:
        signal = "SELL"
        trend = "BEARISH"
        confidence = 75

    else:
        signal = "HOLD"
        trend = "SIDEWAYS"
        confidence = 55

    target_price = current_price * 1.05
    stop_loss = current_price * 0.95

    return (
        signal,
        confidence,
        trend,
        target_price,
        stop_loss,
    )