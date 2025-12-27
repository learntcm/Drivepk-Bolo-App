// bolo.mobileDebug.js
(function () {
  const MAX = 40;
  const logs = [];

  function push(type, msg, extra) {
    const t = new Date().toLocaleTimeString();
    logs.push({ t, type, msg, extra: extra || "" });
    while (logs.length > MAX) logs.shift();
    render();
  }

  // UI
  const btn = document.createElement("button");
  btn.textContent = "Debug";
  btn.style.cssText =
    "position:fixed;right:12px;bottom:12px;z-index:999999;background:#111;color:#fff;border:0;border-radius:12px;padding:10px 14px;font-size:14px;opacity:.85";

  const panel = document.createElement("div");
  panel.style.cssText =
    "position:fixed;left:10px;right:10px;bottom:60px;z-index:999999;background:rgba(0,0,0,.9);color:#fff;border-radius:14px;padding:10px;max-height:45vh;overflow:auto;display:none;font-family:Arial;font-size:12px;line-height:1.4";

  const head = document.createElement("div");
  head.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin-bottom:6px";
  head.innerHTML = `<div style="font-weight:700">BOLO Debug</div>`;

  const close = document.createElement("button");
  close.textContent = "Close";
  close.style.cssText =
    "background:#333;color:#fff;border:0;border-radius:10px;padding:6px 10px;font-size:12px";
  close.onclick = () => (panel.style.display = "none");

  head.appendChild(close);
  panel.appendChild(head);

  const body = document.createElement("div");
  panel.appendChild(body);

  function render() {
    if (panel.style.display === "none") return;
    body.innerHTML = logs
      .map(
        (l) =>
          `<div style="margin:6px 0;padding:6px;border-radius:10px;background:rgba(255,255,255,.07)">
            <div><b>${l.t}</b> <span style="opacity:.8">[${l.type}]</span> ${escapeHtml(l.msg)}</div>
            ${l.extra ? `<div style="opacity:.75;margin-top:4px">${escapeHtml(l.extra)}</div>` : ""}
          </div>`
      )
      .join("");
    body.scrollTop = body.scrollHeight;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  }

  btn.onclick = () => {
    panel.style.display = panel.style.display === "none" ? "block" : "none";
    render();
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(btn);
    document.body.appendChild(panel);
    push("INFO", "Debug overlay loaded");
    push("INFO", "If AI fails, you will see exact error here.");
  });

  // Catch runtime errors
  window.addEventListener("error", (e) => push("JS_ERROR", e.message || "Unknown", (e.filename || "") + ":" + (e.lineno || "")));
  window.addEventListener("unhandledrejection", (e) => push("PROMISE_REJECT", (e.reason && e.reason.message) || "Unhandled rejection", String(e.reason || "")));

  // Network monitor (chat.php, voice.php, search.php)
  const _fetch = window.fetch;
  window.fetch = async function (...args) {
    const url = (args[0] && args[0].url) ? args[0].url : String(args[0] || "");
    const isInteresting =
      url.includes("/chat.php") || url.includes("/voice.php") || url.includes("/search.php") || url.includes("api.drivepk.com/cars");

    const started = Date.now();
    try {
      const res = await _fetch.apply(this, args);
      if (isInteresting) {
        push(
          "FETCH_OK",
          `${res.status} ${url}`,
          `Time: ${Date.now() - started}ms`
        );
        // If chat.php returned non-200 or empty, show warning
        if (url.includes("/chat.php") && (!res.ok)) {
          push("AI_WARNING", "chat.php returned error", `HTTP ${res.status}`);
        }
      }
      return res;
    } catch (err) {
      if (isInteresting) {
        push("FETCH_FAIL", url, (err && err.message) ? err.message : String(err));
        if (url.includes("/chat.php")) push("AI_FAIL", "AI not reachable (network/fetch failed)", "Likely timeout/CORS/server down");
      }
      throw err;
    }
  };
})();
