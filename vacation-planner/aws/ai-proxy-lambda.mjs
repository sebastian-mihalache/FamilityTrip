const corsHeaders = {
  "access-control-allow-origin": process.env.ALLOWED_ORIGIN || "*",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "content-type",
  "content-type": "application/json"
};

let cachedApiKey = null;
let cachedSecretConfig = null;

export const handler = async (event) => {
  if (event.requestContext?.http?.method === "OPTIONS" || event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  try {
    const path = event.rawPath || event.path || "";
    if (path.endsWith("/api/fuel-prices")) {
      return await handleFuelPrices(event);
    }

    const body = JSON.parse(event.body || "{}");
    const provider = normalizeProvider(body.provider || process.env.AI_PROVIDER || "gemini");
    const config = await getAiProviderConfig(provider, body.model);
    if (!config.apiKey) {
      return json(500, { error: "AI provider key is not configured." });
    }

    const prompt = body.prompt || "";
    const context = body.context || "";
    const text = `${prompt}\n\nContext traseu:\n${context}`;

    const result = await requestAiProvider({ ...config, text });
    if (!result.ok) return json(result.status, { error: result.error });

    return json(200, { text: result.text || "" });
  } catch (error) {
    return json(500, { error: error.message || "AI proxy failed." });
  }
};

async function getAiProviderConfig(provider, modelFromBody) {
  const secretConfig = await getAiProviderSecretConfig();
  const selectedProvider = normalizeProvider(secretConfig.provider || provider);
  const apiKey = getDirectApiKey(selectedProvider) || secretConfig.apiKey || "";
  const model = modelFromBody || secretConfig.model || process.env.AI_MODEL || process.env.GEMINI_MODEL || defaultModel(selectedProvider);
  return { provider: selectedProvider, model, apiKey };
}

function getDirectApiKey(provider) {
  const providerEnvName = `${provider.toUpperCase().replace(/[^A-Z0-9]/g, "_")}_API_KEY`;
  return process.env.AI_PROVIDER_API_KEY || process.env[providerEnvName] || process.env.GEMINI_API_KEY || "";
}

async function getAiProviderSecretConfig() {
  if (!process.env.AI_PROVIDER_SECRET_ARN) return {};
  if (cachedSecretConfig) return cachedSecretConfig;
  if (cachedApiKey) return { apiKey: cachedApiKey };

  const { SecretsManagerClient, GetSecretValueCommand } = await import("@aws-sdk/client-secrets-manager");
  const client = new SecretsManagerClient({});
  const data = await client.send(new GetSecretValueCommand({ SecretId: process.env.AI_PROVIDER_SECRET_ARN }));
  const secretValue = data.SecretString || (data.SecretBinary ? Buffer.from(data.SecretBinary).toString("utf8") : "");
  cachedSecretConfig = parseSecretConfig(secretValue);
  cachedApiKey = cachedSecretConfig.apiKey || "";
  return cachedSecretConfig;
}

function parseSecretConfig(value) {
  const text = String(value || "").trim();
  if (!text) return {};
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") {
      return {
        apiKey: parsed.apiKey || parsed.api_key || parsed.key || parsed.token || parsed.AI_PROVIDER_API_KEY || parsed.GEMINI_API_KEY || parsed.OPENAI_API_KEY || parsed.ANTHROPIC_API_KEY || parsed.OPENROUTER_API_KEY || "",
        provider: parsed.provider || parsed.aiProvider || parsed.AI_PROVIDER || "",
        model: parsed.model || parsed.aiModel || parsed.AI_MODEL || ""
      };
    }
  } catch {
    return { apiKey: text };
  }
  return { apiKey: text };
}

async function requestAiProvider({ provider, model, apiKey, text }) {
  if (provider === "openai") return requestOpenAi({ model, apiKey, text });
  if (provider === "anthropic") return requestAnthropic({ model, apiKey, text });
  if (provider === "openrouter") return requestOpenRouter({ model, apiKey, text });
  return requestGemini({ model, apiKey, text });
}

async function requestGemini({ model, apiKey, text }) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text }] }],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 1600
        }
      })
    }
  );
  const data = await readJson(response);
  if (!response.ok) return providerError(response, data);
  const output = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("\n")
    .trim();
  return { ok: true, text: output || "" };
}

async function requestOpenAi({ model, apiKey, text }) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: text,
      temperature: 0.6,
      max_output_tokens: 1600
    })
  });
  const data = await readJson(response);
  if (!response.ok) return providerError(response, data);
  const output = data.output_text || data.output
    ?.flatMap((item) => item.content || [])
    .map((item) => item.text || "")
    .join("\n")
    .trim();
  return { ok: true, text: output || "" };
}

async function requestAnthropic({ model, apiKey, text }) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model,
      max_tokens: 1600,
      temperature: 0.6,
      messages: [{ role: "user", content: text }]
    })
  });
  const data = await readJson(response);
  if (!response.ok) return providerError(response, data);
  const output = data.content
    ?.map((item) => item.text || "")
    .join("\n")
    .trim();
  return { ok: true, text: output || "" };
}

async function requestOpenRouter({ model, apiKey, text }) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
      "x-title": "Family Trip Planner"
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: text }],
      temperature: 0.6,
      max_tokens: 1600
    })
  });
  const data = await readJson(response);
  if (!response.ok) return providerError(response, data);
  const output = data.choices?.[0]?.message?.content || "";
  return { ok: true, text: output.trim() };
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function providerError(response, data) {
  return {
    ok: false,
    status: response.status,
    error: data.error?.message || data.error?.error?.message || data.message || "AI provider request failed."
  };
}

function normalizeProvider(value) {
  const provider = String(value || "").trim().toLowerCase();
  if (["openai", "anthropic", "openrouter", "gemini"].includes(provider)) return provider;
  return "gemini";
}

function defaultModel(provider) {
  if (provider === "openai") return "gpt-4.1-mini";
  if (provider === "anthropic") return "claude-sonnet-4-20250514";
  if (provider === "openrouter") return "google/gemini-2.5-flash";
  return "gemini-2.5-flash";
}

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
