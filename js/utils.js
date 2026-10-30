// Shared helpers (loaded first)

function valNum(id){return Math.max(0,parseFloat(document.getElementById(id)?.value)||0);}

function formatDuration(sec){sec=Math.round(sec||0);let d=Math.floor(sec/86400);sec%=86400;let h=Math.floor(sec/3600);sec%=3600;let m=Math.floor(sec/60);return `${d?d+'d ':''}${h}h ${m}m`}

// Shared "stat" tile used by every calculator's result grid.
function statCard(n,l,cls){return `<div class="stat${cls?' '+cls:''}"><div class="n">${n}</div><div class="l">${l}</div></div>`;}

// Troop type badge (Infantry / Lancer / Marksman): images/troops/{type}.webp
function troopIcon(type){
  const k=String(type||'').toLowerCase();
  if(!['infantry','lancer','marksman'].includes(k))return '';
  return `<img class="tr-ic" src="images/troops/${k}.webp" alt="${type}" title="${type}">`;
}

function fmtFull(n){return Math.round(Number(n)||0).toLocaleString('en-US');}
/** Compact number: 1.2K, 3.5M, 1.2B, 1.5T */
function fmt(n){
  n=Number(n)||0;
  const neg=n<0; n=Math.abs(n);
  if(n<1000) return (neg?'-':'')+String(Math.round(n));
  const units=[
    {v:1e12,s:'T'},{v:1e9,s:'B'},{v:1e6,s:'M'},{v:1e3,s:'K'}
  ];
  for(const u of units){
    if(n>=u.v){
      // up to 3 decimals, strip trailing zeros — Indonesian comma
      let x=n/u.v;
      let t=x.toFixed(3).replace(/\.?0+$/,'').replace('.',',');
      return (neg?'-':'')+t+u.s;
    }
  }
  return (neg?'-':'')+Math.round(n).toLocaleString('id-ID');
}
function secondsText(s){s=Math.max(0,Math.round(s||0));const d=Math.floor(s/86400);s%=86400;const h=Math.floor(s/3600);s%=3600;const m=Math.floor(s/60);const sec=s%60;return (d?d+'d ':'')+(h?h+'h ':'')+(m?m+'m ':'')+(sec?sec+'s':'').trim()||'0s';}
