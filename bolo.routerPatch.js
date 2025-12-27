// bolo.routerPatch.js
(function () {
  const originalFetch = window.fetch;

  // Boss keywords
  const BOSS_WORDS = [
    "boss", "umar", "boss umar", "manager", "supervisor",
    "boss se baat", "umar se baat", "boss ko bulao", "umar ko bulao",
    "speak to boss", "speak to your boss", "boss se connect"
  ];

  // Car words (basic, you can expand later)
  const CAR_WORDS = [
    "honda","toyota","suzuki","kia","hyundai","mg","changan","havals","haval","byd",
    "corolla","civic","city","alto","mehran","cultus","wagon r","prado","fortuner",
    "gaari","gari","car","cars","model","variant","price","budget","lakh","lac","million",
    "lahore","karachi","islamabad","rawalpindi","peshawar","multan","faisalabad",
    "petrol","diesel","hybrid","electric","ev","suv","jeep","sedan","hatchback"
  ];

  function hasAny(text, arr) {
    const t = (text || "").toLowerCase();
    return arr.some(w => t.includes(w));
  }

  function looksBoss(text) {
    return hasAny(text, BOSS_WORDS);
  }

  function looksCar(text) {
    return hasAny(text, CAR_WORDS);
  }

  async function speak(text, voice) {
    try {
      await originalFetch("https://meilibeauty.co.uk/voice.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, ...(voice ? { voice } : {}) })
      });
    } catch (e) {}
  }

  async function callAI(userText) {
    const res = await originalFetch("https://meilibeauty.co.uk/chat.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText, text: userText, prompt: userText })
    });

    const data = await res.json().catch(() => ({}));
    return (
      (data && (data.reply || data.answer || data.message)) ||
      ""
    ).toString().trim();
  }

  // Extract text from fetch args (Request / url + options)
  async function extractUserText(url, options) {
    try {
      // If Request object passed into fetch
      if (url && typeof url === "object" && url instanceof Request) {
        const ct = (url.headers.get("content-type") || "").toLowerCase();
        // Clone before reading
        const clone = url.clone();

        if (ct.includes("application/json")) {
          const j = await clone.json().catch(() => null);
          return (j && (j.query || j.q || j.text || j.message || j.prompt)) || "";
        }

        if (ct.includes("application/x-www-form-urlencoded")) {
          const txt = await clone.text().catch(() => "");
          const params = new URLSearchParams(txt);
          return params.get("query") || params.get("q") || params.get("text") || params.get("message") || "";
        }

        // multipart/form-data or unknown
        const txt = await clone.text().catch(() => "");
        return txt || "";
      }

      // Normal fetch(url, options)
      const body = options && options.body;

      if (!body) return "";

      // JSON string body
      if (typeof body === "string") {
        // try json
        try {
          const j = JSON.parse(body);
          return (j.query || j.q || j.text || j.message || j.prompt || "") + "";
        } catch (e) {
          // maybe urlencoded
          const params = new URLSearchParams(body);
          const v = params.get("query") || params.get("q") || params.get("text") || params.get("message") || "";
          return (v || body || "") + "";
        }
      }

      // URLSearchParams
      if (body instanceof URLSearchParams) {
        return body.get("query") || body.get("q") || body.get("text") || body.get("message") || "";
      }

      // FormData
      if (typeof FormData !== "undefined" && body instanceof FormData) {
        return body.get("query") || body.get("q") || body.get("text") || body.get("message") || "";
      }

      // Blob / ArrayBuffer etc: ignore
      return "";
    } catch (e) {
      return "";
    }
  }

  function isSearchEndpoint(u) {
    const s = (u && u.url) ? u.url : String(u || "");
    // match absolute OR relative
    return s.includes("search.php");
  }

  window.fetch = async function (...args) {
    const urlArg = args[0];
    const optArg = args[1] || {};

    // Only intercept search.php
    if (isSearchEndpoint(urlArg)) {
      const u = (urlArg && urlArg.url) ? urlArg.url : String(urlArg || "");
      const userText = (await extractUserText(urlArg, optArg)) || "";

      // If boss intent -> speak boss and return fake success
      if (userText && looksBoss(userText)) {
        await speak("How may I help you?", "onyx");
        return new Response(JSON.stringify({ success: true, data: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }

      // If NOT car-related -> route to AI and return fake success
      if (userText && !looksCar(userText)) {
        const reply = await callAI(userText);

        if (reply) {
          await speak(reply);
        } else {
          await speak("Bhai jaan, AI ka reply nahi aa raha. Thori dair baad try karein.");
        }

        return new Response(JSON.stringify({ success: true, data: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }

      // Otherwise allow normal search.php to proceed
      return originalFetch.apply(this, args);
    }

    // Anything else normal
    return originalFetch.apply(this, args);
  };

})();
