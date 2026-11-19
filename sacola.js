/* Sacola, cupom e checkout de demonstração. Nada é enviado ou salvo.
   Carregue este arquivo ANTES do script.js. */
   function $(id){return document.getElementById(id)}
   var CUPOM="BEMVINDO50",FRETE_GRATIS=150;
   var FRETES={eco:{nome:"Econômico",prazo:"7 a 12 dias úteis",preco:14.9},exp:{nome:"Expresso",prazo:"2 a 4 dias úteis",preco:29.9}};
   var TEMA={bp:"#FFB2C8",ive:"#FFF04A",illit:"#0090FF"};
   var cupomAtivo=false,cupomTxt="",freteSel="eco",pagSel="pix",pedido=null,tt;
   var drawer=$("drawer"),checkout=$("checkout");
   
   /* ---------- cálculos ---------- */
   function itens(){return Object.keys(bag).map(function(k){return bag[k]})}
   function pl(n){return n===1?"card":"cards"}
   function contas(){
     var n=0,sub=0;
     itens().forEach(function(x){n+=x.qty;sub+=x.qty*x.i.p});
     var pct=n>=5?0.1:n>=3?0.05:0,pacote=sub*pct,apos=sub-pacote;
     var cup=cupomAtivo?Math.min(apos*0.5,15):0,base=apos-cup;
     var gratis=base>=FRETE_GRATIS&&freteSel==="eco";
     var frete=sub===0?0:(gratis?0:FRETES[freteSel].preco);
     return {n:n,sub:sub,pct:pct,pacote:pacote,cup:cup,base:base,gratis:gratis,frete:frete,total:base+frete};
   }
   function fillThumb(el,x){
     if(x.i.img){el.style.background="url("+IMGS[x.i.img]+") center top/cover"}
     else{el.textContent=x.i.m.charAt(0);el.style.background=TEMA[x.cat.key]}
   }
   function sumHTML(c,full){
     var r=[["Subtotal",brl(c.sub)]];
     if(c.pacote)r.push(["Desconto de pacote ("+Math.round(c.pct*100)+"%)","−"+brl(c.pacote)]);
     if(c.cup)r.push(["Cupom "+CUPOM,"−"+brl(c.cup)]);
     if(full)r.push(["Frete",c.gratis?"Grátis":brl(c.frete)]);
     var h='<dl class="sum">';
     r.forEach(function(x){h+='<div><dt>'+x[0]+'</dt><dd>'+x[1]+'</dd></div>'});
     return h+'<div class="tot"><dt>'+(full?"Total":"Total (frete no checkout)")+'</dt><dd>'+brl(full?c.total:c.base)+'</dd></div></dl>';
   }
   
   /* ---------- aviso rápido e badge ---------- */
   function toast(msg,ver){
     var t=$("toast");t.innerHTML="";
     var s=document.createElement("span");s.textContent=msg;t.appendChild(s);
     if(ver){var b=document.createElement("button");b.type="button";b.textContent="Ver sacola";b.onclick=openDrawer;t.appendChild(b)}
     t.classList.add("on");clearTimeout(tt);tt=setTimeout(function(){t.classList.remove("on")},3200);
   }
   function toggleBag(cat,i,id){
     if(bag[id]){delete bag[id];toast("Removido da sacola")}
     else{bag[id]={cat:cat,i:i,qty:1};toast(i.m+", "+i.t.toLowerCase()+": adicionado à sacola",true)}
     updateBag();
   }
   function updateBag(){
     var n=contas().n,b=$("bagCount");b.textContent=n;b.hidden=!n;
     if(drawer.open)renderDrawer();
   }
   function renderAll(){CATS.forEach(function(c){renderGrid(c)})}
   
   /* ---------- gaveta da sacola ---------- */
   function renderDrawer(){
     var its=itens(),c=contas(),L=$("drawerList");L.innerHTML="";
     $("drawerEmpty").hidden=its.length>0;$("drawerFoot").hidden=!its.length;
     its.forEach(function(x){
       var li=document.createElement("li");li.className="li";li.dataset.id=x.cat.key+x.i.m+x.i.t;
       li.innerHTML='<span class="th"></span><div class="lid"><strong>'+x.i.m+'</strong><span>'+x.cat.label+', '+x.i.t.toLowerCase()+'</span>'+
         '<div class="qty"><button type="button" data-a="-" aria-label="Diminuir quantidade">−</button><b>'+x.qty+'</b>'+
         '<button type="button" data-a="+" aria-label="Aumentar quantidade"'+(x.qty>=3?' disabled':'')+'>+</button></div></div>'+
         '<div class="lip"><b>'+brl(x.qty*x.i.p)+'</b><button type="button" class="lnk" data-a="x">Remover</button></div>';
       fillThumb(li.firstChild,x);L.appendChild(li);
     });
     if(!its.length)return;
     var falta=FRETE_GRATIS-c.base;
     $("shipTxt").textContent=falta>0?"Faltam "+brl(falta)+" para frete grátis":"Você ganhou frete grátis no envio econômico!";
     $("shipBar").style.width=Math.min(100,c.base/FRETE_GRATIS*100)+"%";
     $("packTxt").textContent=c.n<3?"Leve mais "+(3-c.n)+" "+pl(3-c.n)+" e ganhe 5% de desconto":
       c.n<5?"Leve mais "+(5-c.n)+" "+pl(5-c.n)+" e ganhe 10% de desconto":"Desconto de 10% no pacote aplicado";
     $("cupomBtn").textContent=cupomAtivo?"Remover":"Aplicar";$("cupom").readOnly=cupomAtivo;
     $("cupomMsg").textContent=cupomTxt;$("drawerSum").innerHTML=sumHTML(c,false);
   }
   function openDrawer(){renderDrawer();if(!drawer.open)drawer.showModal()}
   $("bag").onclick=openDrawer;
   $("dClose").onclick=function(){drawer.close()};
   drawer.addEventListener("click",function(e){if(e.target===drawer)drawer.close()});
   $("drawerList").onclick=function(e){
     var b=e.target.closest("button[data-a]");if(!b)return;
     var id=b.closest("li").dataset.id,x=bag[id],a=b.dataset.a;
     if(a==="x"||(a==="-"&&x.qty===1)){delete bag[id]}else if(a==="-"){x.qty--}else if(x.qty<3){x.qty++}
     updateBag();renderAll();
   };
   $("cupomBtn").onclick=function(){
     var v=$("cupom").value.trim().toUpperCase();
     if(cupomAtivo){cupomAtivo=false;cupomTxt="";$("cupom").value=""}
     else if(v===CUPOM){cupomAtivo=true;cupomTxt="Cupom aplicado: 50% de desconto, até R$ 15,00."}
     else{cupomTxt="Cupom inválido. Para testar, use "+CUPOM+"."}
     updateBag();
   };
   $("cupom").addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();$("cupomBtn").click()}});
   $("goCheckout").onclick=function(){drawer.close();openCheckout()};
   
   /* ---------- formulário do checkout ---------- */
   var CONTATO=[["nome","Nome completo","text","name"],["email","E-mail","email","email"],["tel","Telefone com DDD","tel","tel"]];
   var ENTREGA=[["cep","CEP","text","postal-code"],["rua","Endereço","text","street-address"],["num","Número","text","off"],["compl","Complemento (opcional)","text","off"],["cidade","Cidade","text","address-level2"],["uf","UF","text","address-level1"]];
   var CARTAO=[["cnum","Número do cartão","text","off"],["cnome","Nome impresso no cartão","text","off"],["cval","Validade (MM/AA)","text","off"],["ccvv","CVV","text","off"]];
   var CK=["cnum","cnome","cval","ccvv"];
   function campo(c){
     return '<label class="f"><span>'+c[1]+'</span><input id="f_'+c[0]+'" type="'+c[2]+'" autocomplete="'+c[3]+'" aria-describedby="e_'+c[0]+'"'+(c[0]==="cnum"?' inputmode="numeric"':'')+'><em class="err" id="e_'+c[0]+'"></em></label>';
   }
   $("fContato").innerHTML=CONTATO.map(campo).join("");
   $("fEntrega").innerHTML=ENTREGA.map(campo).join("");
   $("fCartao").innerHTML=CARTAO.map(campo).join("");
   
   function req(v){return v.trim().length>0||"Campo obrigatório"}
   var REGRAS={
     nome:function(v){return v.trim().split(/\s+/).length>=2||"Digite nome e sobrenome"},
     email:function(v){return /^\S+@\S+\.\S+$/.test(v)||"Digite um e-mail válido"},
     tel:function(v){return v.replace(/\D/g,"").length>=10||"Digite o DDD e o telefone"},
     cep:function(v){return v.replace(/\D/g,"").length===8||"O CEP tem 8 números"},
     rua:req,num:req,cidade:req,
     uf:function(v){return /^[A-Za-z]{2}$/.test(v)||"Use a sigla, por exemplo SP"},
     cnum:function(v){var n=v.replace(/\D/g,"").length;return(n>=13&&n<=19)||"Número do cartão inválido"},
     cnome:req,
     cval:function(v){return /^(0[1-9]|1[0-2])\/\d{2}$/.test(v)||"Use o formato MM/AA"},
     ccvv:function(v){return /^\d{3,4}$/.test(v)||"CVV inválido"}
   };
   function validar(){
     var ok=true,first=null;
     Object.keys(REGRAS).forEach(function(k){
       if(CK.indexOf(k)>=0&&pagSel!=="cartao")return;
       var el=$("f_"+k),r=REGRAS[k](el.value);
       $("e_"+k).textContent=r===true?"":r;
       el.setAttribute("aria-invalid",r===true?"false":"true");
       if(r!==true){ok=false;if(!first)first=el}
     });
     if(first)first.focus();
     return ok;
   }
   $("coForm").addEventListener("input",function(e){
     var t=e.target,d=t.value.replace(/\D/g,"");
     if(t.id==="f_cep")t.value=d.slice(0,8).replace(/^(\d{5})(\d)/,"$1-$2");
     else if(t.id==="f_tel")t.value=d.length>2?d.slice(0,11).replace(/^(\d{2})(\d{0,5})(\d{0,4})$/,function(m,a,b,c){return "("+a+") "+b+(c?"-"+c:"")}):d;
     else if(t.id==="f_cnum")t.value=d.slice(0,19).replace(/(\d{4})(?=\d)/g,"$1 ");
     else if(t.id==="f_cval")t.value=d.slice(0,4).replace(/^(\d{2})(\d)/,"$1/$2");
     else if(t.id==="f_ccvv")t.value=d.slice(0,4);
     else if(t.id==="f_uf")t.value=t.value.replace(/[^A-Za-z]/g,"").slice(0,2).toUpperCase();
   });
   var EXEMPLO={nome:"Maria Souza",email:"maria@exemplo.com",tel:"(11) 91234-5678",cep:"01001-000",rua:"Rua de Exemplo",num:"100",cidade:"São Paulo",uf:"SP",cnum:"4242 4242 4242 4242",cnome:"MARIA SOUZA",cval:"12/30",ccvv:"123"};
   $("coFill").onclick=function(){
     Object.keys(EXEMPLO).forEach(function(k){var el=$("f_"+k);el.value=EXEMPLO[k];el.setAttribute("aria-invalid","false");$("e_"+k).textContent=""});
   };
   document.querySelectorAll('input[name="pag"]').forEach(function(r){
     r.onchange=function(){pagSel=r.value;$("cartaoBox").hidden=pagSel!=="cartao"};
   });
   $("fFrete").onchange=function(e){freteSel=e.target.value;renderCheckout()};
   
   /* ---------- checkout ---------- */
   function renderCheckout(){
     var c=contas(),L="";
     itens().forEach(function(x){
       L+='<li class="li"><span class="th" data-k="'+x.cat.key+x.i.m+x.i.t+'"></span><div class="lid"><strong>'+x.i.m+'</strong><span>'+x.cat.label+', '+x.i.t.toLowerCase()+', '+x.qty+'x</span></div><b>'+brl(x.qty*x.i.p)+'</b></li>';
     });
     $("coSum").innerHTML='<h2>Resumo do pedido</h2><ul class="lis">'+L+'</ul>'+sumHTML(c,true);
     $("coSum").querySelectorAll(".th").forEach(function(t){fillThumb(t,bag[t.dataset.k])});
     $("fFrete").innerHTML=Object.keys(FRETES).map(function(k){
       var f=FRETES[k],pr=(k==="eco"&&c.base>=FRETE_GRATIS)?"Grátis":brl(f.preco);
       return '<label class="opt"><input type="radio" name="frete" value="'+k+'"'+(k===freteSel?" checked":"")+'><span><b>'+f.nome+'</b><small>'+f.prazo+'</small></span><em>'+pr+'</em></label>';
     }).join("");
     var pv=$("f_parc").value||"1";
     $("f_parc").innerHTML=[1,2,3].map(function(n){return '<option value="'+n+'">'+n+'x de '+brl(c.total/n)+(n>1?" sem juros":"")+'</option>'}).join("");
     $("f_parc").value=pv;
   }
   function openCheckout(){
     if(!itens().length)return;
     $("coMain").hidden=false;$("coPix").hidden=true;$("coDone").hidden=true;$("coBusy").hidden=true;
     renderCheckout();
     if(!checkout.open)checkout.showModal();
     checkout.scrollTop=0;
   }
   $("coBack").onclick=function(){checkout.close();openDrawer()};
   $("coForm").onsubmit=function(e){
     e.preventDefault();
     if(!itens().length||!validar())return;
     pedido={num:"CI-"+Math.floor(100000+Math.random()*900000),c:contas(),pag:pagSel,frete:FRETES[freteSel]};
     if(pagSel==="pix"){mostrarPix()}else{$("coBusy").hidden=false;setTimeout(concluir,1600)}
   };
   function mostrarPix(){
     $("coMain").hidden=true;$("coPix").hidden=false;
     $("pixCode").value="DEMO-CARDIDOLS-"+pedido.num+"-"+Math.round(pedido.c.total*100);
     $("pixTotal").textContent="Total: "+brl(pedido.c.total);
     $("pixCopy").textContent="Copiar";checkout.scrollTop=0;
   }
   $("pixCopy").onclick=function(){
     var i=$("pixCode");i.select();
     try{document.execCommand("copy")}catch(e){}
     $("pixCopy").textContent="Copiado";
   };
   $("pixPaid").onclick=function(){$("coBusy").hidden=false;setTimeout(concluir,900)};
   $("pixBack").onclick=function(){$("coPix").hidden=true;$("coMain").hidden=false};
   function concluir(){
     var p=pedido;
     $("coBusy").hidden=true;$("coMain").hidden=true;$("coPix").hidden=true;$("coDone").hidden=false;
     $("doneTxt").textContent="Pedido "+p.num+" recebido. Entrega estimada em "+p.frete.prazo+" ("+p.frete.nome.toLowerCase()+"). Pagamento: "+(p.pag==="pix"?"Pix":"cartão de crédito")+".";
     $("doneSum").innerHTML=sumHTML(p.c,true);
     Object.keys(bag).forEach(function(k){delete bag[k]});
     cupomAtivo=false;cupomTxt="";
     updateBag();renderAll();checkout.scrollTop=0;
   }
   $("doneBtn").onclick=function(){checkout.close()};