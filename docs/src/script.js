const elements = {
  listenBtn: document.getElementById('listen-btn'),
  stopBtn: document.getElementById('stop-btn'),
  speakBtn: document.getElementById('speak-btn'),
  textInput: document.getElementById('text-input'),
  transcript: document.getElementById('transcript'),
  status: document.getElementById('status'),
  langSelect: document.getElementById('lang-select'),
  themeToggle: document.getElementById('theme-toggle'),
  listenLabel: document.getElementById('listen-label'),
  quickActions: document.querySelector('.quick-actions'),
  appTitle: document.getElementById('app-title'),
  appSubtitle: document.getElementById('app-subtitle')
};

const translations = {
  "en-US": {
    listen: "Listen",
    stop: "Stop",
    speak: "Speak",
    ready: "Ready",
    listening: "Listening...",
    unsupported: "Speech recognition not supported in this browser.",
    wikiIntro: "According to Wikipedia",
    youtubeIntro: "Opening YouTube results for",
    findPharmacy: "Opening maps for nearby pharmacies"
  },
  "pt-BR": {
    listen: "Ouvir",
    stop: "Parar",
    speak: "Falar",
    ready: "Pronto",
    listening: "Ouvindo...",
    unsupported: "Reconhecimento de voz não suportado neste navegador.",
    wikiIntro: "De acordo com a Wikipédia",
    youtubeIntro: "Abrindo resultados no YouTube para",
    findPharmacy: "Abrindo mapas para farmácias próximas"
  },
  "es-ES": {
    listen: "Escuchar",
    stop: "Detener",
    speak: "Hablar",
    ready: "Listo",
    listening: "Escuchando...",
    unsupported: "Reconocimiento de voz no soportado en este navegador.",
    wikiIntro: "Según Wikipedia",
    youtubeIntro: "Abriendo resultados de YouTube para",
    findPharmacy: "Abriendo mapas para farmacias cercanas"
  }
};

let currentLang = elements.langSelect.value || 'en-US';
let recognition = null;
let isListening = false;

// Initialize UI text based on language
function applyTranslations() {
  const t = translations[currentLang] || translations['en-US'];
  elements.listenLabel.textContent = t.listen;
  elements.stopBtn.textContent = t.stop;
  elements.speakBtn.textContent = `🔊 ${t.speak}`;
  elements.status.textContent = t.ready;
}
applyTranslations();

// Theme toggle
elements.themeToggle.addEventListener('click', () => {
  const body = document.body;
  const isDark = body.classList.contains('theme-dark');
  if (isDark) {
    body.classList.remove('theme-dark');
    body.classList.add('theme-light');
    body.setAttribute('data-theme', 'light');
    elements.themeToggle.setAttribute('aria-pressed', 'false');
  } else {
    body.classList.remove('theme-light');
    body.classList.add('theme-dark');
    body.setAttribute('data-theme', 'dark');
    elements.themeToggle.setAttribute('aria-pressed', 'true');
  }
});

// Language change
elements.langSelect.addEventListener('change', (e) => {
  currentLang = e.target.value;
  applyTranslations();
});

// Speech Recognition setup
function setupRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    elements.status.textContent = translations[currentLang].unsupported;
    elements.listenBtn.disabled = true;
    return null;
  }

  const r = new SpeechRecognition();
  r.lang = currentLang;
  r.interimResults = false;
  r.maxAlternatives = 1;
  r.continuous = false;

  r.onstart = () => {
    isListening = true;
    elements.status.textContent = translations[currentLang].listening;
    elements.listenBtn.setAttribute('aria-pressed', 'true');
    elements.stopBtn.disabled = false;
  };

  r.onresult = (evt) => {
    const text = evt.results[0][0].transcript;
    appendTranscript(text);
    elements.textInput.value = text;
    handleCommand(text);
  };

  r.onerror = (evt) => {
    appendTranscript(`Error: ${evt.error}`);
  };

  r.onend = () => {
    isListening = false;
    elements.status.textContent = translations[currentLang].ready;
    elements.listenBtn.setAttribute('aria-pressed', 'false');
    elements.stopBtn.disabled = true;
  };

  return r;
}

recognition = setupRecognition();

// UI actions
elements.listenBtn.addEventListener('click', () => {
  if (!recognition) recognition = setupRecognition();
  if (!recognition) return;
  try {
    recognition.lang = currentLang;
    recognition.start();
  } catch (e) {
    // ignore repeated starts
  }
});

elements.stopBtn.addEventListener('click', () => {
  if (recognition && isListening) recognition.stop();
});

elements.speakBtn.addEventListener('click', () => {
  const text = elements.textInput.value.trim();
  if (text) speakText(text);
});

// Quick actions
elements.quickActions.addEventListener('click', (e) => {
  const action = e.target.getAttribute('data-action');
  if (!action) return;
  if (action === 'search-wikipedia') {
    const q = elements.textInput.value.trim();
    openWikipedia(q);
  } else if (action === 'open-youtube') {
    const q = elements.textInput.value.trim();
    openYouTube(q);
  } else if (action === 'find-pharmacy') {
    findNearbyPharmacy();
  }
});

// Append transcript safely
function appendTranscript(text) {
  const node = document.createElement('div');
  node.textContent = text;
  elements.transcript.appendChild(node);
  elements.transcript.scrollTop = elements.transcript.scrollHeight;
}

// Basic command handling
function handleCommand(text) {
  const lower = text.toLowerCase();
  // Simple keywords
  if (lower.includes('youtube') || lower.includes('video') || lower.includes('play')) {
    const query = extractQuery(lower, ['youtube', 'video', 'play']);
    openYouTube(query);
  } else if (lower.includes('wikipedia') || lower.includes('wikipédia') || lower.includes('search') || lower.includes('look up')) {
    const query = extractQuery(lower, ['wikipedia', 'wikipédia', 'search', 'look up']);
    openWikipedia(query);
  } else if (lower.includes('pharmacy') || lower.includes('farmácia') || lower.includes('farmacia')) {
    findNearbyPharmacy();
  } else if (lower.includes('time') || lower.includes('hora') || lower.includes('tiempo')) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString(currentLang, {hour: '2-digit', minute: '2-digit'});
    speakText(timeStr);
    appendTranscript(timeStr);
  } else {
    // fallback: speak back the recognized text
    speakText(text);
  }
}

// Try to extract a query phrase after keywords
function extractQuery(text, keywords) {
  for (const k of keywords) {
    const idx = text.indexOf(k);
    if (idx !== -1) {
      const after = text.slice(idx + k.length).trim();
      if (after.length > 0) return after;
    }
  }
  return text;
}

// Open YouTube search; if no query open YouTube home
function openYouTube(query) {
  if (!query || query.trim() === '') {
    window.open('https://www.youtube.com/', '_blank', 'noopener');
    speakText(translations[currentLang].youtubeIntro);
    return;
  }
  const encoded = encodeURIComponent(query);
  const url = `https://www.youtube.com/results?search_query=${encoded}`;
  window.open(url, '_blank', 'noopener');
  speakText(`${translations[currentLang].youtubeIntro} ${query}`);
}

// Open Wikipedia search page; prefer pt.wikipedia main page for pt-BR when no query
function openWikipedia(query) {
  const langPrefix = currentLang.split('-')[0] || 'en';
  // If Portuguese (Brazil) explicitly requested and no query provided, open the Portuguese Wikipedia main page
  if (currentLang === 'pt-BR' && (!query || query.trim() === '')) {
    window.open('https://pt.wikipedia.org/wiki/Wikip%C3%A9dia:P%C3%A1gina_principal', '_blank', 'noopener');
    speakText(translations[currentLang].wikiIntro);
    return;
  }
  const encoded = encodeURIComponent(query || '');
  const url = query
    ? `https://${langPrefix}.wikipedia.org/wiki/Special:Search?search=${encoded}`
    : `https://${langPrefix}.wikipedia.org/wiki/Wikip%C3%A9dia:P%C3%A1gina_principal`;
  window.open(url, '_blank', 'noopener');
  speakText(translations[currentLang].wikiIntro);
}

// Open Google Maps for nearest pharmacy in Miracatu (exact URL provided)
function findNearbyPharmacy() {
  const url = 'https://www.google.com/maps/search/Nearest+pharmacy+in+Miracatu/@-24.2820025,-47.4649994,1261m/data=!3m2!1e3!4b1?entry=ttu&g_ep=EgoyMDI2MDgxOS4wIKXMDSoASAFQAw%3D%3D';
  window.open(url, '_blank', 'noopener');
  speakText(translations[currentLang].findPharmacy);
}

// Speech synthesis
function speakText(text) {
  if (!('speechSynthesis' in window)) {
    appendTranscript('Speech synthesis not supported.');
    return;
  }
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = currentLang;
  const voices = speechSynthesis.getVoices();
  const match = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(currentLang.split('-')[0]));
  if (match) utter.voice = match;
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

// Accessibility: keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.altKey && e.key === 'l') { // Alt+L to listen
    elements.listenBtn.click();
  } else if (e.altKey && e.key === 's') { // Alt+S to speak
    elements.speakBtn.click();
  } else if (e.altKey && e.key === 't') { // Alt+T toggle theme
    elements.themeToggle.click();
  }
});

// Initialize voices (some browsers load voices asynchronously)
if (typeof speechSynthesis !== 'undefined') {
  speechSynthesis.onvoiceschanged = () => {
    // no-op but ensures voices are loaded for speakText
  };
}
