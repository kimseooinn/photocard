var IMGS={
  "addicted_capa": "imagens/addicted_capa.jpg",
  "addicted1": "imagens/addicted1.jpg",
  "addicted2": "imagens/addicted2.jpg",
  "back_addicted": "imagens/back_addicted.jpg",
  "wonhee1": "imagens/wonhee1.jpg",
  "wonhee2": "imagens/wonhee2.jpg",
  "moka1": "imagens/moka1.jpg",
  "moka2": "imagens/moka2.jpg",
  "iroha1": "imagens/iroha1.jpg",
  "iroha2": "imagens/iroha2.jpg",
  "minju1": "imagens/minju1.jpg",
  "minju2": "imagens/minju2.jpg",
  "yunah1": "imagens/yunah1.jpg",
  "yunah2": "imagens/yunah2.jpg",
  "wonyoung1": "imagens/wonyoung1.jpg",
  "wonyoung2": "imagens/wonyoung2.jpg",
  "yujin1": "imagens/yujin1.jpg",
  "yujin2": "imagens/yujin2.jpg",
  "liz1": "imagens/liz1.jpg",
  "liz2": "imagens/liz2.jpg",
  "rei1": "imagens/rei1.jpg",
  "rei2": "imagens/rei2.jpg",
  "gaeul1": "imagens/gaeul1.jpg",
  "gaeul2": "imagens/gaeul2.jpg",
  "leeseo1": "imagens/leeseo1.jpg",
  "leeseo2": "imagens/leeseo2.jpg",
  "back_ive": "imagens/back_ive.jpg",
  "back_illit": "imagens/back_illit.jpg",
  "bp_grupo": "imagens/bp_grupo.jpg",
  "ive_grupo": "imagens/ive_grupo.jpg",
  "illit_grupo": "imagens/illit_grupo.jpg",
  "back_preto": "imagens/back_preto.jpg",
  "back_rosa": "imagens/back_rosa.jpg",
  "jisoo1": "imagens/jisoo1.jpg",
  "jisoo2": "imagens/jisoo2.jpg",
  "jennie1": "imagens/jennie1.jpg",
  "jennie2": "imagens/jennie2.jpg",
  "rose1": "imagens/rose1.jpg",
  "rose2": "imagens/rose2.jpg",
  "lisa1": "imagens/lisa1.jpg",
  "lisa2": "imagens/lisa2.jpg"
};
var CATS=[
 {key:"bp",label:"BLACKPINK",cur:"Todos",items:[
  {m:"Jisoo",t:"Card de álbum",p:18,tag:"Novo",img:"jisoo1"},
  {m:"Jisoo",t:"Lucky draw",p:48,tag:"Raro",img:"jisoo2"},
  {m:"Jennie",t:"Card de álbum",p:18,tag:"Novo",img:"jennie1"},
  {m:"Jennie",t:"Lucky draw",p:48,tag:"Raro",img:"jennie2"},
  {m:"Rosé",t:"Card de álbum",p:18,tag:"Novo",img:"rose1"},
  {m:"Rosé",t:"Lucky draw",p:48,tag:"Raro",img:"rose2"},
  {m:"Lisa",t:"Card de álbum",p:18,tag:"Novo",img:"lisa1"},
  {m:"Lisa",t:"Lucky draw",p:48,tag:"Raro",img:"lisa2"}]},
 {key:"ive",label:"IVE",cur:"Todos",items:[]},
 {key:"illit",label:"ILLIT",cur:"Todos",items:[]},
 {key:"add",label:"Addicted",cur:"Todos",items:[
  {m:"Jisoo",t:"Card exclusivo 1",p:240,tag:"Exclusivo",img:"addicted1"},
  {m:"Jisoo",t:"Card exclusivo 2",p:330,tag:"Exclusivo",img:"addicted2"}]}
];
var PRECO_IVE={wonyoung:130,yujin:118,liz:112,rei:110,leeseo:110,gaeul:110};
["Wonyoung","Yujin","Liz","Rei","Leeseo","Gaeul"].forEach(function(n){
  var k=n.toLowerCase();
  CATS[1].items.push({m:n,t:"Card de álbum",p:18,tag:"Novo",img:k+"1"},{m:n,t:"Lucky draw",p:PRECO_IVE[k],tag:"Raro",img:k+"2"});
});
var PRECO_ILLIT={wonhee:150,iroha:130,minju:110,moka:220,yunah:170};
["Wonhee","Iroha","Minju","Moka","Yunah"].forEach(function(n){
  var k=n.toLowerCase();
  CATS[2].items.push({m:n,t:"Card de álbum",p:18,tag:"Novo",img:k+"1"},{m:n,t:"Lucky draw",p:PRECO_ILLIT[k],tag:"Raro",img:k+"2"});
});
var bag={},flipped={},hp={},rescued={};
var RESCUE={Moka:8};
try{localStorage.removeItem("cardidols-salvas")}catch(e){}
var MONSVG=(function(){
  var rows=["..V......V..","..VV....VV..","..XXXXXXXX..",".XXXXXXXXXX.",".XXEEXXEEXX.","XXXEPXXEPXXX","XXXXXXXXXXXX","XXMMMMMMMMXX","XXMTMTMTMTXX",".XXMMMMMMXX.","..XX.XX.XX.."];
  var col={V:"#B49CFF",X:"#7A5CFF",E:"#fff",P:"#111",M:"#2A1750",T:"#fff"},s="";
  rows.forEach(function(r,y){for(var x=0;x<r.length;x++){var ch=r.charAt(x);if(ch!==".")s+='<rect x="'+x+'" y="'+y+'" width="1" height="1" fill="'+col[ch]+'"/>'}});
  return '<svg viewBox="0 0 12 11" shape-rendering="crispEdges" aria-hidden="true">'+s+'</svg>';
})();
function isLocked(c,i){return c.key==="illit"&&!!RESCUE[i.m]&&!rescued[i.m]}
function say(t){document.getElementById("live").textContent=t}
function hit(name){
  hp[name]=(hp[name]==null?RESCUE[name]:hp[name])-1;
  var left=Math.max(hp[name],0);
  document.querySelectorAll('[data-lock="'+name+'"]').forEach(function(b){
    var m=b.querySelector(".mon");
    b.querySelector(".hpfill").style.width=(left/RESCUE[name]*100)+"%";
    m.classList.remove("hit");void m.offsetWidth;m.classList.add("hit");
    b.setAttribute("aria-label","Salvar "+name+": faltam "+left+" toques no monstro");
  });
  if(left>0){say("Faltam "+left+" toques");return}
  document.querySelectorAll('[data-lock="'+name+'"] .mon').forEach(function(m){m.classList.add("gone")});
  rescued[name]=true;
  say(name+" foi salva! Card liberado.");
  setTimeout(function(){var c=CATS[2];c.justFreed=name;renderGrid(c);c.justFreed=null},750);
}
CATS.forEach(function(c){
  c.groups=["Todos"].concat(c.items.map(function(i){return i.m}).filter(function(g,k,a){return a.indexOf(g)===k}));
  c.top={};c.items.forEach(function(i){if(!c.top[i.m]||i.p>c.top[i.m].p)c.top[i.m]=i});
});
function backOf(c,i){return c.top[i.m]===i?"back_preto":"back_rosa"}
function brl(n){return n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}

function renderFilters(c){
  var f=document.getElementById(c.key+"-filters");f.innerHTML="";f.hidden=c.groups.length<3;
  c.groups.forEach(function(g){
    var b=document.createElement("button");b.type="button";b.className="chip";b.textContent=g;
    b.setAttribute("aria-pressed",String(g===c.cur));
    b.onclick=function(){c.cur=g;renderFilters(c);renderGrid(c)};
    f.appendChild(b);
  });
}
function renderGrid(c){
  var grid=document.getElementById(c.key+"-grid");grid.innerHTML="";
  var list=c.items.filter(function(i){return c.cur==="Todos"||i.m===c.cur});
  list.forEach(function(i){
    var id=c.key+i.m+i.t,on=!!bag[id],isFlip=!!flipped[id],ive=c.key==="ive",ill=c.key==="illit",lock=isLocked(c,i);
    var lbl=i.m+", "+i.t.toLowerCase();
    var left=lock?(hp[i.m]==null?RESCUE[i.m]:hp[i.m]):0;
    var el=document.createElement("article");el.className="item"+(c.justFreed===i.m?" freed":"");
    var back='<span class="art back"></span>';
    var mon=lock?'<span class="mon">'+MONSVG+'<span class="hp"><span class="hpfill" style="width:'+(left/RESCUE[i.m]*100)+'%"></span></span></span>':'';
    el.innerHTML='<button class="flip" type="button"'+(lock?' data-lock="'+i.m+'"':'')+' aria-pressed="'+isFlip+'" aria-label="'+(lock?"Salvar "+i.m+": faltam "+left+" toques no monstro":(isFlip?"Ver a frente":"Ver o verso")+": "+lbl)+'">'+
      '<span class="card3d"><span class="art"><span class="tag">'+i.tag+'</span>'+(i.img?'':'<span class="initial">'+i.m.charAt(0)+'</span>')+mon+'</span>'+back+'</span></button>'+
      '<div><h3>'+i.m+'</h3><p class="meta">'+c.label+', '+i.t.toLowerCase()+'</p>'+(lock?'<p class="lockmsg">Presa pelo monstro. Toque nele para salvar.</p>':'')+'</div>'+
      '<div class="row"><span class="price">'+brl(i.p)+'</span>'+
      (lock?'<button class="add" type="button" disabled>Bloqueado</button>':'<button class="add" type="button" aria-pressed="'+on+'">'+(on?"Na sacola":"Adicionar")+'</button>')+'</div>';
    var flip=el.querySelector(".flip"),faces=flip.querySelectorAll(".art");
    if(i.img){faces[0].style.background="url("+IMGS[i.img]+") center top/cover no-repeat"}else{faces[0].classList.add("ph")}
    faces[1].style.background="url("+IMGS[ive?"back_ive":ill?"back_illit":c.key==="add"?"back_addicted":backOf(c,i)]+") center/cover no-repeat";
    flip.addEventListener("pointermove",function(e){var r=flip.getBoundingClientRect(),k=flip.firstChild;
      k.style.setProperty("--mx",((e.clientX-r.left)/r.width*100)+"%");
      k.style.setProperty("--my",((e.clientY-r.top)/r.height*100)+"%")});
    flip.onclick=function(){
      if(lock){hit(i.m);return}
      var v=flip.getAttribute("aria-pressed")!=="true";
      flipped[id]=v;flip.setAttribute("aria-pressed",String(v));
      flip.setAttribute("aria-label",(v?"Ver a frente":"Ver o verso")+": "+lbl)};
    el.querySelector(".add").onclick=function(){
      toggleBag(c,i,id);renderGrid(c);
    };
    grid.appendChild(el);
  });
  document.getElementById("live").textContent=c.label+": "+list.length+" cards exibidos";
}

/* inclinação do card do hero */
(function(){
  var card=document.getElementById("heroCard");
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  var stage=card.parentNode;
  stage.addEventListener("pointermove",function(e){
    var r=card.getBoundingClientRect();
    var x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
    card.style.setProperty("--ry",((x-.5)*22)+"deg");
    card.style.setProperty("--rx",((.5-y)*22)+"deg");
    card.style.setProperty("--mx",(x*100)+"%");card.style.setProperty("--my",(y*100)+"%");
  });
  stage.addEventListener("pointerleave",function(){
    card.style.setProperty("--rx","0deg");card.style.setProperty("--ry","0deg");
    card.style.setProperty("--mx","50%");card.style.setProperty("--my","50%");
  });
})();

/* anúncio do clipe da Jisoo */
(function(){
  var v=document.getElementById("adVideo");
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){v.removeAttribute("autoplay");v.pause()}
  document.getElementById("adClose").onclick=function(){document.getElementById("adWrap").hidden=true};
})();

/* clipe de cada grupo: pergunta antes de abrir o YouTube */
var CLIPES={
  bp:{nome:"BLACKPINK",url:"https://youtu.be/CgCVZdcKcqY?si=uar51F4mSkFoLn7q"},
  ive:{nome:"IVE",url:"https://youtu.be/rsNhWkC4neE?si=7rotkgZe4gkbiXaX"},
  illit:{nome:"ILLIT",url:"https://youtu.be/V2V9-9VhYJo?si=Lt3vX0OgOSCm_eNN"},
  add:{nome:"Addicted",url:"https://youtu.be/Pksr9T8m_aA?si=_8MIU_c2lpOdINXW"}
};
document.querySelectorAll("[data-clip]").forEach(function(b){
  b.onclick=function(){
    var c=CLIPES[b.dataset.clip];
    document.getElementById("clipNome").textContent=c.nome;
    document.getElementById("clipGo").href=c.url;
    document.getElementById("clipDialog").showModal();
  };
});
document.getElementById("clipGo").onclick=function(){document.getElementById("clipDialog").close()};
document.getElementById("clipNo").onclick=function(){document.getElementById("clipDialog").close()};

document.getElementById("heroCard").style.background="url("+IMGS.addicted1+") center top/cover no-repeat";
document.getElementById("heroCard").onclick=function(){
  var reduz=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("addicted").scrollIntoView({behavior:reduz?"auto":"smooth"});
  var cards=document.querySelectorAll("#add-grid .item");
  cards.forEach(function(el){el.classList.remove("flash");void el.offsetWidth;el.classList.add("flash")});
  setTimeout(function(){cards.forEach(function(el){el.classList.remove("flash")})},2600);
};
document.getElementById("illitPhoto").src=IMGS.illit_grupo;
document.getElementById("addFoto").src=IMGS.addicted_capa;
document.getElementById("bpFoto").src=IMGS.bp_grupo;
document.getElementById("iveFoto").src=IMGS.ive_grupo;
CATS.forEach(function(c){renderFilters(c);renderGrid(c)});
updateBag();