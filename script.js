/*
  Burmese apology website — vanilla JavaScript.
  Change the Burmese text in index.html to personalize the message.
  All images are stored locally in /assets; no API or server required.
*/
(() => {
  'use strict';
  const scenes = [...document.querySelectorAll('.scene')];
  const progressFill = document.getElementById('progressFill');
  const backButton = document.getElementById('backButton');
  const topTitle = document.getElementById('topTitle');
  const dots = document.getElementById('dots');
  const tapButton = document.getElementById('angerTap');
  const tapCountEl = document.getElementById('tapCount');
  const tapHint = document.getElementById('tapHint');
  const popLayer = document.getElementById('popLayer');
  const confetti = document.getElementById('confetti');
  const soundButton = document.getElementById('soundButton');
  const messages = ['ဆောရီးပါ 🥺', 'ကိုကို မှားပါတယ်', 'ခွင့်လွှတ်ပါနော်', 'နောက်မလုပ်တော့ဘူး!', 'ချစ်တယ် 💗', 'တောင်းပန်ပါတယ်', 'ဟုတ်ကဲ့ပါ Baby!', 'စိတ်မဆိုးနဲ့နော်', 'အများကြီးချစ်တယ်'];
  const labels = ['ကိုကို ပြောချင်တာလေး 💌', 'အမှန်တရားလေး 🌷', 'Baby စိတ်ကြိုက် 😾', 'ကိုကို့ ကတိလေး 🤞', 'Baby ဆုံးဖြတ်ပါ 💗', 'ရင်ထဲက စာတစ်စောင် 💌', 'ကိုကို့ အချစ် ❤️'];
  let current = 0;
  let taps = 0;
  let holdInterval = null;
  let audioCtx = null;
  let soundEnabled = false;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  for (let i = 0; i < scenes.length; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dots.append(dot);
  }

  function showScene(to) {
    if (to < 0 || to >= scenes.length || to === current) return;
    if (holdInterval !== null) stopHold();
    scenes[current].hidden = true;
    scenes[current].classList.remove('active');
    current = to;
    scenes[current].hidden = false;
    scenes[current].classList.add('active');
    // Restart entrance animation when revisiting a page.
    scenes[current].style.animation = 'none';
    void scenes[current].offsetWidth;
    scenes[current].style.animation = '';
    backButton.disabled = current === 0;
    progressFill.style.width = `${((current + 1) / scenes.length) * 100}%`;
    topTitle.textContent = labels[current];
    [...dots.children].forEach((dot, i) => dot.classList.toggle('active', i === current));
    if (current === scenes.length - 1) celebrate();
    if (soundEnabled) playNote(current);
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' });
  }

  document.querySelectorAll('[data-next]').forEach(btn => btn.addEventListener('click', () => showScene(current + 1)));
  backButton.addEventListener('click', () => showScene(current - 1));
  document.getElementById('readLetterButton').addEventListener('click', () => showScene(5));
  document.getElementById('notYetButton').addEventListener('click', () => {
    const response = document.getElementById('notYetResponse');
    response.hidden = false;
    if (soundEnabled) playNote(1);
  });
  document.getElementById('startOverButton').addEventListener('click', () => {
    taps = 0;
    tapCountEl.textContent = '0';
    tapHint.textContent = 'ပုံလေးကို နှိပ်ပါ၊ ဒါမှမဟုတ် ဖိထားပါ ✨';
    document.getElementById('notYetResponse').hidden = true;
    showScene(0);
  });

  function tapAngry() {
    taps++;
    tapCountEl.textContent = taps.toLocaleString('en-US');
    if (taps === 10) tapHint.textContent = 'ဟုတ်ကဲ့ Baby... ကိုကို နားထောင်နေပါတယ် 🥺';
    if (taps === 40) tapHint.textContent = 'နောက်တစ်ခါ မဖြစ်စေရပါဘူးနော် 💗';
    if (taps === 100) tapHint.textContent = '၁၀၀ ကြိမ် တောင်းပန်ပါတယ် Baby!';
    // Keep very brief floating speech bubbles readable rather than filling the screen.
    if (taps % 2 === 1) {
      const bubble = document.createElement('span');
      bubble.className = 'anger-pop';
      bubble.textContent = messages[Math.floor(Math.random() * messages.length)];
      bubble.style.setProperty('--drift', `${Math.round(Math.random() * 100 - 50)}px`);
      popLayer.appendChild(bubble);
      setTimeout(() => bubble.remove(), 900);
    }
    if (soundEnabled && taps % 8 === 1) playNote(2);
  }
  function stopHold() {
    if (holdInterval !== null) clearInterval(holdInterval);
    holdInterval = null;
    tapButton.classList.remove('pressing');
  }
  // A simple tap increments once, while press-and-hold builds up the count quickly.
  tapButton.addEventListener('pointerdown', event => {
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    event.preventDefault();
    stopHold();
    tapAngry();
    tapButton.classList.add('pressing');
    holdInterval = setInterval(tapAngry, 75);
  });
  ['pointerup', 'pointerleave', 'pointercancel', 'lostpointercapture'].forEach(type => tapButton.addEventListener(type, stopHold));
  tapButton.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && !event.repeat) {
      event.preventDefault();
      tapAngry();
    }
  });

  // Optional gentle synthesized chimes; sound is OFF until explicitly enabled.
  function ensureAudio() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      return true;
    } catch { return false; }
  }
  function playNote(index) {
    if (!soundEnabled || !ensureAudio()) return;
    const notes = [523.25, 659.25, 783.99, 698.46, 587.33, 659.25, 880];
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;
    oscillator.type = 'sine';
    oscillator.frequency.value = notes[index % notes.length];
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.30);
    oscillator.connect(gain);
    gain.connect(audioCtx.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.31);
  }
  soundButton.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundButton.setAttribute('aria-pressed', String(soundEnabled));
    soundButton.setAttribute('aria-label', soundEnabled ? 'အသံပိတ်ရန်' : 'အသံဖွင့်ရန်');
    if (soundEnabled) playNote(current);
  });

  function celebrate() {
    if (reduceMotion) return;
    confetti.replaceChildren();
    for (let i = 0; i < 36; i++) {
      const heart = document.createElement('span');
      heart.className = 'confetti-heart';
      heart.textContent = i % 3 === 0 ? '♡' : (i % 5 === 0 ? '✿' : '♥');
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.fontSize = `${12 + Math.random() * 19}px`;
      heart.style.color = ['#e86298', '#f7a0b7', '#c66898', '#e9bfd2'][i % 4];
      heart.style.animationDuration = `${3.4 + Math.random() * 3.4}s`;
      heart.style.animationDelay = `${Math.random() * 1.6}s`;
      confetti.append(heart);
    }
    setTimeout(() => confetti.replaceChildren(), 8500);
  }
})();
