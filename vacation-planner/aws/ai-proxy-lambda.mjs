const corsHeaders = {
  "access-control-allow-origin": process.env.ALLOWED_ORIGIN || "*",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "content-type",
  "content-type": "application/json"
};

export const handler = async (event) => {
  if (event.requestContext?.http?.method === "OPTIONS" || event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  try {
    const path = event.rawPath || event.path || "";
    if (path.endsWith("/api/fuel-prices")) {
      return await handleFuelPrices(event);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return json(500, { error: "GEMINI_API_KEY is not configured." });
    }

    const body = JSON.parse(event.body || "{}");
    const model = body.model || process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const prompt = body.prompt || "";
    const context = body.context || "";
    const text = `${prompt}\n\nContext traseu:\n${context}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text }] }],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 1600
          }
        })
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return json(response.status, { error: data.error?.message || "Gemini request failed." });
    }

    const output = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("\n")
      .trim();

    return json(200, { text: output || "" });
  } catch (error) {
    return json(500, { error: error.message || "AI proxy failed." });
  }
};

async function handleFuelPrices(event) {
  const rawQuery = event.rawQueryString || "";
  const url = new URL(rawQuery ? `https://local?${rawQuery}` : "https://local");
  const requestedCodes = (url.searchParams.get("countries") || "")
    .split(",")
    .map((code) => code.trim().toUpperCase())
    .filter(Boolean);
  const sourceUrl = process.env.FUEL_SOURCE_URL || "https://fuelo.eu/?convertto=eur";
  const response = await fetch(sourceUrl, {
    headers: {
      accept: "text/html",
      "user-agent": "FamilyTripPlanner/1.0"
    }
  });
  if (!response.ok) {
    return json(502, { error: `Fuel source failed with ${response.status}.` });
  }

  const html = await response.text();
  const parsed = parseFueloPrices(html);
  const requested = requestedCodes.length ? requestedCodes : Object.keys(parsed.prices);
  const prices = {};
  requested.forEach((code) => {
    if (parsed.prices[code]) prices[code] = parsed.prices[code];
  });

  return json(200, {
    source: parsed.source,
    sourceUrl,
    updatedAt: parsed.updatedAt,
    prices
  });
}

function parseFueloPrices(html) {
  const updatedAt = cleanText(html.match(/Average fuel prices on\s*([^<]+)/i)?.[1] || "");
  const prices = {};
  const rowRegex = /<tr>\s*<td[^>]*><a href="https:\/\/([a-z]{2})\.fuelo\.net"[\s\S]*?\/>\s*([^<]+)<\/a><\/td>([\s\S]*?)<\/tr>/gi;
  let rowMatch;
  while ((rowMatch = rowRegex.exec(html))) {
    const code = rowMatch[1].toUpperCase();
    const values = [...rowMatch[3].matchAll(/<strong>\s*([\d,.]+)\s*€\s*<\/strong>/gi)]
      .map((match) => Number(match[1].replace(",", ".")))
      .filter((value) => Number.isFinite(value) && value > 0);
    if (values.length >= 3) {
      prices[code] = {
        gasoline: round2(values[0]),
        diesel: round2(values[1]),
        lpg: round2(values[2])
      };
    }
  }
  return { source: "Fuelo", updatedAt, prices };
}

function cleanText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body)
  };
}
