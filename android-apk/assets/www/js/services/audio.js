// English Journey - Audio & Speech Services
// 1. Text-To-Speech (Arabic & English)
// 2. Speech-To-Text (Pronunciation Tester)
// 3. Web Audio API Sound Effects (Chimes, Clicks, Fanfares)

class AudioService {
  constructor() {
    this.voices = [];
    this.audioCtx = null;
    this.sfxEnabled = true;
    this.speechUnlocked = false;
    this.currentToken = 0;
    this.speechRate = 0.9;
    this.initAudioContext();
    this.initVoices();
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
      this.audioCtx.resume();
    }
    if (!this.speechUnlocked && "speechSynthesis" in window) {
      this.speechUnlocked = true;
      try {
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
      this.voices = window.speechSynthesis.getVoices() || [];
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    setTimeout(load, 500);
  }

  getArabicVoice() {
    const list = this.voices.length ? this.voices : (window.speechSynthesis ? window.speechSynthesis.getVoices() : []);
    let v = list.find(x => x.lang.toLowerCase() === "ar-sa");
    if (v) return { voice: v, isSaudi: true };
    v = list.find(x => x.lang.toLowerCase().startsWith("ar") && /saudi|سعود/i.test(x.name));
    if (v) return { voice: v, isSaudi: true };
    v = list.find(x => ["ar-eg", "ar-ae"].includes(x.lang.toLowerCase())) || list.find(x => x.lang.toLowerCase().startsWith("ar"));
    if (v) return { voice: v, isSaudi: false };
    return { voice: null, isSaudi: false };
  }

  getEnglishVoice() {
    const list = this.voices.length ? this.voices : (window.speechSynthesis ? window.speechSynthesis.getVoices() : []);
    const good = /google|microsoft|natural|neural|online|premium/i;
    let v = list.find(x => x.lang.toLowerCase() === "en-us" && good.test(x.name));
    if (v) return { voice: v, isHighQuality: true };
    v = list.find(x => x.lang.toLowerCase() === "en-gb" && good.test(x.name));
    if (v) return { voice: v, isHighQuality: true };
    v = list.find(x => x.lang.toLowerCase() === "en-us") || list.find(x => x.lang.toLowerCase() === "en-gb");
    if (v) return { voice: v, isHighQuality: good.test(v.name) };
    v = list.find(x => x.lang.toLowerCase().startsWith("en"));
    return { voice: v || null, isHighQuality: false };
  }

  cleanText(txt) {
    return (txt || "").replace(/[?؟]/g, "").trim();
  }

  speakOne(text, isAr, tok) {
    if (!text || !("speechSynthesis" in window)) return Promise.resolve();
    const picked = isAr ? this.getArabicVoice() : this.getEnglishVoice();
    const chunks = (text.match(/[^.!?؟،؛…]+[.!?؟،؛…]*/g) || [text]).map(s => s.trim()).filter(Boolean);

    return new Promise(resolve => {
      let idx = 0;
      const speakNext = () => {
        if (tok !== this.currentToken || idx >= chunks.length) {
          resolve();
          return;
        }
        try {
          const u = new SpeechSynthesisUtterance(this.cleanText(chunks[idx]));
          u.lang = picked.voice ? picked.voice.lang : (isAr ? "ar-SA" : "en-US");
          if (picked.voice) u.voice = picked.voice;
          u.rate = this.speechRate;
          u.onend = () => { idx++; speakNext(); };
          u.onerror = () => { idx++; speakNext(); };
          window.speechSynthesis.speak(u);
        } catch (e) {
          idx++;
          speakNext();
        }
      };
      speakNext();
    });
  }

  speakSeq(arText, enText, mode = "both") {
    if (!("speechSynthesis" in window)) return Promise.resolve();
    this.unlockAudio();
    const tok = ++this.currentToken;
    window.speechSynthesis.cancel();
    try { window.speechSynthesis.resume(); } catch (e) {}

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
          return this.speakOne(enText, false, tok);
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
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  // --- Sound Effects Synthesizer (Web Audio API) ---
  playTone(freq, duration, type = "sine", gainVal = 0.1, delay = 0) {
    if (!this.sfxEnabled || !this.audioCtx) return;
    try {
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
    this.unlockAudio();
    this.playTone(523.25, 0.12, "sine", 0.12, 0);       // C5
    this.playTone(659.25, 0.12, "sine", 0.12, 0.08);    // E5
    this.playTone(783.99, 0.22, "sine", 0.15, 0.16);    // G5
  }

  playWrong() {
    this.unlockAudio();
    this.playTone(260, 0.15, "triangle", 0.12, 0);
    this.playTone(210, 0.25, "triangle", 0.12, 0.1);
  }

  playClick() {
    this.unlockAudio();
    this.playTone(600, 0.03, "sine", 0.04, 0);
  }

  playFanfare() {
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

const audioService = new AudioService();
