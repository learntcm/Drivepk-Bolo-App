/* =========================================
   DrivePK BOLO – app.js (PAID VOICE ONLY)
   - Uses ONLY https://meilibeauty.co.uk/voice.php for TTS
   - Keeps hold-to-talk STT (webkitSpeechRecognition)
   - Boss = Umar
   - Complaints show number + speak it
   - Lady locked per user (localStorage)
   - No Google/device TTS
   Depends on:
   - index.html IDs: callBtn, searchBtn, query, status, results, supportBox, hint
========================================= */

/* ---------- CONFIG ---------- */
const VOICE_API  = "https://meilibeauty.co.uk/voice.php";
const SEARCH_API = "https://meilibeauty.co.uk/search.php";
const COMPANY_NUMBER = "051 8319037";

const LADIES = ["Kiran","Reshma","Mahnoor","Gul Noor","Dil Bahar","Shaheen"];
const HOLD_HINT = "🎤 Press & hold karke bolen. Chhorne par sunna band ho jayega.";
const BETWEEN_PROMPTS_MS = 5000;
const SILENCE_MS = 5000;
const END_WAIT_MS = 900;

/* ---------- STATE ---------- */
let callConnected = false;
let speaking = false;
let recognition = null;
let isRecognizing = false;
let transcriptBuffer = "";
let silenceTimer = null;
let micWarmed = false;

/* ---------- STORAGE ---------- */
function getProfile(){
  return JSON.parse(localStorage.getItem("boloProfile") || "{}");
}
function saveProfile(p){
  localStorage.setItem("boloProfile", JSON.stringify(p));
}
function rand(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}
function getOrAssignLady(){
  const p = getProfile();
  if(!p.lady){
    p.lady = rand(LADIES);
    saveProfile(p);
  }
  return p.lady;
}

/* ---------- UI HELPERS ---------- */
function setStatus(t){ status.innerText = t || ""; }
function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
function clearSilence(){ if(silenceTimer){ clearTimeout(silenceTimer); silenceTimer=null; } }
function showSupport(){ if(typeof supportBox !== "undefined") supportBox.style.display = "block"; }
function hideSupport(){ if(typeof supportBox !== "undefined") supportBox.style.display = "none"; }

/* ---------- MIC WARM-UP ---------- */
async function warmupMic(){
  if(micWarmed) return true;
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return true;
  try{
    const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
    stream.getTracks().forEach(t=>t.stop());
    micWarmed = true;
    return true;
  }catch(e){
    return false;
  }
}

/* ---------- HARD STOP MIC ---------- */
function hardStopMic(){
  if(!recognition) return;
  try{ recognition.onresult=null; recognition.onerror=null; recognition.onend=null; }catch(e){}
  try{ recognition.abort(); }catch(e){}
  try{ recognition.stop(); }catch(e){}
  isRecognizing = false;
  clearSilence();
}

/* ---------- PAID TTS (voice.php) ---------- */
async function speak(text){
  // Stop any recognition while speaking to avoid overlap/double prompts
  hardStopMic();
  clearSilence();

  speaking = true;
  setStatus(text);

  let res;
  try{
    res = await fetch(VOICE_API,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ text })
    });
  }catch(e){
    speaking = false;
    return;
  }

  if(!res || !res.ok){
    speaking = false;
    return;
  }

  const blob = await res.blob();
  const audio = new Audio(URL.createObjectURL(blob));

  return new Promise(resolve=>{
    audio.onended = ()=>{ speaking=false; resolve(); };
    audio.onerror = ()=>{ speaking=false; resolve(); };
    audio.play().catch(()=>{ speaking=false; resolve(); });
  });
}

/* ---------- PHRASE LIB ---------- */
function normalize(t){
  return (t||"").toLowerCase().replace(/[^\w\s]/g," ").replace(/\s+/g," ").trim();
}

function tidyName(raw){
  return raw.replace(/[^a-zA-Z\s]/g," ").replace(/\s+/g," ").trim().split(" ").slice(0,3)
    .map(w=>w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()).join(" ");
}
function extractName(text){
  const t = (text||"").trim();
  let m = t.match(/(my name is|mera naam)\s+(.+)/i);
  if(m) return tidyName(m[2]);
  const cleaned = tidyName(t);
  if(cleaned && cleaned.length >= 2) return cleaned;
  return null;
}

function wantsBoss(t){
  t = normalize(t);
  const phrases = [
    "boss","manager","supervisor","senior","team lead","owner",
    "mujhe boss se baat karni hai","muje boss se baat karni hai",
    "boss se baat karwao","boss se connect karo",
    "manager se baat karwao","supervisor se baat karwao",
    "senior se baat karwao","team lead se baat karwao",
    "owner se baat karwao","head se baat karwao",
    "mujhe umar se baat karni hai","umar se baat karwao","umar"
  ];
  return phrases.some(p => t.includes(p));
}

function wantsComplaint(t){
  t = normalize(t);
  const phrases = [
    "complain","complaint","shikayat","shikayat karni",
    "issue","problem","masla","report",
    "bad service","bakwas","fraud","scam",
    "customer care","support number",
    "call number","phone number",
    "compliments", "compliments number"
  ];
  return phrases.some(p => t.includes(p));
}

function wantsNewLady(t){
  t = normalize(t);
  const phrases = [
    "change lady","switch lady","another lady","other lady","new lady",
    "aur madam chahiye","aur lady chahiye",
    "dusri madam","dusri lady","koi aur lady","koi aur madam",
    "dusri madam se baat karwao","dusri lady se baat karwao",
    "madam change karo","lady change karo",
    "lady badlo","lady badal do","madam badlo","madam badal do",
    "koi khoobsurat lady chahiye"
  ];
  return phrases.some(p => t.includes(p));
}

function isAskingMyName(t){
  t = normalize(t);
  return (
    t.includes("what is your name") ||
    t.includes("whats your name") ||
    t.includes("tell me your name") ||
    t.includes("ap ka naam") || t.includes("aap ka naam") ||
    t.includes("tumhara naam") ||
    t.includes("madam ka naam") ||
    t.includes("lady ka naam")
  );
}

function isGreeting(t){
  t = normalize(t);
  return (
    t.includes("assalam") || t.includes("salam") || t === "hi" || t === "hello" ||
    t.includes("aoa") || t.includes("asalam o alaikum")
  );
}

/* ---------- MESSAGE TEMPLATES (Roman Urdu) ---------- */
function welcomeFirst(){
  return rand([
    "Assalam o Alaikum! DrivePK mein khush aamadid.",
    "Salam! DrivePK se baat ho rahi hai.",
    "Assalam o Alaikum! DrivePK ki taraf se."
  ]);
}
function askNameLine(){
  return rand([
    "Doctor bhai, aap ka naam kya hai?",
    "Doctor bhai, apna naam bata dein please.",
    "Doctor bhai, main aap ka naam jaan sakti hoon?"
  ]);
}
function welcomeReturning(name){
  return rand([
    `${name} bhai, Assalam o Alaikum. Kya madad karun?`,
    `${name} bhai, salam. Aaj kya dhoondhna hai?`,
    `${name} bhai, welcome back. Bata dein konsi gaari chahiye?`
  ]);
}
function askRequirement(name){
  return rand([
    `${name} bhai, model, year aur city bol dein.`,
    `${name} bhai, konsi gaari chahiye? Model/year/city bol dein.`,
    `${name} bhai, apni requirement bol dein — jaise model, year aur city.`
  ]);
}
function resultsLine(name){
  return rand([
    "Yeh rahi aap ki search results.",
    `${name} bhai, matching gaariyan mil gayi hain.`,
    `${name} bhai, results aa gaye. Aap dekh lijiye.`
  ]);
}
function micFailLine(){
  return rand([
    "Mujhe aap ki awaaz clear nahi aa rahi. Behtar hai aap type kar dein.",
    "Mic issue lag raha hai. Aap please type karke search kar lein.",
    "Awaaz receive nahi ho rahi. Kindly text box mein likh dein."
  ]);
}

/* ---------- RING (1–3 times) ---------- */
async function ringPhone(){
  const rings = Math.floor(Math.random()*3)+1;
  for(let i=0;i<rings;i++){
    await new Promise(res=>{
      const r = new Audio("ringtone.mp4");
      r.onended = () => setTimeout(res, 450);
      r.play().catch(res);
    });
  }
}

/* ---------- SPEECH RECOGNITION SETUP ---------- */
if("webkitSpeechRecognition" in window){
  recognition = new webkitSpeechRecognition();
  recognition.lang = "en-IN"; // works well for Pakistani accent in Roman Urdu
  recognition.interimResults = false;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;
}

/* ---------- HOLD TO TALK ---------- */
async function startHoldListening(){
  if(!callConnected) return;
  if(!recognition){
    await speak(micFailLine());
    return;
  }
  if(speaking) return;
  if(isRecognizing) return;

  const ok = await warmupMic();
  if(!ok){
    await speak("Mic permission allow nahi hai. Behtar hai aap type kar dein.");
    return;
  }

  callBtn.classList.add("talking");
  callBtn.innerText = "🎙 LISTENING…";
  setStatus("Sun rahi hoon… " + HOLD_HINT);

  transcriptBuffer = "";
  isRecognizing = true;

  clearSilence();
  silenceTimer = setTimeout(async ()=>{
    if(isRecognizing && !transcriptBuffer){
      const p = getProfile();
      const nm = p.name || "Doctor";
      await speak(`${nm} bhai, mujhe awaaz clear nahi aa rahi. Model, year aur city bol dein.`);
      setStatus(HOLD_HINT);
    }
  }, SILENCE_MS);

  recognition.onresult = e=>{
    transcriptBuffer =
      (e.results && e.results[0] && e.results[0][0] && e.results[0][0].transcript)
        ? e.results[0][0].transcript
        : "";
  };

  recognition.onerror = ()=>{
    // do nothing; stop will handle fallback
  };

  recognition.onend = ()=>{
    isRecognizing = false;
    clearSilence();
  };

  try{ recognition.start(); }catch(e){ isRecognizing=false; clearSilence(); }
}

async function stopHoldListeningAndHandle(){
  if(!callConnected) return;

  callBtn.classList.remove("talking");
  callBtn.innerText = "🎤 HOLD TO TALK";

  if(!recognition || !isRecognizing) return;

  clearSilence();
  try{ recognition.stop(); }catch(e){}
  await sleep(END_WAIT_MS);

  const spoken = (transcriptBuffer || "").trim();

  if(!spoken){
    await speak(micFailLine());
    setStatus("Mic issue ho sakta hai. Type karke Search karein.");
    return;
  }

  await handleSpoken(spoken);
}

/* ---------- INTENT + SEARCH ROUTER ---------- */
async function handleLadyChange(){
  const p = getProfile();
  const current = p.lady || "";
  const choices = LADIES.filter(x=>x!==current);
  p.lady = choices.length ? rand(choices) : rand(LADIES);
  saveProfile(p);

  await speak(`${p.name || "Doctor"} bhai, theek hai. Ab ${p.lady} baat karegi.`);
  await speak(`Assalam o Alaikum ${p.name || "Doctor"} bhai. Main ${p.lady} hoon. Kya madad karun?`);
  setStatus(HOLD_HINT);
}

async function maybeSaveNameFromSpoken(spoken){
  const p = getProfile();
  if(p.name) return false;

  // If they ask assistant name before giving theirs
  if(isAskingMyName(spoken)){
    const lady = getOrAssignLady();
    await speak(`Mera naam ${lady} hai. Pehle aap apna naam bata dein, phir main gaari dhoond deti hoon.`);
    setStatus(HOLD_HINT);
    return true;
  }

  const name = extractName(spoken);
  if(!name){
    await speak("Naam clear nahi aaya. Sirf apna naam dobara bol dein.");
    setStatus(HOLD_HINT);
    return true;
  }

  p.name = name;
  saveProfile(p);

  await speak(`Shukriya ${name} bhai.`);
  await sleep(BETWEEN_PROMPTS_MS);
  await speak(askRequirement(name));
  setStatus(HOLD_HINT);
  return true;
}

async function handleConversationIntent(spoken){
  const p = getProfile();
  const name = p.name || "Doctor";
  const lady = getOrAssignLady();

  // Complaints: show number + speak
  if(wantsComplaint(spoken)){
    showSupport();
    await speak(`${name} bhai, agar aap ko complaint ya issue ho, please is number par call karein: ${COMPANY_NUMBER}.`);
    setStatus("Complaints number screen par show ho gaya hai.");
    return true;
  }else{
    hideSupport();
  }

  // Boss: Umar
  if(wantsBoss(spoken)){
    await speak(`${name} bhai, Assalam o Alaikum. Main Umar hoon, DrivePK ka boss. Bataiye, kya madad chahiye?`);
    setStatus(HOLD_HINT);
    return true;
  }

  // Change lady
  if(wantsNewLady(spoken)){
    await handleLadyChange();
    return true;
  }

  // Asking assistant name
  if(isAskingMyName(spoken)){
    await speak(`${name} bhai, mera naam ${lady} hai. DrivePK se baat ho rahi hai.`);
    setStatus(HOLD_HINT);
    return true;
  }

  // Greeting
  if(isGreeting(spoken)){
    await speak(`${name} bhai, Assalam o Alaikum. ${askRequirement(name)}`);
    setStatus(HOLD_HINT);
    return true;
  }

  return false;
}

async function handleSpoken(spoken){
  // 1) Save name first time
  const usedForName = await maybeSaveNameFromSpoken(spoken);
  if(usedForName) return;

  // 2) Handle conversation commands
  const handled = await handleConversationIntent(spoken);
  if(handled) return;

  // 3) Otherwise treat as search
  hideSupport();
  query.value = spoken;

  const p=getProfile();
  p.lastSearch = spoken;
  saveProfile(p);

  await runSearch(spoken);

  const nm = p.name || "Doctor";
  await speak(resultsLine(nm));
  setStatus("Dobara bolna ho to " + HOLD_HINT);
}

/* ---------- SEARCH ---------- */
async function runSearch(text){
  hideSupport();
  results.innerHTML = "<p>Gaariyan dhoondi ja rahi hain…</p>";

  let res;
  try{
    res = await fetch(SEARCH_API,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ text })
    });
  }catch(e){
    results.innerHTML = "<p>Search error</p>";
    return;
  }

  let json=null;
  try{ json = await res.json(); }catch(e){}

  results.innerHTML = "";
  if(!json || !json.data || !json.data.length){
    results.innerHTML = "<p>Koi gaari nahi mili</p>";
    return;
  }

  json.data.forEach(c=>{
    const img = c.images?.[0] || "";
    const price = c.price ? Number(c.price).toLocaleString() : "Call";
    const title = c.title || "-";
    const year = c.year || "-";
    const city = c.location?.city || "-";

    results.innerHTML += `
      <div class="car">
        ${img ? `<img src="${img}">` : ""}
        <h3>${title}</h3>
        <div>${year} • ${city}</div>
        <strong>PKR ${price}</strong>
      </div>
    `;
  });
}

/* ---------- CALL FLOW ---------- */
async function connectCall(){
  callBtn.classList.add("calling");
  callBtn.innerText = "📞 CALLING…";
  callBtn.disabled = true;

  hardStopMic();
  hideSupport();

  await ringPhone();

  callConnected = true;
  callBtn.classList.remove("calling");
  callBtn.disabled = false;
  callBtn.innerText = "🎤 HOLD TO TALK";

  if(typeof hint !== "undefined") hint.innerText = HOLD_HINT;

  await warmupMic();

  const p = getProfile();
  getOrAssignLady(); // ensure exists

  if(!p.name){
    await speak(welcomeFirst());
    await sleep(BETWEEN_PROMPTS_MS);
    await speak(askNameLine());
    setStatus("Apna naam bolne ke liye " + HOLD_HINT);
  }else{
    await speak(welcomeReturning(p.name));
    await sleep(BETWEEN_PROMPTS_MS);
    await speak(askRequirement(p.name));
    setStatus(HOLD_HINT);
  }
}

/* ---------- BUTTONS ---------- */
callBtn.addEventListener("click", async ()=>{
  if(!callConnected){
    await connectCall();
  }
});

function bindHold(btn){
  // Touch
  btn.addEventListener("touchstart", (e)=>{
    if(!callConnected) return;
    e.preventDefault();
    startHoldListening();
  }, {passive:false});

  btn.addEventListener("touchend", async (e)=>{
    if(!callConnected) return;
    e.preventDefault();
    await stopHoldListeningAndHandle();
  }, {passive:false});

  // Mouse
  btn.addEventListener("mousedown", ()=>{
    if(!callConnected) return;
    startHoldListening();
  });
  btn.addEventListener("mouseup", async ()=>{
    if(!callConnected) return;
    await stopHoldListeningAndHandle();
  });
  btn.addEventListener("mouseleave", async ()=>{
    if(!callConnected) return;
    await stopHoldListeningAndHandle();
  });
}
bindHold(callBtn);

searchBtn.addEventListener("click", async ()=>{
  const t = (query.value || "").trim();
  if(!t) return;

  const p=getProfile();
  p.lastSearch = t;
  saveProfile(p);

  await runSearch(t);

  const nm = p.name || "Doctor";
  await speak(resultsLine(nm));
  setStatus("Dobara bolna ho to " + HOLD_HINT);
});

/* ---------- INIT ---------- */
hideSupport();
setStatus("");
if(typeof hint !== "undefined") hint.innerText = "Call dabayen. Phir 🎤 ko press & hold karke bolen.";