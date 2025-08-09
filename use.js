/* script.js
   Handles:
   - selection of unit (page 1)
   - modal height input parsing
   - conversion to number of chosen units
   - rendering of preview stack and result
   - dancing cat drag + petting interactions
*/

/* === Units definitions (height in cm per unit) === */
const UNITS = {
  banana: {name: "Banana", cm: 20, caption: "A typical banana (~20 cm)"},
  burger: {name: "Burger", cm: 8, caption: "A stacked burger (~8 cm)"},
  hello: {name: "Hello Kitty Plush", cm: 30, caption: "Cute plush (~30 cm)"},
  tooth: {name: "Tooth", cm: 2.2, caption: "A big tooth (~2.2 cm)"}
};

const choosePage = document.getElementById('choose-page');
const resultPage = document.getElementById('result-page');
const choices = Array.from(document.querySelectorAll('.choice'));
const modal = document.getElementById('modal');
const heightInput = document.getElementById('height-input');
const modalOk = document.getElementById('modal-ok');
const modalCancel = document.getElementById('modal-cancel');
const resultText = document.getElementById('result-text');
const detailText = document.getElementById('detail-text');
const unitPreview = document.getElementById('unit-preview');
const backBtn = document.getElementById('back-btn');
const randomBtn = document.getElementById('random-btn');
const restartBtn = document.getElementById('restart-btn');

let chosenKey = null;

/* Helper: switch pages */
function showPage(key){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  if(key === 'choose') document.getElementById('choose-page').classList.add('active');
  if(key === 'result') document.getElementById('result-page').classList.add('active');
}

/* Parse height input - accept cm or feet'inches */
function parseHeight(input){
  if(!input) return null;
  input = input.trim().toLowerCase();

  // feet-inches patterns e.g. 5'8 or 5 ft 8 in or 5ft8in or 5 8
  const ftIn = input.match(/^\s*([4-8])\s*(?:'|ft|ft\.|ft\s)?\s*([0-9]{1,2})?\s*(?:\"|in|in\.|in\s)?\s*$/);
  if(ftIn){
    const feet = Number(ftIn[1]);
    const inches = ftIn[2] ? Number(ftIn[2]) : 0;
    const totalCm = (feet * 12 + inches) * 2.54;
    return totalCm;
  }

  // numeric cm maybe with cm suffix
  const cmMatch = input.match(/^([0-9]+(?:\.[0-9]+)?)\s*(cm)?$/);
  if(cmMatch){
    return Number(cmMatch[1]);
  }

  // attempt to find numbers inside the string
  const num = parseFloat(input.replace(/[^\d.]/g,''));
  if(!isNaN(num)) return num;

  return null;
}

/* render preview of stacked units */
function renderPreview(unitKey, count){
  unitPreview.innerHTML = ''; // clear
  const unit = UNITS[unitKey];
  const displayCount = Math.min(40, Math.round(count)); // avoid huge DOM
  const stack = document.createElement('div');
  stack.style.display = 'flex';
  stack.style.flexDirection = 'column-reverse';
  stack.style.alignItems = 'center';
  stack.style.gap = '6px';
  stack.style.padding = '8px';
  stack.style.width = '100%';

  // small icon maker per unit (SVG strings)
  function iconSVG(key, size){
    if(key==='banana') return `<svg width="${size}" height="${size*0.6}" viewBox="0 0 100 60"><path d="M6 48 C25 20, 80 5, 94 14 C78 6, 42 34, 6 48Z" fill="#fff176" stroke="#b58200" stroke-width="2"/></svg>`;
    if(key==='burger') return `<svg width="${size}" height="${size}" viewBox="0 0 100 80"><ellipse cx="50" cy="18" rx="40" ry="12" fill="#f0c27b" stroke="#b86b10" stroke-width="2"/><rect x="15" y="26" width="70" height="20" rx="8" fill="#9ccc65"/></svg>`;
    if(key==='hello') return `<svg width="${size}" height="${size}" viewBox="0 0 100 100"><circle cx="50" cy="50" r="36" fill="#ffd7e6" stroke="#ff8fb1" stroke-width="3"/></svg>`;
    if(key==='tooth') return `<svg width="${size}" height="${size}" viewBox="0 0 100 100"><path d="M50 12 C40 12,30 22,30 32 C30 46,36 58,30 70 C42 74,58 74,70 70 C64 58,70 46,70 32 C70 22,60 12,50 12Z" fill="#fff" stroke="#ccc" stroke-width="2"/></svg>`;
    return '';
  }

  // build a visual stack (limited number) plus scale bar
  for(let i=0;i<displayCount;i++){
    const el = document.createElement('div');
    el.className = 'stack-item';
    el.innerHTML = iconSVG(unitKey, 90 - Math.min(40,i)*1.2); // slightly shrink with height
    el.style.opacity = 0.95 - i*0.01;
    stack.appendChild(el);
  }

  // show a small scale if many units
  const info = document.createElement('div');
  info.style.marginTop = '8px';
  info.style.textAlign = 'center';
  info.innerHTML = `<div style="font-weight:700">${unit.name}</div><div style="font-size:13px;color:#666">${UNITS[unitKey].caption}</div>`;

  unitPreview.appendChild(stack);
  unitPreview.appendChild(info);

  // if count bigger than displayCount show message
  if(count > displayCount){
    const moreNote = document.createElement('div');
    moreNote.style.marginTop='8px';
    moreNote.style.fontSize='13px';
    moreNote.style.color='#333';
    moreNote.innerText = `You're about ${count.toFixed(1)} ${unit.name}s tall — showing ${displayCount} of them in the preview.`;
    unitPreview.appendChild(moreNote);
  }
}

/* on selection -> open modal */
choices.forEach(c => {
  c.addEventListener('click', () => {
    chosenKey = c.dataset.key;
    openModal();
  });
  c.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' || e.key === ' '){ chosenKey = c.dataset.key; openModal(); e.preventDefault(); }
  });
});

/* random button */
randomBtn.addEventListener('click', ()=>{
  const keys = Object.keys(UNITS);
  chosenKey = keys[Math.floor(Math.random()*keys.length)];
  openModal();
});

/* modal controls */
function openModal(){
  modal.classList.remove('hidden');
  heightInput.value = '';
  heightInput.focus();
}
function closeModal(){ modal.classList.add('hidden'); }

/* parse and calculate when OK */
modalOk.addEventListener('click', ()=> {
  const raw = heightInput.value;
  const heightCm = parseHeight(raw);
  if(!heightCm || heightCm <= 0){
    alert('Please give a sensible height (e.g. 170 or 5\'8).');
    heightInput.focus();
    return;
  }
  calculateAndShow(heightCm);
  closeModal();
});

modalCancel.addEventListener('click', ()=> {
  closeModal();
});

/* back & restart */
backBtn.addEventListener('click', ()=> showPage('choose'));
restartBtn.addEventListener('click', ()=> showPage('choose'));

/* main calculation and display */
function calculateAndShow(heightCm){
  const unit = UNITS[chosenKey];
  const count = heightCm / unit.cm;
  // build result text
  resultText.innerHTML = `You're about <span style="color:var(--accent)">${count.toFixed(1)}</span> ${unit.name}${count>=2?'s':''} tall!`;
  detailText.innerText = `${Math.round(heightCm)} cm tall / each ${unit.name} ≈ ${unit.cm} cm.`;

  renderPreview(chosenKey, count);

  showPage('result');
}

/* small friendly UX: allow pressing Enter inside height input */
heightInput.addEventListener('keydown', (e)=> {
  if(e.key === 'Enter') modalOk.click();
});

/* === Dancing cat interactions: drag + pet === */
const cat = document.getElementById('dancing-cat');
const catSvg = document.getElementById('cat-svg');
let dragging=false;
let offset = {x:0,y:0};
let startPos = {x:0,y:0};

cat.classList.add('dancing');

function getPointerPos(e){
  if(e.touches && e.touches[0]) return {x:e.touches[0].clientX, y:e.touches[0].clientY};
  return {x:e.clientX, y:e.clientY};
}

cat.addEventListener('pointerdown', (e)=>{
  const p = getPointerPos(e);
  dragging = true;
  cat.classList.add('dragging');
  startPos = {x:p.x, y:p.y};
  const rect = cat.getBoundingClientRect();
  offset.x = p.x - rect.left;
  offset.y = p.y - rect.top;
  cat.setPointerCapture(e.pointerId);
});

window.addEventListener('pointermove', (e)=>{
  if(!dragging) return;
  const p = getPointerPos(e);
  let left = p.x - offset.x;
  let top = p.y - offset.y;

  // constrain within viewport
  const maxLeft = window.innerWidth - cat.offsetWidth - 8;
  const maxTop = window.innerHeight - cat.offsetHeight - 8;
  left = Math.max(8, Math.min(maxLeft, left));
  top = Math.max(8, Math.min(maxTop, top));

  cat.style.left = left + 'px';
  cat.style.top = top + 'px';
});

window.addEventListener('pointerup', (e)=>{
  if(!dragging) return;
  dragging = false;
  cat.classList.remove('dragging');
  setTimeout(()=> { cat.classList.remove('angry'); cat.classList.remove('happy'); }, 900);
});

/* Petting detection: head vs belly using SVG element bounding boxes */
catSvg.addEventListener('click', (evt)=>{
  // find click coordinates relative to svg viewport
  const pt = catSvg.createSVGPoint();
  pt.x = evt.clientX; pt.y = evt.clientY;
  const svgP = pt.matrixTransform(catSvg.getScreenCTM().inverse());
  const head = catSvg.querySelector('#cat-head circle') || catSvg.querySelector('#cat-head');
  const belly = catSvg.querySelector('#cat-belly');

  // simple region check: belly ellipse contains point?
  if(belly){
    const rx = parseFloat(belly.getAttribute('rx'));
    const ry = parseFloat(belly.getAttribute('ry'));
    const cx = parseFloat(belly.getAttribute('cx'));
    const cy = parseFloat(belly.getAttribute('cy'));
    const dx = svgP.x - cx;
    const dy = svgP.y - cy;
    const inside = (dx*dx)/(rx*rx) + (dy*dy)/(ry*ry) <= 1;
    if(inside){
      // belly poke -> angry
      cat.classList.remove('happy');
      cat.classList.add('angry');
      // little visual jig
      setTimeout(()=> cat.classList.remove('angry'), 900);
      return;
    }
  }

  // otherwise treat as head-pet -> happy
  cat.classList.remove('angry');
  cat.classList.add('happy');
  // small animation: scale head slightly
  setTimeout(()=> cat.classList.remove('happy'), 900);
});

/* make cat draggable on touchstart as well */
cat.addEventListener('touchstart', (e)=> {
  // prevent scrolling when touching cat
  e.preventDefault();
}, {passive:false});

/* small accessibility: keyboard move */
cat.addEventListener('keydown', (e)=>{
  const step = 16;
  const rect = cat.getBoundingClientRect();
  if(e.key === 'ArrowLeft') cat.style.left = Math.max(8, rect.left - step) + 'px';
  if(e.key === 'ArrowRight') cat.style.left = Math.min(window.innerWidth - rect.width - 8, rect.left + step) + 'px';
  if(e.key === 'ArrowUp') cat.style.top = Math.max(8, rect.top - step) + 'px';
  if(e.key === 'ArrowDown') cat.style.top = Math.min(window.innerHeight - rect.height - 8, rect.top + step) + 'px';
});

/* initial placement (bottom-right) */
(function initPosition(){
  cat.style.right = '18px';
  cat.style.bottom = '18px';
  // but set explicit left/top for dragging math
  const rect = cat.getBoundingClientRect();
  cat.style.left = (window.innerWidth - rect.width - 18) + 'px';
  cat.style.top = (window.innerHeight - rect.height - 18) + 'px';
})();

/* small nicety: close modal when clicking outside modal card */
modal.addEventListener('click', (e)=> {
  if(e.target === modal) closeModal();
});

