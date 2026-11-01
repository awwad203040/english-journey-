// English Journey - Audio & Speech Services
// 1. Text-To-Speech (Native Android TTS Bridge + Web Speech API + Online Audio Fallback)
// 2. Speech-To-Text (Pronunciation Tester via SpeechRecognition)
// 3. Web Audio API Synthesized Sound Effects (Clicks, Chimes, Fanfares)

class AudioService {
  constructor() {
    this.voices = [];
    this.audioCtx = null;
    this.speechUnlocked = false;
    this.currentToken = 0;
    this._nativeCallbacks = {};
    this.audioElement = null;

    // Load persisted settings
    this.sfxEnabled = (typeof storageService !== "undefined") ? storageService.getSfxEnabled() : true;
    this.speechRate = (typeof storageService !== "undefined") ? storageService.getSpeechRate() : 0.9;

    this.initAudioContext();
    this.initVoices();
  }

  isNativeAndroid() {
    return (
      typeof window !== "undefined" &&
      typeof window.AndroidNativeTTS !== "undefined" &&
      typeof window.AndroidNativeTTS.speak === "function"
    );
  }

  initAudioContext() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  unlockAudio() {
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume().catch(() => {});
    }
    if (!this.speechUnlocked && "speechSynthesis" in window) {
      this.speechUnlocked = true;
      try {
        window.speechSynthesis.resume();
        const u = new SpeechSynthesisUtterance(" ");
        u.volume = 0;
        u.rate = 1;
        window.speechSynthesis.speak(u);
      } catch (e) {}
    }
  }

  initVoices() {
    if (!("speechSynthesis" in window)) return;
    const load = () => {
      try {
        const v = window.speechSynthesis.getVoices();
        if (v && v.length) {
          this.voices = v;
        }
      } catch (e) {}
    };
    load();
    if (typeof window.speechSynthesis.onvoiceschanged !== "undefined") {
      window.speechSynthesis.onvoiceschanged = load;
    }
    setTimeout(load, 300);
    setTimeout(load, 1000);
  }

  getArabicVoice() {
    const list = this.voices.length ? this.voices : (window.speechSynthesis ? window.speechSynthesis.getVoices() : []);
    let v = list.find(x => x.lang && x.lang.toLowerCase() === "ar-sa");
    if (v) return { voice: v, isSaudi: true };
    v = list.find(x => x.lang && x.lang.toLowerCase().startsWith("ar") && /saudi|سعود/i.test(x.name));
    if (v) return { voice: v, isSaudi: true };
    v = list.find(x => x.lang && ["ar-eg", "ar-ae", "ar-kw", "ar-qa"].includes(x.lang.toLowerCase())) ||
        list.find(x => x.lang && x.lang.toLowerCase().startsWith("ar"));
    if (v) return { voice: v, isSaudi: false };
    return { voice: null, isSaudi: false };
  }

  getEnglishVoice() {
    const list = this.voices.length ? this.voices : (window.speechSynthesis ? window.speechSynthesis.getVoices() : []);
    const good = /google|microsoft|natural|neural|online|premium|siri/i;
    let v = list.find(x => x.lang && x.lang.toLowerCase() === "en-us" && good.test(x.name));
    if (v) return { voice: v, isHighQuality: true };
    v = list.find(x => x.lang && x.lang.toLowerCase() === "en-gb" && good.test(x.name));
    if (v) return { voice: v, isHighQuality: true };
    v = list.find(x => x.lang && x.lang.toLowerCase() === "en-us") || list.find(x => x.lang && x.lang.toLowerCase() === "en-gb");
    if (v) return { voice: v, isHighQuality: good.test(v.name) };
    v = list.find(x => x.lang && x.lang.toLowerCase().startsWith("en"));
    return { voice: v || null, isHighQuality: false };
  }

  cleanText(txt) {
    return (txt || "").replace(/[?؟]/g, "").trim();
  }

  setSfxEnabled(val) {
    this.sfxEnabled = !!val;
    if (typeof storageService !== "undefined") {
      storageService.setSfxEnabled(this.sfxEnabled);
    }
  }

  setSpeechRate(rate) {
    this.speechRate = Number(rate) || 0.9;
    if (typeof storageService !== "undefined") {
      storageService.setSpeechRate(this.speechRate);
    }
  }

  // --- Speak via Native Android TTS ---
  speakNative(text, isAr, tok) {
    return new Promise(resolve => {
      const uid = "tts_" + Math.random().toString(36).substring(2, 9);
      let finished = false;

      const finish = () => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        delete this._nativeCallbacks[uid];
        resolve();
      };

      // Safety timeout: in case the engine takes too long or doesn't return
      const timeoutMs = Math.max(3000, text.length * 130);
      const timer = setTimeout(finish, timeoutMs);

      this._nativeCallbacks[uid] = () => {
        if (tok === this.currentToken) finish();
      };

      try {
        const lang = isAr ? "ar" : "en";
        window.AndroidNativeTTS.speak(this.cleanText(text), lang, this.speechRate, uid);
      } catch (e) {
        finish();
      }
    });
  }

  // --- Fallback Online Audio Speech (if browser lacks local Arabic voice) ---
  speakOnlineAudio(text, langCode, tok) {
    return new Promise(resolve => {
      try {
        if (this.audioElement) {
          this.audioElement.pause();
          this.audioElement = null;
        }
        const encoded = encodeURIComponent(this.cleanText(text).substring(0, 150));
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${langCode}&q=${encoded}`;
        const audio = new Audio(url);
        this.audioElement = audio;
        audio.playbackRate = this.speechRate;

        const cleanup = () => {
          clearTimeout(timer);
          audio.onended = null;
          audio.onerror = null;
          resolve();
        };

        const timer = setTimeout(cleanup, Math.max(3500, text.length * 150));
        audio.onended = cleanup;
        audio.onerror = cleanup;

        const playPromise = audio.play();
        if (playPromise && playPromise.catch) {
          playPromise.catch(cleanup);
        }
      } catch (e) {
        resolve();
      }
    });
  }

  // --- Speak a single phrase ---
  speakOne(text, isAr, tok) {
    if (!text) return Promise.resolve();
    this.unlockAudio();

    // 1. Android Native TTS (In APK)
    if (this.isNativeAndroid()) {
      return this.speakNative(text, isAr, tok);
    }

    // 2. Web Speech API (In Browsers)
    if (!("speechSynthesis" in window)) {
      return this.speakOnlineAudio(text, isAr ? "ar" : "en", tok);
    }

    const picked = isAr ? this.getArabicVoice() : this.getEnglishVoice();

    // If Arabic is requested in browser but no Arabic voice is installed at all:
    if (isAr && !picked.voice) {
      return this.speakOnlineAudio(text, "ar", tok);
    }

    const chunks = (text.match(/[^.!?؟،؛…]+[.!?؟،؛…]*/g) || [text]).map(s => s.trim()).filter(Boolean);

    return new Promise(resolve => {
      let idx = 0;

      const speakNext = () => {
        if (tok !== this.currentToken || idx >= chunks.length) {
          resolve();
          return;
        }

        try {
          window.speechSynthesis.resume();
          const chunkStr = this.cleanText(chunks[idx]);
          const u = new SpeechSynthesisUtterance(chunkStr);
          u.lang = picked.voice ? picked.voice.lang : (isAr ? "ar-SA" : "en-US");
          if (picked.voice) u.voice = picked.voice;
          u.rate = this.speechRate;

          let done = false;
          const advance = () => {
            if (done) return;
            done = true;
            clearTimeout(timeoutId);
            idx++;
            speakNext();
          };

          // Anti-hang protection (Chrome Web Speech API bugfix)
          const timeoutId = setTimeout(advance, Math.max(3000, chunkStr.length * 120));

          u.onend = advance;
          u.onerror = advance;

          window._activeUtterance = u; // Keep reference to prevent GC bug in Chrome
          window.speechSynthesis.speak(u);
        } catch (e) {
          idx++;
          speakNext();
        }
      };

      speakNext();
    });
  }

  // --- Speak sequence (Arabic then English or either) ---
  speakSeq(arText, enText, mode = "both") {
    this.unlockAudio();
    const tok = ++this.currentToken;

    // Stop previous utterances
    this.stopSpeech();

    if (mode === "ar" && arText) {
      return this.speakOne(arText, true, tok);
    }
    if (mode === "en" && enText) {
      return this.speakOne(enText, false, tok);
    }
    if (mode === "both") {
      if (arText && enText) {
        return this.speakOne(arText, true, tok).then(() => {
          if (tok !== this.currentToken) return;
          // Short pause between Arabic explanation and English phrase
          return new Promise(r => setTimeout(r, 260)).then(() => {
            if (tok !== this.currentToken) return;
            return this.speakOne(enText, false, tok);
          });
        });
      } else if (arText) {
        return this.speakOne(arText, true, tok);
      } else if (enText) {
        return this.speakOne(enText, false, tok);
      }
    }
    return Promise.resolve();
  }

  stopSpeech() {
    this.currentToken++;
    if (this.isNativeAndroid()) {
      try { window.AndroidNativeTTS.stop(); } catch (e) {}
    }
    if (this.audioElement) {
      try { this.audioElement.pause(); } catch (e) {}
      this.audioElement = null;
    }
    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
  }

  // --- Web Audio API Synthesizer (Sound Effects) ---
  playTone(freq, duration, type = "sine", gainVal = 0.1, delay = 0) {
    if (!this.sfxEnabled || !this.audioCtx) return;
    try {
      this.unlockAudio();
      const now = this.audioCtx.currentTime + delay;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(gainVal, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {}
  }

  playCorrect() {
    if (!this.sfxEnabled) return;
    this.unlockAudio();
    this.playTone(523.25, 0.12, "sine", 0.12, 0);       // C5
    this.playTone(659.25, 0.12, "sine", 0.12, 0.08);    // E5
    this.playTone(783.99, 0.22, "sine", 0.15, 0.16);    // G5
  }

  playWrong() {
    if (!this.sfxEnabled) return;
    this.unlockAudio();
    this.playTone(260, 0.15, "triangle", 0.12, 0);
    this.playTone(210, 0.25, "triangle", 0.12, 0.1);
  }

  playClick() {
    if (!this.sfxEnabled) return;
    this.unlockAudio();
    this.playTone(600, 0.03, "sine", 0.04, 0);
  }

  playFanfare() {
    if (!this.sfxEnabled) return;
    this.unlockAudio();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      this.playTone(freq, 0.25, "triangle", 0.12, idx * 0.1);
    });
  }

  getSpeechRecognition() {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }
}

// Global Audio Engine Instance
const audioService = new AudioService();

// Global Window Callbacks for Native Android TTS Events
window.onNativeTTSDone = function(uid) {
  if (typeof audioService !== "undefined" && audioService._nativeCallbacks && audioService._nativeCallbacks[uid]) {
    audioService._nativeCallbacks[uid]();
  }
};

window.onNativeTTSError = function(uid) {
  if (typeof audioService !== "undefined" && audioService._nativeCallbacks && audioService._nativeCallbacks[uid]) {
    audioService._nativeCallbacks[uid]();
  }
};
