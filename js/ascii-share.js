// Shared designs: read approved designs from, and send new ones to, a Google Apps Script
// web app (see Code.gs). Nothing is shown publicly until the owner approves it in the sheet.

const ASCII_SHARE_COOLDOWN_MS = 30000;
const ASCII_SHARE_CACHE_KEY = 'wosAsciiSharedCache';
const ASCII_SHARE_LAST_KEY = 'wosAsciiLastSubmit';
const ASCII_MAX = {name:40, by:30, art:700};
const ASCII_CAT_IDS = ['borders','frost','crowns','weapons','names','faces','beasts','symbols','banners','love','pixel','messages','general'];
let asciiSharedLoaded = false;

function asciiShareEnabled(){
  return typeof window.ASCII_API_URL === 'string' && /^https:\/\//.test(window.ASCII_API_URL.trim());
}
function asciiApiBase(){ return window.ASCII_API_URL.trim(); }
function asciiApiGet(params){
  const b = asciiApiBase();
  return b + (b.includes('?') ? '&' : '?') + params;
}

// Keeps ZWJ (U+200D) on purpose: emoji such as 👨‍👩‍👧 need it.
function asciiCleanText(s){
  return String(s == null ? '' : s).replace(/[\u200B\u200C\u2060\uFEFF]/g, '').replace(/\r\n?/g, '\n');
}
function asciiLen(s){ return Array.from(s).length; }

function asciiNormalizeEntry(e){
  return {
    name: asciiCleanText(e && e.name).replace(/\s+/g, ' ').trim(),
    by:   asciiCleanText(e && e.by).replace(/\s+/g, ' ').trim(),
    art:  asciiCleanText(e && e.art).replace(/\s+$/, ''),
    cat:  String((e && e.cat) || '')
  };
}

function asciiValidateEntry(e){
  if(!e.name || asciiLen(e.name) > ASCII_MAX.name) return 'The name must be 1-40 characters';
  if(asciiLen(e.by) > ASCII_MAX.by) return 'The author name is too long';
  if(!e.art) return 'The design is empty';
  if(asciiLen(e.art) > ASCII_MAX.art) return `The design is too long (max ${ASCII_MAX.art} characters)`;
  if(ASCII_CAT_IDS.indexOf(e.cat) < 0) return 'Pick a category';
  return '';
}

async function loadAsciiShared(force){
  if(!asciiShareEnabled()) return false;
  try{
    const c = JSON.parse(sessionStorage.getItem(ASCII_SHARE_CACHE_KEY) || 'null');
    if(!force && c && Date.now() - c.t < 5*60*1000 && Array.isArray(c.d)){ asciiShared = c.d; return true; }
  }catch(e){}
  try{
    const res = await fetch(asciiApiGet('action=list'));
    const j = await res.json();
    if(j && Array.isArray(j.designs)){
      asciiShared = j.designs.map(asciiNormalizeEntry).filter(e => !asciiValidateEntry(e));
      try{ sessionStorage.setItem(ASCII_SHARE_CACHE_KEY, JSON.stringify({t:Date.now(), d:asciiShared})); }catch(e){}
      return true;
    }
  }catch(e){}
  return false;
}

async function submitAsciiShared(entry){
  if(!asciiShareEnabled()) return {ok:false, msg:'sharing is not set up yet'};
  const e = asciiNormalizeEntry(entry);
  const err = asciiValidateEntry(e);
  if(err) return {ok:false, msg:err};
  let last = 0;
  try{ last = Number(localStorage.getItem(ASCII_SHARE_LAST_KEY) || 0); }catch(_){}
  if(Date.now() - last < ASCII_SHARE_COOLDOWN_MS) return {ok:false, msg:'please wait a few seconds before sharing again'};
  try{
    const res = await fetch(asciiApiBase(), {
      method:'POST',
      headers:{'Content-Type':'text/plain;charset=utf-8'},   // avoids a CORS preflight
      body: JSON.stringify(e)
    });
    const j = await res.json();
    if(j && j.ok){
      try{ localStorage.setItem(ASCII_SHARE_LAST_KEY, String(Date.now())); }catch(_){}
      return {ok:true};
    }
    return {ok:false, msg:(j && j.error) || 'the server said no'};
  }catch(ex){
    return {ok:false, msg:'could not reach the server'};
  }
}

// Saves a new design. When sharing is on, the Google Sheet is the only home for it:
// nothing is kept in this browser unless sending fails (then it is a local fallback).
async function asciiSaveEntry(entry, wantShare){
  const keepLocal = () => {
    const list = loadAsciiCustom();
    list.push(asciiNormalizeEntry(entry));
    saveAsciiCustom(list);
  };
  if(wantShare){
    const r = await submitAsciiShared(entry);
    if(r.ok){
      await loadAsciiShared(true);   // reload the shared list so the new design shows right away
      return 'Shared! Your design is now live for everyone.';
    }
    keepLocal();
    return `Saved on this device only: ${r.msg}`;
  }
  keepLocal();
  return 'Saved in this browser only';
}

function asciiShareUI(){
  const on = asciiShareEnabled();
  document.querySelectorAll('.ascii-share-row').forEach(el => { el.style.display = on ? '' : 'none'; });
}
