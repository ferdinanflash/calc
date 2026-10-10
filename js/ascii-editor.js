// Chat Art Editor: paint emoji pixel art on a grid, or convert an image, then copy it
// for game chat or save it to the ASCII Art gallery (stored in this browser).

const AE_LIMIT = 512;            // chat limit used by other WoS art sites; adjust if your game differs
const AE_BLANK = '　';           // full-width space, same width as an emoji
const AE_PALETTE = [
  {e:'⬛', rgb:[49,55,61]},   {e:'⬜', rgb:[230,231,232]}, {e:'🟥', rgb:[221,46,68]},
  {e:'🟧', rgb:[244,144,12]}, {e:'🟨', rgb:[253,203,88]},  {e:'🟩', rgb:[120,177,89]},
  {e:'🟦', rgb:[85,172,238]},  {e:'🟪', rgb:[170,142,214]}, {e:'🟫', rgb:[193,105,79]}
];

const ae = {
  cols:12, rows:12, grid:[], brush:'🟥', tool:'paint', sym:false,
  painting:false, undo:[], customs:[], ready:false, toastTimer:null
};

/* ---------- pure helpers (also used by tests) ---------- */
function aeEmptyGrid(cols, rows){ return Array.from({length:cols*rows}, () => ''); }

function aeBuildText(grid, cols, rows, trim = true){
  const lines = [];
  for(let r=0; r<rows; r++){
    let cells = [];
    for(let c=0; c<cols; c++) cells.push(grid[r*cols+c] || AE_BLANK);
    if(trim) while(cells.length && cells[cells.length-1] === AE_BLANK) cells.pop();
    lines.push(cells.join(''));
  }
  if(trim) while(lines.length && lines[lines.length-1] === '') lines.pop();
  return lines.join('\n');
}

function aeNearest(r, g, b){
  let best = AE_PALETTE[0].e, bd = Infinity;
  for(const p of AE_PALETTE){
    const dr = r - p.rgb[0], dg = g - p.rgb[1], db = b - p.rgb[2];
    const d = 2*dr*dr + 4*dg*dg + 3*db*db;      // weighted: the eye is most sensitive to green
    if(d < bd){ bd = d; best = p.e; }
  }
  return best;
}

function aeImageDataToGrid(data, w, h, whiteBlank){
  const out = [];
  for(let i=0; i<w*h; i++){
    const r = data[i*4], g = data[i*4+1], b = data[i*4+2], a = data[i*4+3];
    if(a < 128 || (whiteBlank && r > 235 && g > 235 && b > 235)) out.push('');
    else out.push(aeNearest(r, g, b));
  }
  return out;
}

function aeFlood(grid, cols, rows, start, value){
  const target = grid[start];
  if(target === value) return;
  const stack = [start];
  while(stack.length){
    const i = stack.pop();
    if(grid[i] !== target) continue;
    grid[i] = value;
    const x = i % cols, y = (i - x) / cols;
    if(x > 0) stack.push(i-1);
    if(x < cols-1) stack.push(i+1);
    if(y > 0) stack.push(i-cols);
    if(y < rows-1) stack.push(i+cols);
  }
}

function aeFirstGrapheme(s){
  s = (s || '').trim();
  if(!s) return '';
  if(window.Intl && Intl.Segmenter){
    for(const x of new Intl.Segmenter(undefined, {granularity:'grapheme'}).segment(s)) return x.segment;
  }
  return Array.from(s)[0];
}

/* ---------- UI ---------- */
function aeEl(id){ return document.getElementById(id); }

function initAsciiEditor(){
  if(!ae.ready){
    ae.ready = true;
    ae.grid = aeEmptyGrid(ae.cols, ae.rows);
    const sel = aeEl('aeCat');
    if(sel && typeof ASCII_CATEGORIES !== 'undefined'){
      sel.innerHTML = ASCII_CATEGORIES.filter(c => c.id !== 'all')
        .map(c => `<option value="${c.id}"${c.id==='pixel'?' selected':''}>${c.label}</option>`).join('');
    }
    const grid = aeEl('aeGrid');
    grid.addEventListener('pointerdown', aePointerDown);
    grid.addEventListener('pointermove', aePointerMove);
    window.addEventListener('pointerup', aePointerUp);
    window.addEventListener('pointercancel', aePointerUp);
    window.addEventListener('resize', () => { if(aeEl('asciiEditorModal')?.classList.contains('open')) aeRenderGrid(); });
    aeEl('aeFile').addEventListener('change', aeImportImage);
  }
  aeRenderPalette();
  aeSyncTools();
  aeEl('aeCols').value = ae.cols;
  aeEl('aeRows').value = ae.rows;
  aeRenderGrid();
}

function aeRenderPalette(){
  const box = aeEl('aePalette');
  const items = [...AE_PALETTE.map(p => p.e), ...ae.customs];
  box.innerHTML = items.map(e =>
    `<button type="button" class="ae-swatch${e===ae.brush && ae.tool!=='erase'?' active':''}" data-e="${e}" onclick="aeSetBrush(this.dataset.e)">${e}</button>`
  ).join('');
}

function aeSetBrush(e){
  ae.brush = e;
  if(ae.tool === 'erase' || ae.tool === 'pick') ae.tool = 'paint';
  aeRenderPalette();
  aeSyncTools();
}

function aeSetTool(t){ ae.tool = t; aeRenderPalette(); aeSyncTools(); }

function aeToggleSym(){ ae.sym = !ae.sym; aeSyncTools(); }

function aeSyncTools(){
  document.querySelectorAll('#aeTools .ae-tool').forEach(b => b.classList.toggle('active', b.dataset.tool === ae.tool));
  const s = aeEl('aeSym'); if(s) s.classList.toggle('active', ae.sym);
}

function aeAddCustom(){
  const input = aeEl('aeCustom');
  const e = aeFirstGrapheme(input.value);
  if(!e) return;
  if(!ae.customs.includes(e) && !AE_PALETTE.some(p => p.e === e)) ae.customs.push(e);
  input.value = '';
  aeSetBrush(e);
}

function aeCellSize(){
  const w = (aeEl('aeGridWrap').clientWidth || 320) - 6;
  return Math.max(16, Math.min(34, Math.floor(w / ae.cols)));
}

function aeRenderGrid(){
  const g = aeEl('aeGrid');
  const size = aeCellSize();
  g.style.gridTemplateColumns = `repeat(${ae.cols}, ${size}px)`;
  g.style.fontSize = Math.floor(size * 0.78) + 'px';
  g.style.setProperty('--ae-size', size + 'px');
  g.innerHTML = ae.grid.map((v, i) => `<div class="ae-cell" data-i="${i}">${v}</div>`).join('');
  aeUpdateOutput();
}

function aeUpdateOutput(){
  const text = aeBuildText(ae.grid, ae.cols, ae.rows, aeEl('aeTrim').checked);
  aeEl('aeOut').value = text;
  const n = [...text].length;
  const c = aeEl('aeCount');
  c.textContent = `${n} / ${AE_LIMIT}`;
  c.classList.toggle('over', n > AE_LIMIT);
}

function aePushUndo(){
  ae.undo.push({cols:ae.cols, rows:ae.rows, grid:ae.grid.slice()});
  if(ae.undo.length > 40) ae.undo.shift();
}

function aeUndo(){
  const s = ae.undo.pop();
  if(!s) return;
  ae.cols = s.cols; ae.rows = s.rows; ae.grid = s.grid;
  aeEl('aeCols').value = ae.cols; aeEl('aeRows').value = ae.rows;
  aeRenderGrid();
}

function aeMirrorIndex(i){
  const x = i % ae.cols, y = (i - x) / ae.cols;
  return y * ae.cols + (ae.cols - 1 - x);
}

function aeSetCell(i, value){
  ae.grid[i] = value;
  const cell = aeEl('aeGrid').children[i];
  if(cell) cell.textContent = value;
}

function aeApply(i){
  if(i == null || Number.isNaN(i)) return;
  if(ae.tool === 'pick'){
    const v = ae.grid[i];
    if(v){ ae.brush = v; ae.tool = 'paint'; } else { ae.tool = 'erase'; }
    aeRenderPalette(); aeSyncTools();
    ae.painting = false;
    return;
  }
  if(ae.tool === 'fill'){
    aeFlood(ae.grid, ae.cols, ae.rows, i, ae.brush);
    if(ae.sym) aeFlood(ae.grid, ae.cols, ae.rows, aeMirrorIndex(i), ae.brush);
    aeRenderGrid();
    ae.painting = false;
    return;
  }
  const value = ae.tool === 'erase' ? '' : ae.brush;
  aeSetCell(i, value);
  if(ae.sym) aeSetCell(aeMirrorIndex(i), value);
}

function aeCellFromEvent(e){
  const el = document.elementFromPoint(e.clientX, e.clientY);
  if(el && el.classList && el.classList.contains('ae-cell')) return Number(el.dataset.i);
  return null;
}

function aePointerDown(e){
  const i = aeCellFromEvent(e);
  if(i == null) return;
  e.preventDefault();
  aePushUndo();
  ae.painting = true;
  aeApply(i);
  aeUpdateOutput();
}

function aePointerMove(e){
  if(!ae.painting) return;
  const i = aeCellFromEvent(e);
  if(i == null) return;
  aeApply(i);
  aeUpdateOutput();
}

function aePointerUp(){ ae.painting = false; }

function aeResize(){
  const cols = Math.max(4, Math.min(24, parseInt(aeEl('aeCols').value, 10) || ae.cols));
  const rows = Math.max(4, Math.min(24, parseInt(aeEl('aeRows').value, 10) || ae.rows));
  aeEl('aeCols').value = cols; aeEl('aeRows').value = rows;
  if(cols === ae.cols && rows === ae.rows) return;
  aePushUndo();
  const next = aeEmptyGrid(cols, rows);
  for(let r=0; r<Math.min(rows, ae.rows); r++)
    for(let c=0; c<Math.min(cols, ae.cols); c++) next[r*cols+c] = ae.grid[r*ae.cols+c];
  ae.cols = cols; ae.rows = rows; ae.grid = next;
  aeRenderGrid();
}

function aeClear(){
  aePushUndo();
  ae.grid = aeEmptyGrid(ae.cols, ae.rows);
  aeRenderGrid();
}

function aeFlipH(){
  aePushUndo();
  const next = aeEmptyGrid(ae.cols, ae.rows);
  for(let r=0; r<ae.rows; r++)
    for(let c=0; c<ae.cols; c++) next[r*ae.cols + (ae.cols-1-c)] = ae.grid[r*ae.cols+c];
  ae.grid = next;
  aeRenderGrid();
}

function aeFlipV(){
  aePushUndo();
  const next = aeEmptyGrid(ae.cols, ae.rows);
  for(let r=0; r<ae.rows; r++)
    for(let c=0; c<ae.cols; c++) next[(ae.rows-1-r)*ae.cols + c] = ae.grid[r*ae.cols+c];
  ae.grid = next;
  aeRenderGrid();
}

function aeImportImage(ev){
  const file = ev.target.files && ev.target.files[0];
  ev.target.value = '';
  if(!file) return;
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    const cv = document.createElement('canvas');
    cv.width = ae.cols; cv.height = ae.rows;
    const ctx = cv.getContext('2d', {willReadFrequently:true});
    ctx.clearRect(0, 0, cv.width, cv.height);
    const k = Math.min(ae.cols / img.width, ae.rows / img.height);   // fit inside the grid
    const w = Math.max(1, Math.round(img.width * k)), h = Math.max(1, Math.round(img.height * k));
    ctx.drawImage(img, Math.floor((ae.cols - w)/2), Math.floor((ae.rows - h)/2), w, h);
    const data = ctx.getImageData(0, 0, ae.cols, ae.rows).data;
    aePushUndo();
    ae.grid = aeImageDataToGrid(data, ae.cols, ae.rows, aeEl('aeWhiteBlank').checked);
    URL.revokeObjectURL(url);
    aeRenderGrid();
    aeToast('Image converted. Touch it up with the tools.');
  };
  img.onerror = () => { URL.revokeObjectURL(url); aeToast('Could not read that image'); };
  img.src = url;
}

async function aeCopy(){
  const text = aeEl('aeOut').value;
  if(!text){ aeToast('Nothing to copy yet'); return; }
  let ok = false;
  try{ await navigator.clipboard.writeText(text); ok = true; }
  catch(e){
    const ta = aeEl('aeOut');
    ta.focus(); ta.select();
    try{ ok = document.execCommand('copy'); }catch(_){}
  }
  aeToast(ok ? 'Copied! Paste it in game chat.' : 'Copy failed, select the text manually');
}

function aeSave(){
  const text = aeEl('aeOut').value;
  const name = aeEl('aeName').value.trim();
  if(!text){ aeToast('Draw something first'); return; }
  if(!name){ aeToast('Give your design a name'); return; }
  const list = loadAsciiCustom();
  list.push({name, cat: aeEl('aeCat').value, art: text, by: aeEl('aeBy').value.trim()});
  saveAsciiCustom(list);
  aeEl('aeName').value = '';
  if(typeof renderAsciiArt === 'function') renderAsciiArt();
  aeToast('Saved to the gallery (this browser only)');
}

function aeToast(msg){
  const t = aeEl('aeToast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(ae.toastTimer);
  ae.toastTimer = setTimeout(() => t.classList.remove('show'), 2000);
}
