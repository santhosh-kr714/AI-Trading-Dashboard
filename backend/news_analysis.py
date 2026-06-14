import feedparser


def get_news_sentiment(ticker):

    search_term = ticker.replace(".NS", "")

    url = f"https://news.google.com/rss/search?q={search_term}+stock"

    feed = feedparser.parse(url)

    positive_words = [
        "profit",
        "growth",
        "gain",
        "surge",
        "strong",
        "record",
        "beat",
        "bullish"
    ]

    negative_words = [
        "loss",
        "drop",
        "fall",
        "weak",
        "lawsuit",
        "decline",
        "bearish",
        "crash"
    ]

    score = 0
    headlines = []

    for entry in feed.entries[:10]:

        title = entry.title

        headlines.append(title)

        title_lower = title.lower()

        for word in positive_words:
            if word in title_lower:
                score += 1

        for word in negative_words:
            if word in title_lower:
                score -= 1

    if score > 0:
        sentiment = "POSITIVE"
    elif score < 0:
        sentiment = "NEGATIVE"
    else:
        sentiment = "NEUTRAL"

    return sentiment, headlines[:5]