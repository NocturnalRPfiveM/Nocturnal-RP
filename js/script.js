const SERVER_ID = 'rodoqg';
const API_URL = `https://servers-frontend.fivem.net/api/servers/single/${SERVER_ID}`;
const REFRESH_INTERVAL = 30000;

const playerCountEl = document.getElementById('playerCount');
const serverStatusEl = document.getElementById('serverStatus');
const maxPlayersEl = document.getElementById('maxPlayers');

async function fetchServerData() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    updateStats(data);
  } catch (err) {
    setOffline();
  }
}

function updateStats(data) {
  if (!data || !data.Data || !data.Data.server) {
    setOffline();
    return;
  }

  const server = data.Data.server;
  const clients = data.Data.clients;

  if (server.up === true || server.up === 'true') {
    const currentPlayers = clients ? parseInt(clients, 10) : 0;
    const maxPlayers = server.sv_maxclients ? parseInt(server.sv_maxclients, 10) : 64;

    animateNumber(playerCountEl, currentPlayers);
    serverStatusEl.textContent = 'Online';
    serverStatusEl.style.color = '#4ade80';
    maxPlayersEl.textContent = maxPlayers;
  } else {
    setOffline();
  }
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

// Header scroll effect
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
});

// Smooth reveal on scroll
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
