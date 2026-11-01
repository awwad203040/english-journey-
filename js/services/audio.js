// English Journey - Audio & Speech Services
// 1. Text-To-Speech (Native Android TTS Bridge + Web Speech API + Online Audio Fallback)
// 2. Speech-To-Text (Native Android STT Bridge + Web SpeechRecognition + Word Pronunciation)
// 3. Web Audio API Synthesized Sound Effects (Clicks, Chimes, Fanfares)

class AudioService {
  constructor() {
    this.voices = [];
    this.audioCtx = null;
    this.speechUnlocked = false;
    this.currentToken = 0;
    this._nativeCallbacks = {};
    this._sttCallbacks = { onResult: null, onError: null, onListening: null };
    this.audioElement = null;
    this.activeRecognition = null;

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

  isNativeSTT() {
    return (
      typeof window !== "undefined" &&
      typeof window.AndroidNativeSTT !== "undefined" &&
      typeof window.AndroidNativeSTT.startListening === "function"
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
    if (v) return { voice: v, isHighQuality: (v && good.test(v.name)) };
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
  speakNative(text, isAr, tok, customRate = 0) {
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

      const timeoutMs = Math.max(3000, text.length * 130);
      const timer = setTimeout(finish, timeoutMs);

      this._nativeCallbacks[uid] = () => {
        if (tok === this.currentToken) finish();
      };

      try {
        const lang = isAr ? "ar" : "en";
        const rate = customRate > 0 ? customRate : this.speechRate;
        window.AndroidNativeTTS.speak(this.cleanText(text), lang, rate, uid);
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
  speakOne(text, isAr, tok, customRate = 0) {
    if (!text) return Promise.resolve();
    this.unlockAudio();

    const effRate = customRate > 0 ? customRate : this.speechRate;

    // 1. Android Native TTS (In APK)
    if (this.isNativeAndroid()) {
      return this.speakNative(text, isAr, tok, effRate);
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
          u.rate = effRate;

          let done = false;
          const advance = () => {
            if (done) return;
            done = true;
            clearTimeout(timeoutId);
            idx++;
            speakNext();
          };

          // Anti-hang protection
          const timeoutId = setTimeout(advance, Math.max(3000, chunkStr.length * 120));

          u.onend = advance;
          u.onerror = advance;

          window._activeUtterance = u;
          window.speechSynthesis.speak(u);
        } catch (e) {
          idx++;
          speakNext();
        }
      };

      speakNext();
    });
  }

  // --- Speak English Phrase Directly ---
  speakEn(enText) {
    if (!enText) return Promise.resolve();
    return this.speakSeq("", enText, "en");
  }

  // --- Speak English Phrase Slowly for Learning ---
  speakSlow(enText) {
    if (!enText) return Promise.resolve();
    this.unlockAudio();
    const tok = ++this.currentToken;
    this.stopSpeech();
    return this.speakOne(enText, false, tok, 0.65);
  }

  // --- Helper to separate Arabic and English segments from mixed text ---
  splitArAndEn(text) {
    if (!text) return { ar: "", en: "" };
    const clean = text.replace(/_{2,}/g, " ").trim();
    const arMatches = clean.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s،؟؛:!.]+/g) || [];
    const enMatches = clean.match(/[a-zA-Z0-9\s,'.!?:_\-"]+/g) || [];

    const ar = arMatches.join(" ").replace(/\s+/g, " ").trim();
    const en = enMatches.join(" ").replace(/\s+/g, " ").trim();

    return { ar, en };
  }

  // --- Speak Linked Arabic + English Pair (Question or Answer) ---
  speakPair(arText, enText, delayMs = 280, customRate = 0) {
    this.unlockAudio();
    const tok = ++this.currentToken;
    this.stopSpeech();

    const ar = this.cleanText(arText);
    const en = this.cleanText(enText);

    if (ar && en) {
      return this.speakOne(ar, true, tok).then(() => {
        if (tok !== this.currentToken) return;
        return new Promise(r => setTimeout(r, delayMs)).then(() => {
          if (tok !== this.currentToken) return;
          return this.speakOne(en, false, tok, customRate);
        });
      });
    } else if (ar) {
      return this.speakOne(ar, true, tok);
    } else if (en) {
      return this.speakOne(en, false, tok, customRate);
    }
    return Promise.resolve();
  }

  // --- Speak Question (Ar + En) linked with Answer (Ar + En) ---
  speakQuestionAndAnswer(qAr, qEn, aAr, aEn, delayBetween = 420) {
    this.unlockAudio();
    const tok = ++this.currentToken;
    this.stopSpeech();

    const playQ = () => {
      const qA = this.cleanText(qAr);
      const qE = this.cleanText(qEn);
      if (qA && qE) {
        return this.speakOne(qA, true, tok).then(() => {
          if (tok !== this.currentToken) return;
          return new Promise(r => setTimeout(r, 260)).then(() => {
            if (tok !== this.currentToken) return;
            return this.speakOne(qE, false, tok);
          });
        });
      } else if (qA) {
        return this.speakOne(qA, true, tok);
      } else if (qE) {
        return this.speakOne(qE, false, tok);
      }
      return Promise.resolve();
    };

    const playA = () => {
      const aA = this.cleanText(aAr);
      const aE = this.cleanText(aEn);
      if (aA && aE) {
        return this.speakOne(aA, true, tok).then(() => {
          if (tok !== this.currentToken) return;
          return new Promise(r => setTimeout(r, 260)).then(() => {
            if (tok !== this.currentToken) return;
            return this.speakOne(aE, false, tok);
          });
        });
      } else if (aA) {
        return this.speakOne(aA, true, tok);
      } else if (aE) {
        return this.speakOne(aE, false, tok);
      }
      return Promise.resolve();
    };

    return playQ().then(() => {
      if (tok !== this.currentToken) return;
      return new Promise(r => setTimeout(r, delayBetween)).then(() => {
        if (tok !== this.currentToken) return;
        return playA();
      });
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
      return this.speakPair(arText, enText, 260);
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

  // --- Speech Recognition (STT) Manager ---
  startSpeechRecognition({ lang = "en-US", onListening, onResult, onError }) {
    this._sttCallbacks = { onListening, onResult, onError };

    // 1. If in Android APK with native STT
    if (this.isNativeSTT()) {
      try {
        window.AndroidNativeSTT.startListening(lang);
        return;
      } catch (e) {
        if (onError) onError("native_failed");
        return;
      }
    }

    // 2. Web Speech Recognition in browser
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
    if (!SR) {
      if (onError) onError("not_supported");
      return;
    }

    try {
      if (this.activeRecognition) {
        try { this.activeRecognition.abort(); } catch (e) {}
      }

      const rec = new SR();
      this.activeRecognition = rec;
      rec.lang = lang;
      rec.continuous = false;
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        if (onListening) onListening();
      };

      rec.onresult = (e) => {
        const text = e.results && e.results[0] && e.results[0][0] ? e.results[0][0].transcript : "";
        if (onResult) onResult(text);
      };

      rec.onerror = (e) => {
        const errType = e.error || "generic_error";
        if (onError) onError(errType);
      };

      rec.onend = () => {
        this.activeRecognition = null;
      };

      // Prompt mic permission if available via getUserMedia
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            stream.getTracks().forEach(t => t.stop()); // close test stream
            rec.start();
          })
          .catch(() => {
            rec.start(); // fallback attempt directly
          });
      } else {
        rec.start();
      }
    } catch (e) {
      if (onError) onError("start_failed");
    }
  }

  stopSpeechRecognition() {
    if (this.isNativeSTT()) {
      try { window.AndroidNativeSTT.stopListening(); } catch (e) {}
    }
    if (this.activeRecognition) {
      try { this.activeRecognition.abort(); } catch (e) {}
      this.activeRecognition = null;
    }
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

// Global Window Callbacks for Native Android STT Events
window.onNativeSTTListening = function() {
  if (typeof audioService !== "undefined" && audioService._sttCallbacks && audioService._sttCallbacks.onListening) {
    audioService._sttCallbacks.onListening();
  }
};

window.onNativeSTTResult = function(text) {
  if (typeof audioService !== "undefined" && audioService._sttCallbacks && audioService._sttCallbacks.onResult) {
    audioService._sttCallbacks.onResult(text);
  }
};

window.onNativeSTTError = function(err) {
  if (typeof audioService !== "undefined" && audioService._sttCallbacks && audioService._sttCallbacks.onError) {
    audioService._sttCallbacks.onError(err);
  }
};
