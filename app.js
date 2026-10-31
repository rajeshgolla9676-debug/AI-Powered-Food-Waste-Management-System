const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const starter=[
{id:1,name:"Seasonal vegetable bowls",category:"Prepared meals",quantity:"24 portions",location:"Banjara Hills, Hyderabad",provider:"Riverstone Foods",emoji:"🥗",status:"Available",deadline:"Today, 2:30 PM"},
{id:2,name:"Fresh mixed vegetables",category:"Produce",quantity:"8 kg",location:"Jubilee Hills, Hyderabad",provider:"Green Basket Market",emoji:"🥦",status:"Available",deadline:"Today, 5:00 PM"},
{id:3,name:"Assorted bakery rolls",category:"Bakery",quantity:"36 pieces",location:"Madhapur, Hyderabad",provider:"Daily Crumb Bakery",emoji:"🥖",status:"Reserved",deadline:"Today, 4:00 PM"},
{id:4,name:"Lentil rice meal packs",category:"Prepared meals",quantity:"18 portions",location:"Gachibowli, Hyderabad",provider:"Riverstone Foods",emoji:"🍛",status:"Available",deadline:"Today, 3:00 PM"},
{id:5,name:"Fresh apples",category:"Produce",quantity:"12 kg",location:"Kondapur, Hyderabad",provider:"Orchard Corner",emoji:"🍎",status:"Collected",deadline:"Today, 11:00 AM"},
{id:6,name:"Curd cups",category:"Dairy",quantity:"20 cups",location:"Hitech City, Hyderabad",provider:"Daily Dairy Co.",emoji:"🥛",status:"Available",deadline:"Today, 1:45 PM"}];
let items;try{items=JSON.parse(localStorage.getItem("foodloop-listings"))||starter}catch{items=starter}
let nextId=Math.max(0,...items.map(x=>x.id))+1;
const safe=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const status=s=>`<span class="status ${s.toLowerCase()}">${safe(s)}</span>`;
function save(){localStorage.setItem("foodloop-listings",JSON.stringify(items))}
function toast(s){let t=$("#toast");t.textContent=s;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),2600)}
function row(x,full=false){return `<tr><td><span class="food-name">${safe(x.emoji)} &nbsp;${safe(x.name)}<small>${safe(x.provider)}</small></span></td><td>${safe(x.quantity)}</td>${full?`<td>${safe(x.location)}</td>`:""}<td>${status(x.status)}</td><td>${safe(x.deadline)}</td>${full?`<td>${x.status==="Available"?`<button class="link" data-reserve="${x.id}">Reserve</button>`:"—"}</td>`:""}</tr>`}
function renderTables(){$("#recent").innerHTML=items.slice(0,4).map(x=>row(x)).join("");$("#allListings").innerHTML=items.map(x=>row(x,true)).join("")||'<tr><td colspan="6">No listings yet.</td></tr>'}
function renderFood(){let q=($("#search")?.value||"").toLowerCase(),cat=$("#category")?.value||"all";let list=items.filter(x=>(cat==="all"||x.category===cat)&&[x.name,x.provider,x.location].join(" ").toLowerCase().includes(q));$("#foodGrid").innerHTML=list.length?list.map(x=>`<article class="food-card"><div class="art">${status(x.status)}<span>${safe(x.emoji)}</span></div><div class="food-body"><h3>${safe(x.name)}</h3><p>by ${safe(x.provider)} · ${safe(x.category)}</p><div class="food-meta"><span>Quantity<br><b>${safe(x.quantity)}</b></span><span>Pickup deadline<br><b>${safe(x.deadline)}</b></span></div><p>⌖ ${safe(x.location)}</p><button class="small-btn" ${x.status!=="Available"?"disabled":""} data-reserve="${x.id}">${x.status==="Available"?"Request pickup ↗":"Not available"}</button></div></article>`).join(""):'<div class="panel">No food listings found. Try another search.</div>'}
function render(){renderTables();renderFood()}
function page(id){$$(".page").forEach(p=>p.classList.toggle("active",p.id===id));$$(".nav").forEach(b=>b.classList.toggle("active",b.dataset.page===id));$("#crumb").textContent=({overview:"Overview",discover:"Discover food",listings:"My listings",impact:"Impact analytics"})[id]||"Overview";window.scrollTo(0,0)}
function open(){let d=new Date(Date.now()+3*60*60*1000);d.setMinutes(d.getMinutes()-d.getTimezoneOffset());$('input[name="deadline"]').value=d.toISOString().slice(0,16);$("#modal").classList.add("show")}
function close(){$("#modal").classList.remove("show");$("#form").reset()}
$$(".nav").forEach(b=>b.addEventListener("click",()=>page(b.dataset.page)));
$$("[data-goto]").forEach(b=>b.addEventListener("click",()=>page(b.dataset.goto)));
["createBtn","discoverCreate","listCreate"].forEach(id=>$("#"+id).addEventListener("click",open));
$("#close").addEventListener("click",close);$("#modal").addEventListener("click",e=>{if(e.target.id==="modal")close()});
$("#form").addEventListener("submit",e=>{e.preventDefault();let d=Object.fromEntries(new FormData(e.currentTarget));items.unshift({id:nextId++,name:d.name.trim(),category:d.category,quantity:d.quantity.trim(),location:d.location.trim(),provider:"Riverstone Foods",emoji:({"Prepared meals":"🍛",Produce:"🥦",Bakery:"🥖",Dairy:"🥛",Other:"🥗"})[d.category]||"🥗",status:"Available",deadline:new Date(d.deadline).toLocaleString([], {month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}),prepared:d.prepared,storage:d.storage,notes:d.notes});save();render();close();page("listings");toast("Listing published in this demo workspace.")});
$("#search").addEventListener("input",renderFood);$("#category").addEventListener("change",renderFood);
document.addEventListener("click",e=>{let b=e.target.closest("[data-reserve]");if(!b)return;let x=items.find(a=>a.id===Number(b.dataset.reserve));if(!x||x.status!=="Available")return;x.status="Reserved";save();render();toast("Pickup request recorded. Contact the provider to confirm details.")});
$("#export").addEventListener("click",()=>{let rows=[["FoodLoop AI sample listings"],["Food","Category","Quantity","Provider","Location","Status","Deadline"],...items.map(x=>[x.name,x.category,x.quantity,x.provider,x.location,x.status,x.deadline])];let csv=rows.map(r=>r.map(v=>'"'+String(v??"").replace(/"/g,'""')+'"').join(",")).join("\r\n");let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="foodloop-demo-listings.csv";a.click();URL.revokeObjectURL(a.href);toast("CSV report exported.")});
$("#menu").addEventListener("click",()=>toast("Use the navigation on larger screens; mobile navigation is simplified in this prototype."));
document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
render();