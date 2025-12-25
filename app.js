/* =========================================
   DrivePK BOLO – app.js
   Depends on:
   - voice-lines.js
   - index.html (UI only)
========================================= */

/* ---------- CONFIG ---------- */
const VOICE_API  = "https://meilibeauty.co.uk/voice.php";
const SEARCH_API = "https://meilibeauty.co.uk/search.php";
const COMPANY_NUMBER = "051 8319037";

/* ---------- STATE ---------- */
let callConnected = false;
let speaking = false;
let recognition = null;
let listening = false;
let transcript = "";
let silenceTimer = null;
let micReady = false;

/* ---------- STORAGE ---------- */
function getProfile(){
  return JSON.parse(localStorage.getItem("boloProfile") || "{}");
}
function saveProfile(p){
  localStorage.setItem("boloProfile", JSON.stringify(p));
}

/* ---------- UTIL ---------- */
function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function isAndroidChrome(){
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes("android") && ua.includes("chrome") && !ua.includes("samsungbrowser");
}

/* ---------- UI ---------- */
function setStatus(t){ status.innerText = t || ""; }
function showSupport(){ supportBox.style.display="block"; }
function hideSupport(){ supportBox.style.display="none"; }

/* ---------- MIC WARMUP ---------- */
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

/* ---------- SPEECH (HYBRID) ---------- */
async function speak(text){
  speaking = true;
  setStatus(text);

  if(isAndroidChrome()){
    await speakFree(text);
    speaking = false;
    return;
  }

  const res = await fetch(VOICE_API,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ text })
  });

  const blob = await res.blob();
  const audio = new Audio(URL.createObjectURL(blob));

  return new Promise(resolve=>{
    audio.onended = ()=>{ speaking=false; resolve(); };
    audio.onerror = ()=>{ speaking=false; resolve(); };
    audio.play();
  });
}

/* ---------- ASSISTANT SPEAK ---------- */
async function speakAssistant(block){
  const text = isAndroidChrome()
    ? rand(block.urdu)
    : rand(block.roman);
  await speak(text);
}

/* ---------- RING ---------- */
async function ring(){
  const times = Math.floor(Math.random()*3)+1;
  for(let i=0;i<times;i++){
    await new Promise(r=>{
      const a=new Audio("ringtone.mp4");
      a.onended=()=>setTimeout(r,400);
      a.play().catch(r);
    });
  }
}

/* ---------- STT ---------- */
if("webkitSpeechRecognition" in window){
  recognition = new webkitSpeechRecognition();
  recognition.lang = "en-IN";
  recognition.interimResults = false;
  recognition.continuous = false;
}

async function startListening(){
  if(speaking || !recognition) return;
  const ok = await warmupMic();
  if(!ok){
    await speakAssistant(VOICE_LINES.mic_issue);
    return;
  }

  transcript = "";
  listening = true;

  recognition.onresult = e=>{
    transcript = e.results[0][0].transcript;
  };

  recognition.onend = ()=>{
    listening=false;
    clearTimeout(silenceTimer);
  };

  silenceTimer = setTimeout(async ()=>{
    if(!transcript){
      const p=getProfile();
      await speakAssistant(VOICE_LINES.ask_requirement(p.name||"Doctor"));
    }
  },5000);

  recognition.start();
}

async function stopListening(){
  if(!listening) return;
  recognition.stop();
  await sleep(800);

  if(!transcript){
    await speakAssistant(VOICE_LINES.mic_issue);
    return;
  }

  handleSpoken(transcript);
}

/* ---------- INTENT ---------- */
function norm(t){
  return t.toLowerCase();
}

function wantsBoss(t){
  return norm(t).includes("boss") || norm(t).includes("umar");
}
function wantsComplaint(t){
  return norm(t).includes("complaint") || norm(t).includes("shikayat");
}
function wantsNewLady(t){
  return norm(t).includes("dusri") || norm(t).includes("change lady");
}
function askingName(t){
  return norm(t).includes("naam");
}

/* ---------- HANDLE SPOKEN ---------- */
async function handleSpoken(t){
  const p=getProfile();
  const name = p.name || "Doctor";

  if(wantsComplaint(t)){
    showSupport();
    await speakAssistant(VOICE_LINES.complaint);
    return;
  }

  hideSupport();

  if(wantsBoss(t)){
    await speakAssistant(VOICE_LINES.boss_intro(name));
    return;
  }

  if(!p.name){
    p.name = t.split(" ")[0];
    saveProfile(p);
    await speakAssistant(VOICE_LINES.ask_requirement(p.name));
    return;
  }

  query.value = t;
  await runSearch(t);
  await speakAssistant(VOICE_LINES.results_ready(name));
}

/* ---------- SEARCH ---------- */
async function runSearch(text){
  results.innerHTML="Searching…";
  const res = await fetch(SEARCH_API,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ text })
  });

  const json = await res.json();
  results.innerHTML="";

  if(!json.data || !json.data.length){
    results.innerHTML="<p>No cars found</p>";
    return;
  }

  json.data.forEach(c=>{
    results.innerHTML+=`
      <div class="car">
        <strong>${c.title}</strong><br>
        ${c.year||""} • ${c.location?.city||""}<br>
        PKR ${c.price||""}
      </div>
    `;
  });
}

/* ---------- CALL FLOW ---------- */
async function connectCall(){
  callBtn.innerText="📞 CALLING…";
  callBtn.disabled=true;

  await ring();

  callConnected=true;
  callBtn.disabled=false;
  callBtn.innerText="🎤 HOLD TO TALK";

  const p=getProfile();
  if(!p.name){
    await speakAssistant(VOICE_LINES.welcome_first);
    await sleep(3000);
    await speakAssistant(VOICE_LINES.ask_name);
  }else{
    await speakAssistant(VOICE_LINES.welcome_back(p.name));
    await sleep(3000);
    await speakAssistant(VOICE_LINES.ask_requirement(p.name));
  }
}

/* ---------- BUTTONS ---------- */
callBtn.onclick = async ()=>{
  if(!callConnected) await connectCall();
};

callBtn.addEventListener("mousedown", startListening);
callBtn.addEventListener("mouseup", stopListening);
callBtn.addEventListener("touchstart", e=>{e.preventDefault(); startListening();},{passive:false});
callBtn.addEventListener("touchend", e=>{e.preventDefault(); stopListening();},{passive:false});

searchBtn.onclick = async ()=>{
  if(query.value.trim()){
    await runSearch(query.value.trim());
  }
};