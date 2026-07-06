const STATUS_DATA_URL = 'data/status.json';
const REFRESH_INTERVAL = 60000;

const playerCountEl = document.getElementById('playerCount');
const serverStatusEl = document.getElementById('serverStatus');
const maxPlayersEl = document.getElementById('maxPlayers');

async function fetchServerData() {
  try {
    const response = await fetch(STATUS_DATA_URL);
    if (!response.ok) throw new Error('Failed');
    const data = await response.json();
    updateStats(data);
  } catch (_) {
    setOffline();
  }
}

function updateStats(data) {
  if (!data || data.clients === undefined) {
    setOffline();
    return;
  }
  const clients = parseInt(data.clients, 10) || 0;
  const maxClients = parseInt(data.sv_maxclients, 10) || 48;
  animateNumber(playerCountEl, clients);
  serverStatusEl.textContent = 'Online';
  serverStatusEl.style.color = '#4ade80';
  maxPlayersEl.textContent = maxClients;
}

function setOffline() {
  playerCountEl.textContent = '0';
  serverStatusEl.textContent = 'Offline';
  serverStatusEl.style.color = '#ef4444';
  maxPlayersEl.textContent = '--';
}

function animateNumber(el, target) {
  const current = parseInt(el.textContent, 10) || 0;
  if (current === target) return;
  const diff = target - current;
  const step = Math.ceil(Math.abs(diff) / 20);
  let val = current;
  const timer = setInterval(() => {
    if (diff > 0) val = Math.min(val + step, target);
    else val = Math.max(val - step, target);
    el.textContent = val;
    if (val === target) clearInterval(timer);
  }, 40);
}

fetchServerData();
setInterval(fetchServerData, REFRESH_INTERVAL);

const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.feature-card, .about-stat-card, .section-header').forEach((el) => {
  el.classList.add('reveal');
  observer.observe(el);
});
