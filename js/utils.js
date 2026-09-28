// Shared helpers (loaded first)

function valNum(id){return Math.max(0,parseFloat(document.getElementById(id)?.value)||0);}

function formatDuration(sec){sec=Math.round(sec||0);let d=Math.floor(sec/86400);sec%=86400;let h=Math.floor(sec/3600);sec%=3600;let m=Math.floor(sec/60);return `${d?d+'d ':''}${h}h ${m}m`}

// Shared "stat" tile used by every calculator's result grid.
function statCard(n,l,cls){return `<div class="stat${cls?' '+cls:''}"><div class="n">${n}</div><div class="l">${l}</div></div>`;}

function fmt(n){return Math.round(Number(n)||0).toLocaleString('en-US');}
function secondsText(s){s=Math.max(0,Math.round(s||0));const d=Math.floor(s/86400);s%=86400;const h=Math.floor(s/3600);s%=3600;const m=Math.floor(s/60);const sec=s%60;return (d?d+'d ':'')+(h?h+'h ':'')+(m?m+'m ':'')+(sec?sec+'s':'').trim()||'0s';}
