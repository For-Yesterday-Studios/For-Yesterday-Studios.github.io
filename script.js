const pages = [...document.querySelectorAll('.page')];
const pageButtons = [...document.querySelectorAll('[data-page]')];
const nav = document.querySelector('.nav');
const menuButton = document.querySelector('.menu-button');
const footerCommand = document.querySelector('#footer-command');
const commands = { home: 'cd /home', games: 'dir /games', contact: 'open /contact' };

function renderPage() {
  let page = location.hash.slice(1);
  if (!commands[page]) page = 'home';
  pages.forEach(section => section.classList.toggle('active', section.id === page));
  pageButtons.forEach(button => button.classList.toggle('active', button.dataset.page === page));
  footerCommand.textContent = commands[page];
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  window.scrollTo(0, 0);
}

pageButtons.forEach(button => button.addEventListener('click', () => { location.hash = button.dataset.page; }));
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
window.addEventListener('hashchange', renderPage);
document.querySelector('#year').textContent = new Date().getFullYear();

const copyButton = document.querySelector('.copy-button');
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyButton.dataset.email);
    copyButton.textContent = 'EMAIL COPIED';
    setTimeout(() => { copyButton.textContent = 'COPY EMAIL ADDRESS'; }, 1600);
  } catch {
    location.href = 'mailto:' + copyButton.dataset.email;
  }
});

// Show a text fallback if logo.png has not been uploaded yet.
document.querySelectorAll('img[src="logo.png"]').forEach(image => {
  image.addEventListener('error', () => {
    image.style.display = 'none';
    const fallback = image.nextElementSibling;
    if (fallback) fallback.style.display = 'grid';
  });
});

renderPage();

// BIOS / POST startup sequence, approximately 6.5 seconds.
const bootScreen = document.querySelector('#boot-screen');
const siteContent = document.querySelector('#website-content');
const bootOutput = document.querySelector('#boot-output');
const bootProgress = document.querySelector('#boot-progress');
const bootPercent = document.querySelector('#boot-percent');
const bootStage = document.querySelector('#boot-stage');
const skipBoot = document.querySelector('#skip-boot');
let bootFinished = false;

const bootLines = [
  { text: 'For Yesterday Creative BIOS v1.0', className: 'boot-white', delay: 180 },
  { text: 'Copyright (C) 2026 For Yesterday Studios', className: 'boot-dim', delay: 260 },
  { text: '', className: '', delay: 180 },
  { text: 'Detecting creative processors .............. [ OK ]', className: 'boot-ok', delay: 410 },
  { text: 'Memory test: 65536 MB imagination .......... [ OK ]', className: 'boot-ok', delay: 450 },
  { text: 'Initializing rendering subsystem ........... [ OK ]', className: 'boot-ok', delay: 430 },
  { text: 'Mounting C:\\FYS\\games ..................... [ OK ]', className: 'boot-ok', delay: 460 },
  { text: 'Loading audio drivers ...................... [ OK ]', className: 'boot-ok', delay: 410 },
  { text: 'Checking sleep schedule .................... [ WARN ]', className: 'boot-warn', delay: 490 },
  { text: 'Coffee device detected on PORT_01', className: 'boot-dim', delay: 360 },
  { text: 'Network connection established.', className: 'boot-dim', delay: 390 },
  { text: '', className: '', delay: 180 },
  { text: 'Starting studio interface...', className: 'boot-white', delay: 520 },
  { text: 'C:\\FYS> launch website.exe_', className: 'boot-white', delay: 1120 }
];

const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

function setBootProgress(value, stage) {
  bootProgress.style.width = value + '%';
  bootPercent.textContent = value + '%';
  if (stage) bootStage.textContent = stage;
}

function finishBoot() {
  if (bootFinished) return;
  bootFinished = true;
  setBootProgress(100, 'Startup complete');
  siteContent.classList.add('site-ready');
  setTimeout(() => bootScreen.classList.add('boot-hidden'), 180);
  setTimeout(() => bootScreen.remove(), 950);
}

async function runBoot() {
  setBootProgress(4, 'Power-on self-test');
  for (let index = 0; index < bootLines.length && !bootFinished; index++) {
    const item = bootLines[index];
    const line = document.createElement('div');
    line.className = 'boot-line ' + item.className;
    line.textContent = item.text || '\u00a0';
    bootOutput.appendChild(line);
    requestAnimationFrame(() => line.classList.add('show'));
    const value = Math.min(94, Math.round(5 + ((index + 1) / bootLines.length) * 89));
    const stage = index < 3 ? 'Power-on self-test' : index < 9 ? 'Loading system components' : index < 12 ? 'Checking devices' : 'Launching interface';
    setBootProgress(value, stage);
    await wait(item.delay);
  }
  if (!bootFinished) {
    await wait(180);
    finishBoot();
  }
}

document.addEventListener('keydown', event => { if (event.key === 'Escape') finishBoot(); });
skipBoot.addEventListener('click', finishBoot);
runBoot();
