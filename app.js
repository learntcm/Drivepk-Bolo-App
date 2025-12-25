/* =========================================
   DrivePK BOLO – app.js (NO DOUBLE TALK)
   PAID voice.php ONLY
   Fixes:
   - overlapping audio (stop old audio before new)
   - touch+mouse double firing (pointer events only)
   - speechSynthesis leftovers (cancel defensively)
========================================= */

const VOICE_API  = "https://meilibeauty.co.uk/voice.php";
const SEARCH_API = "https://meilibeauty.co.uk/search.php";
const COMPANY_NUMBER = "051 8319037";

const LADIES = ["Kiran","Reshma","Mahnoor","Gul Noor","Dil Bahar","Shaheen"];
const SILENCE_MS = 5000;
const END_WAIT_MS = 700;

let callConnected = false;
let recognition = null;
let isRecognizing = false;
let transcript = "";
let silenceTimer = null;

let micReady = false;

// audio / speech locks
let currentAudio = null;
let speakSeq = 0;          // cancels late responses
let speakBusy = false;     // one speak at a time

// pointer hold state
let holding = false;

/* ---------- storage ---------- */
function getProfile(){ return JSON.parse(localStorage.getItem("boloProfile") || "{}"); }
function saveProfile(p){ localStorage.setItem("boloProfile", JSON.stringify(p)); }
function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function getOrAssignLady(){
  const p = getProfile();
  if(!p.lady){ p.lady = rand(LADIES); saveProfile(p); }
  return p.lady;
}

/* ---------- helpers ---------- */
function setStatus(t){ status.innerText = t || ""; }
function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
function clearSilence(){ if(silenceTimer){ clearTimeout(silenceTimer); silenceTimer=null; } }
function showSupport(){ if(supportBox) supportBox.style.display="block"; }
function hideSupport(){ if(supportBox) supportBox.style.display="none"; }

/* ---------- hard stop audio + device tts ---------- */
function stopAllVoiceEngines(){
  // stop any HTMLAudio
  if(currentAudio){
    try{ currentAudio.pause(); currentAudio.currentTime = 0; }catch(e){}
    currentAudio = null;
  }
  // cancel device TTS if any old code used it
  try{
    if(window.speechSynthesis){
      window.speechSynthesis.cancel();
    }
  }catch(e){}
}

/* ---------- mic warmup ---------- */
async function warmupMic(){
  if(micReady) return true;
  try{
    const s = await navigator.mediaDevices.getUserMedia({audio:true});
    s.getTracks().forEach(t=>t.stop());
    micReady = true;
    return true;
  }catch{
    return false;
  }
}

/* ---------- stop mic ---------- */
function stopMic(){
  if(!recognition) return;
  try{ recognition.onresult=null; recognition.onerror=null; recognition.onend=null; }catch(e){}
  try{ recognition.abort(); }catch(e){}
  try{ recognition.stop(); }catch(e){}
  isRecognizing = false;
  clearSilence();
}

/* ---------- PAID voice only (single-flight, no overlap) ---------- */
async function speak(text){
  const mySeq = ++speakSeq;

  // if another speak is running, stop it immediately and replace
  stopMic();
  stopAllVoiceEngines();
  clearSilence();

  // lock (prevents accidental double calls stacking)
  if(speakBusy){
    // cancel previous speak by bumping seq; then continue
    // (previous audio already stopped above)
  }
  speakBusy = true;

  setStatus(text);

  let res;
  try{
    res = await fetch(VOICE_API,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ text })
    });
  }catch{
    if(mySeq === speakSeq) speakBusy = false;
    return;
  }

  if(!res || !res.ok){
    if(mySeq === speakSeq) speakBusy = false;
    return;
  }

  const blob = await res.blob();

  // if a newer speak started while we fetched, ignore this one
  if(mySeq !== speakSeq){
    speakBusy = false;
    return;
  }

  const audio = new Audio(URL.createObjectURL(blob));
  currentAudio = audio;

  return new Promise(resolve=>{
    const done = ()=>{
      if(mySeq === speakSeq){
        currentAudio = null;
        speakBusy = false;
      }
      resolve();
    };
    audio.onended = done;
    audio.onerror = done;
    audio.play().catch(done);
  });
}

/* ---------- ring 1-3 times ---------- */
async function ring(){
  const times = Math.floor(Math.random()*3)+1;
  for(let i=0;i<times;i++){
    await new Promise(r=>{
      const a = new Audio("ringtone.mp4");
      a.onended = ()=>setTimeout(r,350);
      a.play().catch(r);
    });
  }
}

/* ---------- STT setup ---------- */
if("webkitSpeechRecognition" in window){
  recognition = new webkitSpeechRecognition();
  recognition.lang = "en-IN";
  recognition.interimResults = false;
  recognition.continuous = false;
}

/* ---------- hold-to-talk (pointer events only) ---------- */
async function startListening(){
  if(!callConnected) return;
  if(holding) return; // prevent double start
  holding = true;

  stopAllVoiceEngines(); // ensure no audio playing while listening
  hideSupport();

  if(!recognition){
    holding = false;
    await speak("Mic supported nahi hai. Please type karke search karein.");
    return;
  }

  const ok = await warmupMic();
  if(!ok){
    holding = false;
    await speak("Mic permission allow nahi. Please type kar dein.");
    return;
  }

  transcript = "";
  isRecognizing = true;

  callBtn.classList.add("talking");
  callBtn.innerText = "🎙 LISTENING…";
  setStatus("Sun rahi hoon… (hold rakhein)");

  clearSilence();
  silenceTimer = setTimeout(async ()=>{
    if(isRecognizing && !transcript){
      const p=getProfile();
      await speak(`${p.name || "Doctor"} bhai, model year aur city bol dein.`);
    }
  }, SILENCE_MS);

  recognition.onresult = e=>{
    transcript = e?.results?.[0]?.[0]?.transcript || "";
  };
  recognition.onerror = ()=>{
    // handled on stop
  };
  recognition.onend = ()=>{
    isRecognizing = false;
    clearSilence();
  };

  try{ recognition.start(); }catch(e){
    holding = false;
    isRecognizing = false;
    clearSilence();
  }
}

async function stopListening(){
  if(!holding) return;
  holding = false;

  callBtn.classList.remove("talking");
  callBtn.innerText = "🎤 HOLD TO TALK";

  if(!recognition || !isRecognizing) return;

  clearSilence();
  try{ recognition.stop(); }catch(e){}
  await sleep(END_WAIT_MS);

  const spoken = (transcript || "").trim();
  if(!spoken){
    await speak("Awaaz clear nahi aayi. Dobara bolen ya type karein.");
    return;
  }
  await handleSpoken(spoken);
}

/* ---------- intents ---------- */
function n(t){ return (t||"").toLowerCase(); }
function wantsComplaint(t){ t=n(t); return t.includes("complaint") || t.includes("shikayat") || t.includes("complain"); }
function wantsBoss(t){ t=n(t); return t.includes("boss") || t.includes("umar"); }
function wantsNewLady(t){
  t=n(t);
  return t.includes("change lady") || t.includes("dusri") || t.includes("aur madam") || t.includes("khoobsurat lady");
}

/* ---------- main spoken router ---------- */
async function handleSpoken(t){
  const p = getProfile();
  const lady = getOrAssignLady();

  // first time name capture (simple)
  if(!p.name){
    p.name = t.split(" ")[0];
    saveProfile(p);
    await speak(`Shukriya ${p.name} bhai. Ab apni requirement bol dein.`);
    return;
  }

  if(wantsComplaint(t)){
    showSupport();
    await speak(`${p.name} bhai, complaint ke liye please is number par call karein: ${COMPANY_NUMBER}.`);
    return;
  }

  hideSupport();

  if(wantsBoss(t)){
    await speak(`${p.name} bhai, main Umar hoon. Bataiye kya masla hai ya kya madad chahiye?`);
    return;
  }

  if(wantsNewLady(t)){
    const others = LADIES.filter(x=>x!==lady);
    p.lady = rand(others.length ? others : LADIES);
    saveProfile(p);
    await speak(`${p.name} bhai, theek hai. Ab ${p.lady} baat karegi.`);
    return;
  }

  // otherwise search
  query.value = t;
  await runSearch(t);
  await speak(`${p.name} bhai, yeh rahi aap ki search results.`);
}

/* ---------- search ---------- */
async function runSearch(text){
  results.innerHTML = "<p>Gaariyan dhoondi ja rahi hain…</p>";

  let res;
  try{
    res = await fetch(SEARCH_API,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ text })
    });
  }catch{
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

/* ---------- call flow ---------- */
async function connectCall(){
  stopAllVoiceEngines();
  stopMic();
  hideSupport();

  callBtn.classList.add("calling");
  callBtn.innerText = "📞 CALLING…";
  callBtn.disabled = true;

  await ring();

  callConnected = true;
  callBtn.classList.remove("calling");
  callBtn.disabled = false;
  callBtn.innerText = "🎤 HOLD TO TALK";

  if(hint) hint.innerText = "🎤 Press & hold karke bolen.";

  const p = getProfile();
  getOrAssignLady();

  if(!p.name){
    await speak("Assalam o Alaikum! DrivePK mein khush aamadid. Aap ka naam kya hai?");
  }else{
    await speak(`${p.name} bhai, Assalam o Alaikum. Bataiye konsi gaari chahiye?`);
  }
}

/* ---------- wire events ---------- */
hideSupport();
setStatus("");
if(hint) hint.innerText = "Call dabayen. Phir 🎤 ko press & hold karke bolen.";

callBtn.addEventListener("click", async ()=>{
  if(!callConnected) await connectCall();
});

// pointer events prevent double firing on mobile
callBtn.addEventListener("pointerdown", (e)=>{
  if(!callConnected) return;
  e.preventDefault();
  try{ callBtn.setPointerCapture(e.pointerId); }catch{}
  startListening();
});

callBtn.addEventListener("pointerup", (e)=>{
  if(!callConnected) return;
  e.preventDefault();
  stopListening();
});

callBtn.addEventListener("pointercancel", (e)=>{
  if(!callConnected) return;
  e.preventDefault();
  stopListening();
});

searchBtn.addEventListener("click", async ()=>{
  const t = (query.value || "").trim();
  if(!t) return;
  await runSearch(t);

  const p = getProfile();
  if(p.name){
    await speak(`${p.name} bhai, yeh rahi aap ki search results.`);
  }
});