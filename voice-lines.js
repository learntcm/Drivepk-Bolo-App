/* =====================================
   DrivePK BOLO – Voice Lines (URDU MAP)
   Used ONLY for assistant messages
===================================== */

// Roman Urdu shown on screen
// Urdu script spoken on Android (Google TTS)

const VOICE_LINES = {
  welcome_first: {
    roman: [
      "Assalam o Alaikum! DrivePK mein khush aamadid.",
      "Salam! DrivePK se baat ho rahi hai."
    ],
    urdu: [
      "السلام علیکم! ڈرائیو پی کے میں خوش آمدید۔",
      "سلام! آپ ڈرائیو پی کے سے بات کر رہے ہیں۔"
    ]
  },

  ask_name: {
    roman: [
      "Doctor bhai, aap ka naam kya hai?",
      "Doctor bhai, apna naam bata dein please."
    ],
    urdu: [
      "ڈاکٹر بھائی، آپ کا نام کیا ہے؟",
      "ڈاکٹر بھائی، براہِ کرم اپنا نام بتا دیں۔"
    ]
  },

  welcome_back: name => ({
    roman: [
      `${name} bhai, Assalam o Alaikum. Kya madad karun?`,
      `${name} bhai, salam. Aaj kya dhoondhna hai?`
    ],
    urdu: [
      `السلام علیکم ${name} بھائی، کیا مدد کروں؟`,
      `سلام ${name} بھائی، آج کیا تلاش کرنا ہے؟`
    ]
  }),

  ask_requirement: name => ({
    roman: [
      `${name} bhai, model, year aur city bol dein.`,
      `${name} bhai, konsi gaari chahiye?`
    ],
    urdu: [
      `${name} بھائی، ماڈل، سال اور شہر بتا دیں۔`,
      `${name} بھائی، کون سی گاڑی چاہیے؟`
    ]
  }),

  results_ready: name => ({
    roman: [
      "Yeh rahi aap ki search results.",
      `${name} bhai, matching gaariyan mil gayi hain.`
    ],
    urdu: [
      "یہ رہی آپ کی سرچ رزلٹس۔",
      `${name} بھائی، آپ کی مطلوبہ گاڑیاں مل گئی ہیں۔`
    ]
  }),

  mic_issue: {
    roman: [
      "Mujhe aap ki awaaz clear nahi aa rahi, behtar hai aap type kar dein."
    ],
    urdu: [
      "مجھے آپ کی آواز صاف سنائی نہیں دے رہی، بہتر ہے آپ ٹائپ کر دیں۔"
    ]
  },

  boss_intro: name => ({
    roman: [
      `${name} bhai, main Umar hoon, DrivePK ka boss. Bataiye, kya madad chahiye?`
    ],
    urdu: [
      `${name} بھائی، میں عمر ہوں، ڈرائیو پی کے کا باس۔ بتائیے، کیا مدد چاہیے؟`
    ]
  }),

  complaint: {
    roman: [
      "Agar aap ko complaint ho, please is number par call karein: 051 8319037."
    ],
    urdu: [
      "اگر آپ کو شکایت ہو تو براہِ کرم اس نمبر پر کال کریں: 051 8319037۔"
    ]
  }
};

// helper
function pickLine(block){
  return block[Math.floor(Math.random() * block.length)];
}