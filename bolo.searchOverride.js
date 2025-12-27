// bolo.searchOverride.js
(function () {

  const CAR_WORDS = [
    "honda","toyota","suzuki","kia","corolla","civic","city","alto","mehran",
    "gaari","gari","car","cars","model","price","budget","lakh","lac","million",
    "lahore","karachi","islamabad","rawalpindi","peshawar","multan","faisalabad",
    "petrol","diesel","hybrid","electric","suv","jeep","sedan"
  ];

  function looksCarRelated(text) {
    const t = (text || "").toLowerCase();
    return CAR_WORDS.some(w => t.includes(w));
  }

  const originalFetch = window.fetch;

  window.fetch = async function (...args) {
    const url = String(args[0] || "");

    // Only intercept search.php
    if (url.includes("/search.php")) {
      try {
        const body = args[1]?.body;
        const payload = body ? JSON.parse(body) : {};
        const userText = payload.query || payload.text || payload.message || "";

        // If NOT car-related → block search & route to AI
        if (userText && !looksCarRelated(userText)) {

          // Call AI instead
          const aiRes = await originalFetch("https://meilibeauty.co.uk/chat.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: userText,
              text: userText,
              prompt: userText
            })
          });

          const aiData = await aiRes.json();
          const reply =
            aiData.reply ||
            aiData.answer ||
            aiData.message ||
            "Bhai jaan, main DrivePK hoon. Gaari dhoondnay mein madad kar sakti hoon.";

          // Speak AI reply
          await originalFetch("https://meilibeauty.co.uk/voice.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: reply })
          });

          // Return fake successful search response to keep app stable
          return new Response(JSON.stringify({ success: true, data: [] }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }
      } catch (e) {
        // If anything fails, let search work normally
      }
    }

    return originalFetch.apply(this, args);
  };

})();
