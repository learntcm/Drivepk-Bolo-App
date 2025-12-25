/* =========================================
   DrivePK BOLO – app.js
   PAID OPENAI VOICE ONLY
   Roman Urdu ONLY (no Urdu script)
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
function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function getOrAssignLady(){
  const p = getProfile();
  if(!p.lady){
    p.lady = rand(LADIES);
    saveProfile(p);
  }
  return p.lady;
}

/* ---------- UI ---------- */
function setStatus(t){ status.innerText = t || ""; }
function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
function clearSilence(){ if(silenceTimer){ clearTimeout(silenceTimer); silenceTimer=null; } }
function showSupport(){ if(supportBox) supportBox.style.display="block"; }
function hideSupport(){ if(supportBox) supportBox.style.display="none"; }

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

/* ---------- STOP MIC ---------- */
function stopMic(){
  if(!recognition) return;
  try{ recognition.abort(); }catch{}
  try{ recognition.stop(); }catch{}
  isRecognizing = false;
  clearSilence();
}

/* ---------- PAID VOICE ---------- */
async function speak(text){
  stopMic();
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
  }catch{
    speaking = false;
    return;
  }

  if(!res.ok){
    speaking = false;
    return;
  }

  const audio = new Audio(URL.createObjectURL(await res.blob()));
  return new Promise(resolve=>{
    audio.onended = ()=>{ speaking=false; resolve(); };
    audio.onerror = ()=>{ speaking=false; resolve(); };
    audio.play().catch(()=>{ speaking=false; resolve(); });
  });
}

/* ---------- RING ---------- */
async function ring(){
  const times = Math.floor(Math.random()*3)+1;
  for(let i=0;i<times;i++){
    await new Promise(r=>{
      const a = new Audio("ringtone.mp4");
      a.onended = ()=>setTimeout(r,400);
      a.play().catch(r);
    });
  }
}

/* ---------- SPEECH RECOGNITION ---------- */
if("webkitSpeechRecognition" in window){
  recognition = new webkitSpeechRecognition();
  recognition.lang = "en-IN";
  recognition.interimResults = false;
  recognition.continuous = false;
}

/* ---------- HOLD TO TALK ---------- */
async function startListening(){
  if(!callConnected || speaking || !recognition) return;
  const ok = await warmupMic();
  if(!ok){
    await speak("Mic access nahi mil rahi, behtar hai aap type kar dein.");
    return;
  }

  transcript = "";
  isRecognizing = true;
  callBtn.classList.add("talking");
  callBtn.innerText = "🎙 LISTENING…";
  setStatus("Sun rahi hoon…");

  silenceTimer = setTimeout(async ()=>{
    if(isRecognizing && !transcript){
      const p=getProfile();
      await speak(`${p.name||"Doctor"} bhai, model, year aur city bol dein.`);
    }
  }, SILENCE_MS);

  recognition.onresult = e=>{
    transcript = e.results[0][0].transcript;
  };
  recognition.onend = ()=>{ isRecognizing=false; clearSilence(); };
  recognition.start();
}

async function stopListening(){
  if(!isRecognizing) return;
  recognition.stop();
  await sleep(END_WAIT_MS);

  callBtn.classList.remove("talking");
  callBtn.innerText = "🎤 HOLD TO TALK";

  if(!transcript){
    await speak("Awaaz clear nahi aayi, please dobara bolen ya type karein.");
    return;
  }
  await handleSpoken(transcript);
}

/* ---------- INTENTS ---------- */
function n(t){ return t.toLowerCase(); }

function wantsBoss(t){ return n(t).includes("boss") || n(t).includes("umar"); }
function wantsComplaint(t){ return n(t).includes("complaint") || n(t).includes("shikayat"); }
function wantsNewLady(t){ return n(t).includes("dusri") || n(t).includes("change lady"); }
function askingName(t){ return n(t).includes("naam"); }

/* ---------- SPOKEN HANDLER ---------- */
async function handleSpoken(t){
  const p=getProfile();
  const name = p.name || "Doctor";
  const lady = getOrAssignLady();

  if(!p.name){
    p.name = t.split(" ")[0];
    saveProfile(p);
    await speak(`Shukriya ${p.name} bhai. Ab apni requirement bol dein.`);
    return;
  }

  if(wantsComplaint(t)){
    showSupport();
    await speak(`Complaint ke liye please is number par call karein: ${COMPANY_NUMBER}.`);
    return;
  }

  if(wantsBoss(t)){
    await speak(`${name} bhai, main Umar hoon, DrivePK ka boss. Bataiye kya madad chahiye?`);
    return;
  }

  if(wantsNewLady(t)){
    const others = LADIES.filter(x=>x!==lady);
    p.lady = rand(others);
    saveProfile(p);
    await speak(`${name} bhai, ab ${p.lady} baat karegi.`);
    return;
  }

  query.value = t;
  await runSearch(t);
  await speak(`${name} bhai, yeh rahi aap ki search results.`);
}

/* ---------- SEARCH ---------- */
async function runSearch(text){
  hideSupport();
  results.innerHTML="Searching…";
  const res = await fetch(SEARCH_API,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ text })
  });
  const json = await res.json();
  results.innerHTML="";

  if(!json.data || !json.data.length){
    results.innerHTML="<p>Koi gaari nahi mili</p>";
    return;
  }

  json.data.forEach(c=>{
    results.innerHTML+=`
      <div class="car">
        <strong>${c.title}</strong><br>
        ${c.year||""} • ${c.location?.city||""}<br>
        PKR ${c.price||""}
      </div>`;
  });
}

/* ---------- CALL ---------- */
async function connectCall(){
  callBtn.innerText="📞 CALLING…";
  callBtn.disabled=true;
  await ring();
  callConnected=true;
  callBtn.disabled=false;
  callBtn.innerText="🎤 HOLD TO TALK";

  const p=getProfile();
  getOrAssignLady();

  if(!p.name){
    await speak("Assalam o Alaikum! DrivePK mein khush aamadid. Aap ka naam kya hai?");
  }else{
    await speak(`${p.name} bhai, Assalam o Alaikum. Bataiye konsi gaari chahiye?`);
  }
}

/* ---------- EVENTS ---------- */
callBtn.onclick = ()=>{ if(!callConnected) connectCall(); };
callBtn.onmousedown = startListening;
callBtn.onmouseup = stopListening;
callBtn.ontouchstart = e=>{e.preventDefault(); startListening();};
callBtn.ontouchend = e=>{e.preventDefault(); stopListening();};
searchBtn.onclick = ()=>{ if(query.value.trim()) runSearch(query.value.trim()); };