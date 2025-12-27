// bolo.textCommandRouter.js
(function () {
  const KEYWORDS = [
    "boss", "umar", "boss umar", "manager", "supervisor",
    "boss se baat", "umar se baat", "boss ko bulao", "umar ko bulao",
    "speak to boss"
  ];

  function isBossCommand(text) {
    const t = (text || "").toLowerCase();
    return KEYWORDS.some(k => t.includes(k));
  }

  async function speakBoss() {
    await fetch("https://meilibeauty.co.uk/voice.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        voice: "onyx",
        text: "How may I help you?"
      })
    });
  }

  // Intercept text input submits
  document.addEventListener("submit", function (e) {
    const input = e.target.querySelector("input, textarea");
    if (!input) return;

    if (isBossCommand(input.value)) {
      e.preventDefault();     // stop normal flow
      input.value = "";       // clear input
      speakBoss();            // call boss
    }
  }, true);
})();
