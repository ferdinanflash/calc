// Main menu / modal open-close

// ---------- MAIN MENU / MODALS ----------
function openModal(id){
  const m=document.getElementById(id);
  if(!m) return;
  m.classList.add('open');
  m.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
  if(id==='buildingModal') initBuilding();
  if(id==='troopsModal') renderTroopDB();
  if(id==='warAcademyModal') initWarAcademy();
  if(id==='charmModal') renderCharmDB();
  if(id==='chiefGearModal') renderGearDB();
  if(id==='svsModal'){ loadSVS(); renderSVS(); }
}
function closeModal(id){
  const m=document.getElementById(id);
  if(!m) return;
  m.classList.remove('open');
  m.setAttribute('aria-hidden','true');
  if(!document.querySelector('.modal.open')) document.body.classList.remove('modal-open');
}
document.addEventListener('click',e=>{
  if(e.target.classList.contains('modal')) closeModal(e.target.id);
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    document.querySelectorAll('.modal.open').forEach(m=>closeModal(m.id));
  }
});
