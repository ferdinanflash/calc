/**
 * Backend for the shared ASCII Art gallery (Google Apps Script).
 *
 * - Visitors can SEND designs. They are saved in the "Designs" sheet with approved = unchecked.
 * - The website only SHOWS rows whose "approved" box is ticked.
 * - Nothing here needs a server or a paid plan.
 */

const SHEET_NAME = 'Designs';
const HEADERS = ['id', 'time', 'name', 'category', 'by', 'art', 'approved'];
const CATEGORIES = ['borders','frost','crowns','weapons','names','faces','beasts','symbols','banners','love','pixel','messages','general'];
const MAX_NAME = 40, MAX_BY = 30, MAX_ART = 700;
const AUTO_APPROVE = true;    // true = new designs are published at once; false = wait for you to tick "approved"
const MAX_PER_HOUR = 40;     // whole-site limit on new submissions per hour (anti-spam)
const MAX_PENDING = 300;      // stop accepting when this many designs wait for review
const MAX_LIST = 500;         // most designs sent to the website

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

// Keeps U+200D (ZWJ) on purpose: some emoji need it.
function clean_(s) {
  return String(s == null ? '' : s).replace(/[\u200B\u200C\u2060\uFEFF]/g, '').replace(/\r\n?/g, '\n');
}
function len_(s) { return Array.from(s).length; }

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function validate_(d) {
  d = d || {};
  const name = clean_(d.name).replace(/\s+/g, ' ').trim();
  const by = clean_(d.by).replace(/\s+/g, ' ').trim();
  const art = clean_(d.art).replace(/\s+$/, '');
  const cat = String(d.cat || '');
  if (!name || len_(name) > MAX_NAME) return { error: 'The name must be 1-40 characters' };
  if (len_(by) > MAX_BY) return { error: 'The author name is too long' };
  if (!art || len_(art) > MAX_ART) return { error: 'The design must be 1-' + MAX_ART + ' characters' };
  if (CATEGORIES.indexOf(cat) < 0) return { error: 'Unknown category' };
  return { name: name, by: by, art: art, cat: cat };
}

// Website asks for the approved designs.
function doGet(e) {
  const p = (e && e.parameter) || {};
  if ((p.action || 'list') !== 'list') return json_({ error: 'Bad action' });
  const cache = CacheService.getScriptCache();
  const hit = cache.get('list');
  if (hit) return ContentService.createTextOutput(hit).setMimeType(ContentService.MimeType.JSON);

  const rows = getSheet_().getDataRange().getValues();
  const designs = [];
  for (let i = rows.length - 1; i >= 1 && designs.length < MAX_LIST; i--) {   // newest first
    const r = rows[i];
    if (r[6] !== true) continue;                                              // only approved rows
    const v = validate_({ name: r[2], cat: r[3], by: r[4], art: r[5] });
    if (v.error) continue;
    designs.push({ id: String(r[0]), name: v.name, cat: v.cat, by: v.by, art: v.art });
  }
  const out = JSON.stringify({ designs: designs });
  if (out.length < 90000) cache.put('list', out, 60);                         // approvals show within ~1 minute
  return ContentService.createTextOutput(out).setMimeType(ContentService.MimeType.JSON);
}

// Website sends a new design (it lands as "pending").
function doPost(e) {
  const lock = LockService.getScriptLock();
  let locked = false;
  try {
    lock.waitLock(10000);
    locked = true;

    let data;
    try { data = JSON.parse(e.postData.contents); } catch (err) { return json_({ error: 'Bad request' }); }
    const v = validate_(data);
    if (v.error) return json_(v);

    const cache = CacheService.getScriptCache();
    const hourKey = 'n' + Utilities.formatDate(new Date(), 'UTC', 'yyyyMMddHH');
    const used = Number(cache.get(hourKey) || 0);
    if (used >= MAX_PER_HOUR) return json_({ error: 'Too many submissions right now, try again later' });

    const sh = getSheet_();
    const rows = sh.getDataRange().getValues();
    let pending = 0;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][2] === v.name && rows[i][5] === v.art) return json_({ ok: true, duplicate: true });
      if (rows[i][6] !== true) pending++;
    }
    if (pending >= MAX_PENDING) return json_({ error: 'The review queue is full, try again later' });

    const row = sh.getLastRow() + 1;
    // plain-text format so nothing a visitor types is ever treated as a formula
    sh.getRange(row, 1, 1, 6).setNumberFormat('@')
      .setValues([[Utilities.getUuid(), new Date().toISOString(), v.name, v.cat, v.by, v.art]]);
    // AUTO_APPROVE: the design goes live right away. To hide one later, untick its box in the sheet.
    sh.getRange(row, 7).insertCheckboxes().setValue(AUTO_APPROVE);

    cache.put(hourKey, String(used + 1), 3700);
    cache.remove('list');   // so the new design shows up immediately instead of after the 60 s cache
    return json_({ ok: true });
  } catch (err) {
    return json_({ error: 'Server busy, try again' });
  } finally {
    if (locked) { try { lock.releaseLock(); } catch (x) {} }
  }
}
