// bolo.forceAI.js
(function () {
  const carWords = [
    "honda","toyota","suzuki","kia","corolla","civic","city",
    "gaari","car","price","model","lahore","karachi","islamabad"
  ];

  function looksCarRelated(text) {
    const t = (text || "").toLowerCase();
    return carWords.some(w => t.includes(w));
  }

  async function callAI(text) {
    const res = await fetch("https://meilibeauty.co.uk/chat.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });
    return res.json();
  }

  document.addEventListener("submit", async function (e) {
    const input = e.target.querySelector("input, textarea");
    if (!input) return;

    const text = input.value;
    if (!text || looksCarRelated(text)) return;

    e.preventDefault();
    input.value = "";

    try {
      const data = await callAI(text);
      if (data?.reply) {
        fetch("https://meilibeauty.co.uk/voice.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: data.reply })
        });
      }
    } catch {
      fetch("https://meilibeauty.co.uk/voice.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "Bhai jaan, AI se thora masla aa raha hai. Gaari ka sawal pooch lein."
        })
      });
    }
  }, true);
})();
