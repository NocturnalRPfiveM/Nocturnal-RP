const SERVER_IP = '5.249.165.174';
const SERVER_PORT = '30106';
const DIRECT_URL = `http://${SERVER_IP}:${SERVER_PORT}/dynamic.json`;
const CFX_RE_API = 'https://servers-frontend.fivem.net/api/servers/single/rodoqg';
const REFRESH_INTERVAL = 30000;

const playerCountEl = document.getElementById('playerCount');
const serverStatusEl = document.getElementById('serverStatus');
const maxPlayersEl = document.getElementById('maxPlayers');

async function fetchServerData() {
  try {
    const data = await tryDirectFetch();
    if (data) {
      updateStats(data);
      return;
    }
  } catch (_) {}

  try {
    const response = await fetch(CFX_RE_API, { headers: { 'Accept': 'application/json' } });
    if (response.ok) {
      const data = await response.json();
      if (data && data.Data && data.Data.server) {
        const server = data.Data.server;
        const clients = data.Data.clients;
        if (server.up === true || server.up === 'true') {
          const currentPlayers = clients ? parseInt(clients, 10) : 0;
          const maxPlayers = server.sv_maxclients ? parseInt(server.sv_maxclients, 10) : 64;
          animateNumber(playerCountEl, currentPlayers);
          serverStatusEl.textContent = 'Online';
          serverStatusEl.style.color = '#4ade80';
          maxPlayersEl.textContent = maxPlayers;
          return;
        }
      }
    }
  } catch (_) {}

  setOffline();
}

async function tryDirectFetch() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(DIRECT_URL, {
      signal: controller.signal,
      mode: 'cors',
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const data = await response.json();
    if (data && data.clients !== undefined) {
      return {
        clients: parseInt(data.clients, 10) || 0,
        maxClients: parseInt(data.sv_maxclients, 10) || 48,
      };
    }
    return null;
  } catch (_) {
    clearTimeout(timeoutId);
    return null;
  }
}

function updateStats(data) {
  if (!data) {
    setOffline();
    return;
  }

  animateNumber(playerCountEl, data.clients || 0);
  serverStatusEl.textContent = 'Online';
  serverStatusEl.style.color = '#4ade80';
  maxPlayersEl.textContent = data.maxClients || '--';
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
    if (diff > 0) {
      val = Math.min(val + step, target);
    } else {
      val = Math.max(val - step, target);
    }
    el.textContent = val;
    if (val === target) clearInterval(timer);
  }, 40);
}

fetchServerData();
setInterval(fetchServerData, REFRESH_INTERVAL);

const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.feature-card, .about-stat-card, .section-header').forEach((el) => {
  el.classList.add('reveal');
  observer.observe(el);
});
