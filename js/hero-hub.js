/* Hero Hub — local roster browser with remote portrait assets. */
(() => {
 'use strict';
 const $=id=>document.getElementById(id);
 const heroes=[["Hank",15,"Infantry","Legendary"],["Elif",14,"Infantry","Legendary"],["Gisela",13,"Infantry","Legendary"],["Hervor",12,"Infantry","Legendary"],["Eleonora",11,"Infantry","Legendary"],["Gregory",10,"Infantry","Legendary"],["Magnus",9,"Infantry","Legendary"],["Gatot",8,"Infantry","Legendary"],["Edith",7,"Infantry","Legendary"],["Wu Ming",6,"Infantry","Legendary"],["Hector",5,"Infantry","Legendary"],["Ahmose",4,"Infantry","Legendary"],["Logan",3,"Infantry","Legendary"],["Flint",2,"Infantry","Legendary"],["Jeronimo",1,"Infantry","Legendary"],["Natalia",1,"Infantry","Legendary"],["Sergey",0,"Infantry","Epic"],["Eugene",0,"Infantry","Rare"],["Smith",0,"Infantry","Rare"],["Estrella",15,"Lancer","Legendary"],["Dominic",14,"Lancer","Legendary"],["Flora",13,"Lancer","Legendary"],["Karol",12,"Lancer","Legendary"],["Lloyd",11,"Lancer","Legendary"],["Freya",10,"Lancer","Legendary"],["Fred",9,"Lancer","Legendary"],["Sonya",8,"Lancer","Legendary"],["Gordon",7,"Lancer","Legendary"],["Renee",6,"Lancer","Legendary"],["Norah",5,"Lancer","Legendary"],["Reina",4,"Lancer","Legendary"],["Mia",3,"Lancer","Legendary"],["Philly",2,"Lancer","Legendary"],["Molly",1,"Lancer","Legendary"],["Jessie",0,"Lancer","Epic"],["Ling Shuang",0,"Lancer","Epic"],["Patrick",0,"Lancer","Epic"],["Walis Bokan",0,"Lancer","Epic"],["Charlie",0,"Lancer","Rare"],["Viveca",15,"Marksman","Legendary"],["Cara",14,"Marksman","Legendary"],["Vulcanus",13,"Marksman","Legendary"],["Ligeia",12,"Marksman","Legendary"],["Rufus",11,"Marksman","Legendary"],["Blanchette",10,"Marksman","Legendary"],["Xura",9,"Marksman","Legendary"],["Hendrik",8,"Marksman","Legendary"],["Bradley",7,"Marksman","Legendary"],["Wayne",6,"Marksman","Legendary"],["Gwen",5,"Marksman","Legendary"],["Lynn",4,"Marksman","Legendary"],["Greg",3,"Marksman","Legendary"],["Alonso",2,"Marksman","Legendary"],["Zinman",1,"Marksman","Legendary"],["Bahiti",0,"Marksman","Epic"],["Gina",0,"Marksman","Epic"],["Jasser",0,"Marksman","Epic"],["Seo-yoon",0,"Marksman","Epic"],["Cloris",0,"Marksman","Rare"]].map(([name,gen,type,rarity])=>({name,gen,type,rarity}));
 const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 const portrait=h=>'https://wostools.net/images/heroes/'+slug(h.name)+'.webp';
 const state={selected:null};
 const filtered=()=>{
  const q=$('hhSearch').value.trim().toLowerCase(),g=$('hhGeneration').value,c=$('hhClass').value,r=$('hhRarity').value;
  return heroes.filter(h=>(!q||h.name.toLowerCase().includes(q))&&(g==='all'||String(h.gen)===g)&&(c==='all'||h.type===c)&&(r==='all'||h.rarity===r));
 };
 const detail=h=>{
  state.selected=h;
  const el=$('hhDetail');el.hidden=false;
  el.innerHTML='<img src="'+portrait(h)+'" alt="'+h.name+'" onerror="this.style.display=\'none\'"><div><strong>'+h.name+'</strong><p>Generation '+(h.gen||'Classic')+' · '+h.type+' · '+h.rarity+'</p><p>Portrait asset: WoSTools community hero image library.</p></div>';
  $('hhGrid').querySelectorAll('.hh-card').forEach(x=>x.classList.toggle('active',x.dataset.name===h.name));
 };
 const render=()=>{
  const list=filtered();$('hhCount').textContent=list.length+' / '+heroes.length+' heroes';
  $('hhGrid').innerHTML=list.map(h=>'<button type="button" class="hh-card" data-name="'+h.name.replace(/"/g,'&quot;')+'"><img loading="lazy" src="'+portrait(h)+'" alt="'+h.name+'" onerror="this.onerror=null;this.style.display=\'none\'"><strong>'+h.name+'</strong><small>'+(h.gen?'Gen '+h.gen:'Classic')+' · '+h.type+'</small></button>').join('');
  $('hhGrid').querySelectorAll('.hh-card').forEach(b=>b.addEventListener('click',()=>detail(list.find(h=>h.name===b.dataset.name))));
 };
 const init=()=>{
  if(!$('hhGrid')||$('hhGrid').dataset.ready)return;
  $('hhGrid').dataset.ready='1';
  const gens=[...new Set(heroes.map(h=>h.gen).filter(Boolean))].sort((a,b)=>b-a);
  gens.forEach(g=>{const o=document.createElement('option');o.value=String(g);o.textContent='Generation '+g;$('hhGeneration').appendChild(o);});
  ['hhSearch','hhGeneration','hhClass','hhRarity'].forEach(id=>$(id).addEventListener(id==='hhSearch'?'input':'change',render));
  render();
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
