// Tillgänglighetsförbättring
document.documentElement.classList.remove('no-js');

// ===== Data (du kan byta bilder & info fritt) =====
const DESTINATIONS = [
  { id: 1, name: "Lisbon, Portugal", vibe: ["stad","mat"], price: 4200, rating: 4.7, img: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=1200&auto=format&fit=crop", badge: "Soligt & prisvärt" },
  { id: 2, name: "Reykjavik, Island", vibe: ["natur","äventyr"], price: 8900, rating: 4.8, img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop", badge: "Norrsken" },
  { id: 3, name: "Kyoto, Japan", vibe: ["kultur","mat"], price: 12500, rating: 4.9, img: "https://images.unsplash.com/photo-1558981359-219d6364c9c8?q=80&w=1200&auto=format&fit=crop", badge: "Tempel & te" },
  { id: 4, name: "Tulum, Mexiko", vibe: ["strand","nattliv"], price: 9800, rating: 4.5, img: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop", badge: "Turkost vatten" },
  { id: 5, name: "Banff, Kanada", vibe: ["natur","äventyr"], price: 11200, rating: 4.8, img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop", badge: "Alpint dröm" },
  { id: 6, name: "Marrakech, Marocko", vibe: ["kultur","mat"], price: 5600, rating: 4.6, img: "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200&auto=format&fit=crop", badge: "Marknadsmagi" },
  { id: 7, name: "Seoul, Sydkorea", vibe: ["stad","nattliv"], price: 9900, rating: 4.7, img: "https://images.unsplash.com/photo-1517824806704-9040b037703b?q=80&w=1200&auto=format&fit=crop", badge: "Neon & bibimbap" },
  { id: 8, name: "Amalfi, Italien", vibe: ["strand","kultur"], price: 10400, rating: 4.6, img: "https://images.unsplash.com/photo-1500375592092-1266e0c6a3f0?q=80&w=1200&auto=format&fit=crop", badge: "Citrus & klippor" },
  { id: 9, name: "Queenstown, Nya Zeeland", vibe: ["äventyr","natur"], price: 15400, rating: 4.9, img: "https://images.unsplash.com/photo-1526481280698-8fcc13fd3b5e?q=80&w=1200&auto=format&fit=crop", badge: "Adrenalin" }
];

const PALETTES = [
  ["#ff6aa9","#ffd166","#7cf7e6","#9b8cff"],
  ["#66a6ff","#56ffe1","#ffd166","#ff8fab"],
  ["#00e5ff","#ffd7a3","#ff73a1","#b693ff"],
  ["#ffb703","#8ecae6","#ff99c8","#90f1ef"],
  ["#caf0f8","#ffd6a5","#ffadad","#bdb2ff"],
  ["#00f5d4","#f15bb5","#fee440","#9b5de5"]
];

// ===== DOM =====
const cardsEl = document.getElementById('cards');
const sortEl = document.getElementById('sort');
const pills = document.querySelectorAll('.pill');
const paletteEl = document.getElementById('palette');
const datalist = document.getElementById('dest-list');

// ===== Renderpaletter =====
function renderPalettes() {
  PALETTES.forEach((row, i) => {
    const el = document.createElement('div');
    el.className = 'swatch';
    el.style.background = `linear-gradient(135deg, ${row[0]}, ${row[1]} 45%, ${row[2]} 65%, ${row[3]})`;
    el.title = `Använd palett ${i+1}`;
    el.setAttribute('tabindex','0');

    const label = document.createElement('div');
    label.className = 'swatch__label';
    label.textContent = '#färgkarta';

    el.addEventListener('click', () => {
      document.documentElement.style.setProperty('--primary', row[0]);
      document.documentElement.style.setProperty('--accent-2', row[1]);
      document.documentElement.style.setProperty('--accent', row[2]);
    });
    el.addEventListener('keypress', (e) => { if (e.key === 'Enter') el.click(); });

    el.appendChild(label);
    paletteEl.appendChild(el);
  });
}

// ===== Renderdestinationer =====
function renderCards(list) {
  cardsEl.innerHTML = '';
  list.forEach(d => {
    const card = document.createElement('article');
    card.className = 'card reveal';
    card.innerHTML = `
      <div class="card__media">
        <img src="${d.img}" alt="${d.name}" loading="lazy">
        <span class="badge">${d.badge}</span>
      </div>
      <div class="card__body">
        <h3 class="card__title">${d.name}</h3>
        <div class="card__meta">
          <span class="tag">${d.vibe.join(' · ')}</span>
          <span class="tag">★ ${d.rating}</span>
        </div>
        <div class="card__actions">
          <span class="price">${d.price.toLocaleString('sv-SE')} kr</span>
          <button class="btn btn--ghost" data-like="${d.id}" aria-pressed="false">Gilla</button>
          <button class="btn" data-book="${d.id}">Boka</button>
        </div>
      </div>`;
    cardsEl.appendChild(card);
  });
  buildDatalist(list);
  revealOnScroll();
}

function buildDatalist(list) {
  datalist.innerHTML = '';
  list.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.name;
    datalist.appendChild(opt);
  });
}

// ===== Sortering och filtrering =====
function sortList(list, mode) {
  const l = [...list];
  if (mode === 'price') l.sort((a,b)=>a.price-b.price);
  else if (mode === 'name') l.sort((a,b)=>a.name.localeCompare(b.name, 'sv'));
  else l.sort((a,b)=>b.rating-a.rating);
  return l;
}

let activeFilter = null;

function applyFilterAndSort() {
  const mode = sortEl.value;
  const filtered = activeFilter ? DESTINATIONS.filter(d=>d.vibe.includes(activeFilter)) : DESTINATIONS;
  const sorted = sortList(filtered, mode);
  renderCards(sorted);
}

// ===== Tema & meny =====
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'sunset' ? 'lagoon' : 'sunset';
  document.documentElement.setAttribute('data-theme', next);
  themeToggle.setAttribute('aria-pressed', String(next === 'lagoon'));
});

const menuBtn = document.getElementById('menuButton');
const menu = document.getElementById('menu');
menuBtn?.addEventListener('click', () => {
  const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!expanded));
  menu.setAttribute('aria-hidden', String(expanded));
});

// ===== Sökformulär =====
document.getElementById('searchForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const q = (document.getElementById('q').value || '').toLowerCase();
  const mood = document.getElementById('mood').value.toLowerCase();

  let result = DESTINATIONS.filter(d =>
    d.name.toLowerCase().includes(q) ||
    d.vibe.some(v=>v.includes(q))
  );
  if (mood) result = result.filter(d=>d.vibe.includes(mood));

  renderCards(sortList(result, document.getElementById('sort').value));
});

// ===== Pill-filter =====
document.querySelectorAll('.pill').forEach(pill=>{
  pill.addEventListener('click', ()=>{
    const f = pill.dataset.filter;
    activeFilter = (activeFilter === f) ? null : f;
    document.querySelectorAll('.pill').forEach(p=>p.setAttribute('aria-pressed','false'));
    if (activeFilter) pill.setAttribute('aria-pressed','true');
    applyFilterAndSort();
  });
});

// ===== Gilla-knapp + boka =====
document.addEventListener('click', (e)=>{
  const likeBtn = e.target.closest('[data-like]');
  if (likeBtn){
    const pressed = likeBtn.getAttribute('aria-pressed') === 'true';
    likeBtn.setAttribute('aria-pressed', String(!pressed));
    likeBtn.textContent = pressed ? 'Gilla' : 'Gillad ✓';
  }
  const bookBtn = e.target.closest('[data-book]');
  if (bookBtn){
    const id = Number(bookBtn.getAttribute('data-book'));
    const dest = DESTINATIONS.find(d=>d.id===id);
    openBooking(dest?.name);
  }
});

document.getElementById('sort').addEventListener('change', applyFilterAndSort);

// ===== Modal =====
const bookingDialog = document.getElementById('booking');
const openBookingBtn = document.getElementById('bookBtn');
openBookingBtn.addEventListener('click', () => openBooking());

function openBooking(prefill){
  if (prefill) document.querySelector('input[name="destination"]').value = prefill;
  if (typeof bookingDialog.showModal === 'function') bookingDialog.showModal();
  else alert('Din webbläsare stödjer inte dialog – men formuläret visas ändå.');
}

document.getElementById('bookingForm').addEventListener('close', ()=>{});
document.getElementById('bookingForm').addEventListener('submit', (e)=>{
  // hindra faktisk submit eftersom dialog[method=dialog] stänger
  e.preventDefault();
});

bookingDialog.addEventListener('close', ()=>{
  if (bookingDialog.returnValue === 'confirm') {
    const data = Object.fromEntries(new FormData(document.getElementById('bookingForm')).entries());
    alert(`Tack ${data.name}! Vi återkommer om resa till ${data.destination}.`);
  }
});

// ===== Reveal on scroll =====
function revealOnScroll(){
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting){
        entry.target.animate(
          [{opacity:0, transform:'translateY(12px)'}, {opacity:1, transform:'translateY(0)'}],
          {duration: 420, easing:'cubic-bezier(.2,.6,.2,1)', fill:'both'}
        );
        obs.unobserve(entry.target);
      }
    });
  }, {threshold: .12});
  els.forEach(el=>obs.observe(el));
}

// ===== Init =====
(function init(){
  renderPalettes();
  applyFilterAndSort();
})();
