
// bolo.bossCommands.js
(function () {
  const KEYWORDS = [
    "boss", "umar", "boss umar", "manager", "supervisor",
    "boss se baat", "umar se baat", "boss ko bulao", "umar ko bulao",
    "boss se connect", "speak to boss"
  ];

  function looksLikeBossCommand(text) {
    const t = (text || "").toLowerCase().trim();
    return KEYWORDS.some(k => t.includes(k));
  }

  async function speakBoss() {
    try {
      await fetch("https://meilibeauty.co.uk/voice.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voice: "onyx",
          text: "How may I help you?"
        })
      });
    } catch (e) {
      // silent fail; debug overlay will catch it if installed
    }
  }

  // Hook Web Speech API instances safely
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;

  const Original = SR;
  function WrappedSpeechRecognition() {
    const rec = new Original();

    // wrap onresult setter
    let _onresult = null;
    Object.defineProperty(rec, "onresult", {
      get() { return _onresult; },
      set(fn) {
        _onresult = function (event) {
          try {
            const i = event.resultIndex || 0;
            const txt = event.results && event.results[i] && event.results[i][0] ? event.results[i][0].transcript : "";
            if (looksLikeBossCommand(txt)) {
              speakBoss();
              return; // stop normal flow for this command
            }
          } catch (e) {}
          if (typeof fn === "function") fn.call(rec, event);
        };
      }
    });

    return rec;
  }

  // Replace constructors globally
  if (window.SpeechRecognition) window.SpeechRecognition = WrappedSpeechRecognition;
  if (window.webkitSpeechRecognition) window.webkitSpeechRecognition = WrappedSpeechRecognition;

})();
