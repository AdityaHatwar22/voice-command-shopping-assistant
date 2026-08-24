const state = { items: JSON.parse(localStorage.getItem("voicecart_items") || "[]") };
const micBtn = document.getElementById("micBtn");
const transcript = document.getElementById("transcript");
const voiceStatus = document.getElementById("voiceStatus");
const language = document.getElementById("language");
const message = document.getElementById("message");

function save(){ localStorage.setItem("voicecart_items", JSON.stringify(state.items)); render(); }

function flash(text, error=false){
  message.textContent = text;
  message.style.color = error ? "#b42318" : "#2e6b43";
  setTimeout(()=>message.textContent="", 3500);
}

function render(){
  const box=document.getElementById("list"), empty=document.getElementById("empty");
  box.innerHTML="";
  empty.style.display=state.items.length?"none":"block";
  state.items.forEach((x,i)=>{
    const row=document.createElement("div"); row.className="item";
    row.innerHTML=`<div class="item-info"><strong>${escapeHtml(x.name)}</strong><span class="badge">${escapeHtml(x.category||"General")}</span></div>
      <div class="qty"><button onclick="changeQty(${i},-1)">−</button><b>${x.quantity}</b><button onclick="changeQty(${i},1)">+</button><button class="small" onclick="removeItem(${i})">Remove</button></div>`;
    box.appendChild(row);
  });
  loadSuggestions();
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function changeQty(i,d){state.items[i].quantity+=d;if(state.items[i].quantity<=0)state.items.splice(i,1);save();}
function removeItem(i){state.items.splice(i,1);save();}

async function processCommand(text){
  transcript.textContent=text;
  const res=await fetch("/api/command",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text})});
  const data=await res.json();
  if(!data.ok){flash(data.message,true);return;}
  if(data.action==="add"){
    const existing=state.items.find(x=>x.name.toLowerCase()===data.item.toLowerCase());
    if(existing) existing.quantity+=data.quantity;
    else state.items.push({name:data.item,quantity:data.quantity,category:categoryFor(data.item)});
    save(); flash(`Added ${data.quantity} × ${data.item}`);
    checkSubstitutes(data.item);
  }else if(data.action==="remove"){
    const before=state.items.length;
    state.items=state.items.filter(x=>x.name.toLowerCase()!==data.item.toLowerCase());
    save(); flash(before===state.items.length?`${data.item} was not on the list.`:`Removed ${data.item}`);
  }else{
    flash(`Try “add ${data.item}” or “remove ${data.item}”.`,true);
  }
}
function categoryFor(name){
  const n=name.toLowerCase();
  if(["milk","eggs","butter"].some(x=>n.includes(x)))return "Dairy";
  if(["apple","banana","orange","tomato"].some(x=>n.includes(x)))return "Produce";
  if(["bread"].some(x=>n.includes(x)))return "Bakery";
  if(["rice"].some(x=>n.includes(x)))return "Staples";
  if(["toothpaste"].some(x=>n.includes(x)))return "Personal Care";
  return "General";
}
async function checkSubstitutes(item){
  const r=await fetch("/api/substitutes?item="+encodeURIComponent(item));
  const subs=await r.json();
  if(subs.length) flash(`Alternative options: ${subs.join(", ")}`);
}

let recognition=null;
const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
if(SpeechRecognition){
  recognition=new SpeechRecognition();
  recognition.continuous=false; recognition.interimResults=true;
  recognition.onstart=()=>{micBtn.classList.add("listening");voiceStatus.textContent="Listening…";};
  recognition.onend=()=>{micBtn.classList.remove("listening");voiceStatus.textContent="Tap the microphone";};
  recognition.onerror=()=>flash("Voice recognition failed. Please try again.",true);
  recognition.onresult=e=>{
    let finalText="";
    for(let i=e.resultIndex;i<e.results.length;i++) finalText+=e.results[i][0].transcript;
    transcript.textContent=finalText;
    if(e.results[e.results.length-1].isFinal) processCommand(finalText);
  };
  micBtn.onclick=()=>{recognition.lang=language.value;recognition.start();};
}else{
  micBtn.onclick=()=>flash("Your browser does not support Speech Recognition. Try Chrome/Edge.",true);
}

document.getElementById("clearBtn").onclick=()=>{state.items=[];save();flash("Shopping list cleared.");};
document.getElementById("searchBtn").onclick=search;
document.getElementById("searchInput").addEventListener("keydown",e=>{if(e.key==="Enter")search();});

async function search(){
  const q=document.getElementById("searchInput").value;
  const brand=document.getElementById("brandInput").value;
  const price=document.getElementById("priceInput").value;
  const params=new URLSearchParams({q,brand}); if(price)params.set("max_price",price);
  const data=await (await fetch("/api/search?"+params)).json();
  const box=document.getElementById("results"); box.innerHTML="";
  if(!data.length){box.innerHTML="<p class='empty'>No products found.</p>";return;}
  data.forEach(p=>{
    const d=document.createElement("div");d.className="result";
    d.innerHTML=`<div><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(p.brand)} • ${escapeHtml(p.category)}</small></div><div><b>$${p.price.toFixed(2)}</b><button class="small" onclick='addSearchItem(${JSON.stringify(p.name)})'>Add</button></div>`;
    box.appendChild(d);
  });
}
function addSearchItem(name){state.items.push({name,quantity:1,category:categoryFor(name)});save();flash(`Added ${name}`);}

async function loadSuggestions(){
  const history=state.items.map(x=>x.name).join(",");
  const data=await (await fetch("/api/suggestions?history="+encodeURIComponent(history))).json();
  const box=document.getElementById("suggestions"); box.innerHTML="";
  data.forEach(s=>{
    const d=document.createElement("div");d.className="suggestion";
    d.innerHTML=`<div><strong>${escapeHtml(s.name)}</strong><small>${escapeHtml(s.reason)}</small></div><button class="small" onclick='addSearchItem(${JSON.stringify(s.name)})'>Add</button>`;
    box.appendChild(d);
  });
}
render();
