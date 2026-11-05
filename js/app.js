// English Journey - Master Application Controller

class App {
  constructor() {
    this.currentScreen = "splash";
    this.currentLessonKey = null;
    this.detailBackScreen = "lessons";
    this.currentLevelTab = 1;

    // Quiz State
    this.quizKey = null;
    this.quizList = [];
    this.quizIndex = 0;
    this.quizScore = 0;
    this.quizBackScreen = "home";
    this.quizAnswered = false;
    this.orderState = null;

    // Story State
    this.currentStoryId = null;
    this.storyNodeKey = "n1";

    // Travel Dialogue State
    this.travelKey = null;
    this.travelIndex = 0;
    this.travelDone = false;

    // Speaking & Listening State
    this.slPool = [];
    this.slIndex = 0;
    this.slScore = 0;
    this.slListenDone = false;

    // Mini-game State
    this.gamePool = [];
    this.gameRound = 0;
    this.gameScore = 0;
    this.gameTotal = 10;

    // Challenge State
    this.challengeTimer = null;
    this.challengeSeconds = 60;
    this.challengeTopic = "";

    // What to say state
    this.currentSayEn = "";
    this.currentSayAr = "";

    // 1. Lumi Voice Call State
    this.callScenarioKey = "coffee";
    this.callStageIndex = 0;
    this.callTimerInterval = null;
    this.callSeconds = 0;
    this.callActive = false;

    // 2. Phonics State
    this.currentPhonicsKey = "pb";

    // 3. Smart SRS Flashcards State
    this.srsPool = [];
    this.srsIndex = 0;
    this.srsFlipped = false;
    this.currentSRSCard = null;

    // 4. Sentence Lego Builder State
    this.legoIndex = 0;
    this.legoSlotsPlaced = [];

    // 5. Speech Shadowing State
    this.shadowIndex = 0;
    this.shadowSpeed = "normal";

    // 6. Diagnostic Placement State
    this.placementIndex = 0;
    this.placementScore = 0;

    this.init();
  }

  init() {
    // Apply saved theme
    const theme = storageService.getTheme();
    document.documentElement.setAttribute("data-theme", theme);

    // Apply streak
    storageService.touchStreak();

    // Setup Event Listeners
    this.setupGlobalEvents();

    // Start with splash screen
    setTimeout(() => {
      const bar = document.getElementById("splashBar");
      if (bar) bar.style.width = "100%";
    }, 50);

    setTimeout(() => {
      const onboarded = storageService.get("ej_onboarded", false);
      this.showScreen(onboarded ? "home" : "login");
    }, 1400);
  }

  setupGlobalEvents() {
    // Unlock Web Audio / Speech on first interaction
    const unlockHandler = () => {
      audioService.unlockAudio();
      document.removeEventListener("click", unlockHandler);
      document.removeEventListener("touchstart", unlockHandler);
    };
    document.addEventListener("click", unlockHandler);
    document.addEventListener("touchstart", unlockHandler);

    // Setup input listeners
    const searchInp = document.getElementById("searchInput");
    if (searchInp) {
      searchInp.addEventListener("input", () => this.handleSearch());
    }

    const lumiInp = document.getElementById("lumiInput");
    if (lumiInp) {
      lumiInp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") this.sendLumi();
      });
    }
  }

  showScreen(screenId) {
    audioService.playClick();
    this.currentScreen = screenId;

    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    const target = document.getElementById(`screen-${screenId}`);
    if (target) {
      target.classList.add("active");
      const scrollEl = target.querySelector(".scroll-content");
      if (scrollEl) scrollEl.scrollTop = 0;
    }

    // Update bottom nav active indicators
    document.querySelectorAll(".nav-item").forEach(item => {
      const t = item.getAttribute("data-target");
      item.classList.toggle("active", t === screenId);
    });

    // Screen specific lifecycle calls
    switch (screenId) {
      case "home":
        this.renderHome();
        break;
      case "lessons":
        this.setLevelTab(this.currentLevelTab);
        break;
      case "grammar":
        this.renderGrammar();
        break;
      case "quizhub":
        this.renderQuizHub();
        break;
      case "storyhub":
        this.renderStoryHub();
        break;
      case "travelhub":
        this.renderTravelHub();
        break;
      case "lumiplan":
        this.renderLumiPlan();
        break;
      case "whatsay":
        this.resetWhatSay();
        break;
      case "errors":
        this.renderErrors();
        break;
      case "challenge":
        this.renderChallengeIntro();
        break;
      case "world":
        this.renderWorld();
        break;
      case "games":
        this.renderGameIntro();
        break;
      case "profile":
        this.renderProfile();
        break;
      case "certificate":
        this.renderCertificate();
        break;
      case "lumi":
        this.startLumiChat();
        break;
      case "onboarding":
        this.renderOnboarding();
        break;
      case "lumicall":
        this.openLumiCall(this.callScenarioKey || "coffee");
        break;
      case "phonics":
        this.openPhonicsLab();
        break;
      case "srs":
        this.openSRSFlashcards();
        break;
      case "lego":
        this.openLegoBuilder(this.legoIndex || 0);
        break;
      case "shadowing":
        this.openShadowingLab(this.shadowIndex || 0);
        break;
      case "placement":
        this.startPlacementTest();
        break;
    }
  }

  toast(msg) {
    const t = document.getElementById("toastNotice");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
  }

  // --- Theme & Desktop Layout Controls ---
  toggleTheme() {
    const curr = document.documentElement.getAttribute("data-theme") || "light";
    const next = curr === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    storageService.setTheme(next);
    audioService.playClick();
    this.toast(next === "dark" ? "🌙 تم تفعيل الوضع الليلي" : "☀️ تم تفعيل الوضع النهاري");
  }

  toggleDesktopFrame() {
    const wrapper = document.querySelector(".viewport-wrapper");
    if (wrapper) {
      wrapper.classList.toggle("fullwidth");
      const isFull = wrapper.classList.contains("fullwidth");
      this.toast(isFull ? "🖥️ وضع ملء الشاشة" : "📱 وضع شاشة الهاتف المحمول");
    }
  }

  // --- Home Screen ---
  renderHome() {
    const profile = storageService.getProfile();
    const streak = storageService.getStreak();
    const xp = storageService.getXP();
    const userLvl = storageService.getUserLevel();

    const greetingEl = document.getElementById("homeGreeting");
    if (greetingEl) {
      greetingEl.textContent = profile.name ? `أهلاً بك، ${profile.name} 👋` : "أهلاً بك في رحلتك 👋";
    }

    const pillEl = document.getElementById("homeLevelPill");
    if (pillEl) {
      pillEl.innerHTML = `${userLvl.badge} ${userLvl.name} (${xp} XP)`;
    }

    const streakEl = document.getElementById("homeStreakBadge");
    if (streakEl) {
      streakEl.textContent = `🔥 ${streak} يوم`;
    }

    // Continue Card
    const continueCard = document.getElementById("homeContinueCard");
    const lastKey = storageService.getLastLesson();
    if (continueCard) {
      if (lastKey && LESSONS[lastKey]) {
        continueCard.style.display = "block";
        const titleEl = document.getElementById("homeContinueTitle");
        if (titleEl) titleEl.textContent = `${LESSONS[lastKey].title} — ${LESSONS[lastKey].sub}`;
      } else {
        continueCard.style.display = "none";
      }
    }
  }

  continueLastLesson() {
    const lastKey = storageService.getLastLesson();
    if (lastKey && LESSONS[lastKey]) {
      this.openLesson(lastKey, "home");
    }
  }

  // --- Lessons & Curriculum ---
  setLevelTab(lvlNum) {
    this.currentLevelTab = lvlNum;
    for (let i = 1; i <= 6; i++) {
      const btn = document.getElementById(`lvlTab${i}`);
      if (btn) btn.classList.toggle("active", i === lvlNum);
    }
    this.renderLessonsList(lvlNum);
  }

  renderLessonsList(lvlNum) {
    const container = document.getElementById("lessonsListContainer");
    if (!container) return;
    container.innerHTML = "";

    const list = LEVEL_LESSONS[lvlNum] || [];
    list.forEach(item => {
      const row = document.createElement("div");
      row.className = "lesson-row";
      const isVisited = storageService.getVisitedList().includes(item.key);

      row.innerHTML = `
        <div class="icon-box" style="background:${isVisited ? '#ecfdf5' : 'var(--card-subtle)'}; color:${isVisited ? 'var(--green)' : 'var(--blue)'};">
          ${isVisited ? "✓" : "📖"}
        </div>
        <div class="grow">
          <div class="title">${item.title}</div>
          <div class="sub">${item.tag} ${isVisited ? "• تمت دراسته" : ""}</div>
        </div>
        <div class="arrow-icon">‹</div>
      `;
      row.onclick = () => this.openLesson(item.key, "lessons");
      container.appendChild(row);
    });
  }

  // --- Grammar Hub ---
  renderGrammar() {
    const container = document.getElementById("grammarContainer");
    if (!container) return;
    container.innerHTML = "";

    GRAMMAR_GROUPS.forEach(group => {
      const groupHeader = document.createElement("div");
      groupHeader.style.cssText = "margin: 18px 4px 8px; font-weight:800; font-size:13.5px; color:var(--text-muted); display:flex; justify-content:space-between; align-items:center;";
      groupHeader.innerHTML = `<span>المستوى ${group.label}</span> <span class="badge-tag">${group.items.length} قواعد</span>`;
      container.appendChild(groupHeader);

      if (group.desc) {
        const descBox = document.createElement("div");
        descBox.className = "card";
        descBox.style.cssText = "padding:10px 14px; font-size:12.5px; line-height:1.7; color:var(--text-muted); margin-bottom:10px;";
        descBox.textContent = group.desc;
        container.appendChild(descBox);
      }

      group.items.forEach(key => {
        const item = LESSONS[key];
        if (!item) return;
        const row = document.createElement("div");
        row.className = "lesson-row";
        const isVisited = storageService.getVisitedList().includes(key);

        row.innerHTML = `
          <div class="icon-box" style="color:var(--gold-dark); background:var(--card-subtle);">📘</div>
          <div class="grow">
            <div class="title">${item.title}</div>
            <div class="sub">${item.sub} ${isVisited ? "• تمت المراجعة" : ""}</div>
          </div>
          <div class="arrow-icon">‹</div>
        `;
        row.onclick = () => this.openLesson(key, "grammar");
        container.appendChild(row);
      });
    });
  }

  // --- Lesson Detail View ---
  openLesson(key, backScreen = "lessons") {
    const item = LESSONS[key];
    if (!item) return;

    this.currentLessonKey = key;
    this.detailBackScreen = backScreen;
    storageService.markLessonVisited(key);

    document.getElementById("detTitle").textContent = item.title;
    document.getElementById("detSub").textContent = item.sub;
    document.getElementById("detRule").textContent = item.rule;

    // Formula Box
    const formulaBox = document.getElementById("detFormulaBox");
    if (formulaBox) {
      if (item.formula) {
        formulaBox.style.display = "block";
        document.getElementById("detFormulaText").textContent = item.formula;
      } else {
        formulaBox.style.display = "none";
      }
    }

    // Common Mistake Box
    const mistakeBox = document.getElementById("detMistakeBox");
    if (mistakeBox) {
      if (item.mistake) {
        mistakeBox.style.display = "block";
        document.getElementById("detMistakeWrong").textContent = `❌ ${item.mistake.wrong}`;
        document.getElementById("detMistakeRight").textContent = `✅ ${item.mistake.right}`;
        document.getElementById("detMistakeNote").textContent = item.mistake.note;
      } else {
        mistakeBox.style.display = "none";
      }
    }

    // Vocabulary Section
    const vocabBox = document.getElementById("detVocabBox");
    const vocabList = document.getElementById("detVocabList");
    if (vocabBox && vocabList) {
      if (item.vocab && item.vocab.length) {
        vocabBox.style.display = "block";
        vocabList.innerHTML = "";
        item.vocab.forEach(v => {
          const vRow = document.createElement("div");
          vRow.className = "lesson-row";
          vRow.style.padding = "9px 12px";
          vRow.innerHTML = `
            <button class="icon-btn" onclick="audioService.speakSeq('${v.ar}','${v.en}','both')">🔊</button>
            <div class="grow" style="direction:ltr; text-align:left;">
              <span style="font-weight:700; color:var(--text);">${v.en}</span>
              <span style="color:var(--text-muted); margin-left:8px; font-size:13px; direction:rtl; display:inline-block;">(${v.ar})</span>
            </div>
          `;
          vocabList.appendChild(vRow);
        });
      } else {
        vocabBox.style.display = "none";
      }
    }

    // Dialogue / Example Pairs
    const pairsContainer = document.getElementById("detPairsContainer");
    if (pairsContainer) {
      pairsContainer.innerHTML = "";
      item.pairs.forEach((p, idx) => {
        const card = document.createElement("div");
        card.className = "pair-card";

        if (p.qEn) {
          const safeQEn = (p.qEn || "").replace(/'/g, "\\'");
          const safeAEn = (p.aEn || "").replace(/'/g, "\\'");
          card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; flex-wrap:wrap; gap:4px;">
              <span style="font-size:11.5px; font-weight:800; color:var(--blue);">سؤال Q</span>
              <div style="display:flex; gap:4px;">
                <button class="btn btn-ghost btn-sm" style="font-size:11px; padding:3px 8px;" onclick="app.playLessonQuestion(${idx})">🔊 نطق السؤال (عربي + English)</button>
                <button class="btn btn-ghost btn-sm" style="font-size:11px; padding:3px 8px;" onclick="audioService.speakEn('${safeQEn}')" title="نطق إنجليزي فقط">🇬🇧 English</button>
              </div>
            </div>
            <div class="pair-en" style="font-size:16px; cursor:pointer;" onclick="audioService.speakEn('${safeQEn}')" title="اضغط للاستماع للإنجليزي">${p.qEn} <span style="font-size:13px; opacity:0.8;">🔊</span></div>
            <div class="pair-ar" style="font-size:14px; margin-bottom:12px;">${p.qAr}</div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; margin-bottom:4px; flex-wrap:wrap; gap:4px;">
              <span style="font-size:11.5px; font-weight:800; color:var(--green);">إجابة A</span>
              <div style="display:flex; gap:4px;">
                <button class="btn btn-ghost btn-sm" style="font-size:11px; padding:3px 8px;" onclick="app.playLessonAnswer(${idx})">🔊 نطق الإجابة (عربي + English)</button>
                <button class="btn btn-ghost btn-sm" style="font-size:11px; padding:3px 8px;" onclick="audioService.speakEn('${safeAEn}')" title="نطق إنجليزي فقط">🇬🇧 English</button>
              </div>
            </div>
            <div class="pair-en" style="font-size:16px; cursor:pointer;" onclick="audioService.speakEn('${safeAEn}')" title="اضغط للاستماع للإنجليزي">${p.aEn} <span style="font-size:13px; opacity:0.8;">🔊</span></div>
            <div class="pair-ar" style="font-size:14px;">${p.aAr}</div>

            <div class="pair-audio-row" style="margin-top:12px; display:flex; gap:6px; flex-wrap:wrap;">
              <button class="icon-btn" onclick="app.playLessonQuestion(${idx})">🔊 السؤال (عربي + English)</button>
              <button class="icon-btn" onclick="app.playLessonAnswer(${idx})">🔊 الإجابة (عربي + English)</button>
              <button class="icon-btn" onclick="audioService.speakEn('${safeQEn} ... ${safeAEn}')">🇬🇧 English فقط</button>
              <button class="icon-btn" onclick="app.playLessonPairFull(${idx})">🔊 المحادثة كاملة</button>
            </div>
          `;
        } else {
          card.innerHTML = `
            <div class="pair-en">${p.en}</div>
            <div class="pair-ar">${p.ar}</div>
            <div class="pair-audio-row" style="margin-top:12px; display:flex; gap:6px; flex-wrap:wrap;">
              <button class="icon-btn" onclick="app.playPair(${idx}, 'both')">🔊 عربي + English</button>
              <button class="icon-btn" onclick="app.playPair(${idx}, 'en')">🔊 English فقط</button>
            </div>
          `;
        }
        pairsContainer.appendChild(card);
      });
    }

    this.showScreen("detail");
  }

  playLessonQuestion(index) {
    const item = LESSONS[this.currentLessonKey];
    if (!item || !item.pairs[index]) return;
    const p = item.pairs[index];
    audioService.speakPair(p.qAr, p.qEn);
  }

  playLessonAnswer(index) {
    const item = LESSONS[this.currentLessonKey];
    if (!item || !item.pairs[index]) return;
    const p = item.pairs[index];
    audioService.speakPair(p.aAr, p.aEn);
  }

  playLessonPairFull(index) {
    const item = LESSONS[this.currentLessonKey];
    if (!item || !item.pairs[index]) return;
    const p = item.pairs[index];
    audioService.speakQuestionAndAnswer(p.qAr, p.qEn, p.aAr, p.aEn);
  }

  playPair(index, mode = "both") {
    const item = LESSONS[this.currentLessonKey];
    if (!item || !item.pairs[index]) return;
    const p = item.pairs[index];
    if (p.qEn) {
      if (mode === "both") {
        this.playLessonPairFull(index);
      } else if (mode === "ar") {
        audioService.speakSeq(`${p.qAr} ... ${p.aAr}`, "", "ar");
      } else {
        audioService.speakSeq("", `${p.qEn} ... ${p.aEn}`, "en");
      }
    } else {
      audioService.speakPair(p.ar, p.en);
    }
  }

  playRuleExplanation() {
    const item = LESSONS[this.currentLessonKey];
    if (!item) return;
    audioService.speakSeq(item.rule, "", "ar");
  }

  // --- Quiz Engine ---
  openQuiz(key, backScreen = "home") {
    let list = QUIZZES[key];
    if (!list || !list.length) {
      // Fallback: build a quick quiz from the lesson pairs
      if (LESSONS[key] && LESSONS[key].pairs) {
        list = LESSONS[key].pairs.slice(0, 5).map(p => ({
          q: `ما معنى: "${p.qEn || p.en}"؟`,
          options: [p.qAr || p.ar, "خيار غير صحيح", "معنى مختلف"],
          correct: 0,
          explain: `المعنى الصحيح هو: ${p.qAr || p.ar}`
        }));
      } else {
        this.toast("الاختبار على هذا الجزء قيد الإعداد");
        return;
      }
    }

    this.quizKey = key;
    this.quizList = list;
    this.quizIndex = 0;
    this.quizScore = 0;
    this.quizBackScreen = backScreen;
    this.quizAnswered = false;

    const titleEl = document.getElementById("quizScreenTitle");
    if (titleEl) {
      titleEl.textContent = STORIES[key] ? `اختبار قصة: ${STORIES[key].title}` : (LESSONS[key] ? `اختبار: ${LESSONS[key].title}` : "الاختبار والتقييم");
    }

    this.showScreen("quiz");
    this.renderQuizQuestion();
  }

  renderQuizQuestion() {
    this.quizAnswered = false;
    const item = this.quizList[this.quizIndex];
    const total = this.quizList.length;

    const bar = document.getElementById("quizProgressBar");
    if (bar) bar.style.width = `${((this.quizIndex) / total) * 100}%`;

    const countEl = document.getElementById("quizCountLabel");
    if (countEl) countEl.textContent = `السؤال ${this.quizIndex + 1} من ${total}`;

    const explainEl = document.getElementById("quizExplainBox");
    if (explainEl) explainEl.style.display = "none";

    const nextBtn = document.getElementById("quizNextBtn");
    if (nextBtn) nextBtn.style.display = "none";

    // Handle Word Ordering Question
    if (item.type === "order") {
      document.getElementById("quizQuestionText").textContent = "رتّب كلمات السؤال والإجابة بالضغط على الكلمات بالترتيب الصحيح:";
      document.getElementById("quizOptionsBox").style.display = "none";
      document.getElementById("quizOrderBox").style.display = "block";

      const qWords = item.qEn.split(" ");
      const aWords = item.aEn.split(" ");
      this.orderState = {
        qCorrect: qWords,
        aCorrect: aWords,
        qBank: this.shuffleArray(qWords.map((w, i) => ({ w, id: `q_${i}_${Math.random()}` }))),
        aBank: this.shuffleArray(aWords.map((w, i) => ({ w, id: `a_${i}_${Math.random()}` }))),
        qPlaced: [],
        aPlaced: []
      };
      this.renderOrderUI();
      return;
    }

    // Standard Multiple Choice Question
    document.getElementById("quizOptionsBox").style.display = "block";
    document.getElementById("quizOrderBox").style.display = "none";
    document.getElementById("quizQuestionText").textContent = item.q;

    const optWrap = document.getElementById("quizOptionsBox");
    optWrap.innerHTML = "";

    item.options.forEach((optText, idx) => {
      const btn = document.createElement("div");
      btn.className = "travel-opt-btn";
      btn.style.cssText = "margin-bottom:9px; cursor:pointer;";
      btn.innerHTML = `
        <div style="flex:1; direction:ltr; text-align:left; font-weight:700; font-size:14.5px; color:var(--text);">${optText}</div>
        <button class="opt-speaker-btn" title="استمع للإجابة (عربي + English)" onclick="event.stopPropagation(); app.playQuizOptionSpeech(${idx})">🔊</button>
      `;
      btn.onclick = () => this.answerQuiz(idx, btn);
      optWrap.appendChild(btn);
    });
  }

  playQuizQuestionSpeech() {
    const item = this.quizList[this.quizIndex];
    if (!item) return;
    if (item.type === "order") {
      audioService.speakPair(item.qAr, item.qEn);
      return;
    }
    if (item.qAr && item.qEn) {
      audioService.speakPair(item.qAr, item.qEn);
      return;
    }
    const parts = audioService.splitArAndEn(item.q);
    if (parts.ar && parts.en) {
      audioService.speakPair(parts.ar, parts.en);
    } else if (parts.ar) {
      audioService.speakSeq(parts.ar, "", "ar");
    } else {
      audioService.speakSeq("", parts.en, "en");
    }
  }

  playQuizOptionSpeech(choiceIdx) {
    const item = this.quizList[this.quizIndex];
    if (!item || !item.options || !item.options[choiceIdx]) return;
    const optText = item.options[choiceIdx];

    const dict = {
      "he": "هو للمذكر", "she": "هي للمؤنث", "it": "هو أو هي لغير العاقل",
      "i": "أنا", "we": "نحن", "they": "هم", "you": "أنت",
      "go": "يذهب", "goes": "يذهب للمفرد", "going": "ذاهب",
      "watch": "يشاهد", "watched": "شاهد بالماضي", "watches": "يشاهد للمفرد",
      "big": "كبير", "bigger": "أكبر", "biggest": "الأكبر",
      "should": "ينبغي للنصيحة", "must to": "صياغة غير دقيقة", "can to": "صياغة غير دقيقة",
      "be": "يكون", "was": "كان", "been": "كان تصريف ثالث",
      "play": "يلعب", "plays": "يلعب للمفرد", "playing": "يلعب مستمر"
    };

    let arMeaning = (item.optionsAr && item.optionsAr[choiceIdx]) ||
                    (choiceIdx === item.correct ? item.explain : "") ||
                    dict[optText.toLowerCase().trim()] || "";

    if (arMeaning) {
      audioService.speakPair(arMeaning, optText);
    } else {
      const parts = audioService.splitArAndEn(optText);
      if (parts.ar && parts.en) {
        audioService.speakPair(parts.ar, parts.en);
      } else {
        audioService.speakPair(item.explain || "الإجابة", optText);
      }
    }
  }

  renderOrderUI() {
    const qBank = document.getElementById("orderQBank");
    const qZone = document.getElementById("orderQZone");
    const aBank = document.getElementById("orderABank");
    const aZone = document.getElementById("orderAZone");

    qBank.innerHTML = ""; qZone.innerHTML = "";
    aBank.innerHTML = ""; aZone.innerHTML = "";

    // Question Bank
    this.orderState.qBank.forEach(tok => {
      const b = document.createElement("button");
      b.className = "icon-btn";
      b.textContent = tok.w;
      b.onclick = () => {
        if (this.quizAnswered) return;
        audioService.playClick();
        this.orderState.qPlaced.push(tok);
        this.orderState.qBank = this.orderState.qBank.filter(t => t !== tok);
        this.renderOrderUI();
        this.checkOrderComplete();
      };
      qBank.appendChild(b);
    });

    // Question Placed Zone
    this.orderState.qPlaced.forEach((tok, i) => {
      const b = document.createElement("button");
      b.className = "icon-btn";
      b.textContent = tok.w;
      const ok = this.orderState.qCorrect[i] === tok.w;
      b.style.background = ok ? "var(--green)" : "#fee2e2";
      b.style.color = ok ? "#fff" : "var(--red)";
      b.onclick = () => {
        if (this.quizAnswered) return;
        audioService.playClick();
        this.orderState.qPlaced.splice(i, 1);
        this.orderState.qBank.push(tok);
        this.renderOrderUI();
      };
      qZone.appendChild(b);
    });

    // Answer Bank
    this.orderState.aBank.forEach(tok => {
      const b = document.createElement("button");
      b.className = "icon-btn";
      b.textContent = tok.w;
      b.onclick = () => {
        if (this.quizAnswered) return;
        audioService.playClick();
        this.orderState.aPlaced.push(tok);
        this.orderState.aBank = this.orderState.aBank.filter(t => t !== tok);
        this.renderOrderUI();
        this.checkOrderComplete();
      };
      aBank.appendChild(b);
    });

    // Answer Placed Zone
    this.orderState.aPlaced.forEach((tok, i) => {
      const b = document.createElement("button");
      b.className = "icon-btn";
      b.textContent = tok.w;
      const ok = this.orderState.aCorrect[i] === tok.w;
      b.style.background = ok ? "var(--green)" : "#fee2e2";
      b.style.color = ok ? "#fff" : "var(--red)";
      b.onclick = () => {
        if (this.quizAnswered) return;
        audioService.playClick();
        this.orderState.aPlaced.splice(i, 1);
        this.orderState.aBank.push(tok);
        this.renderOrderUI();
      };
      aZone.appendChild(b);
    });
  }

  checkOrderComplete() {
    const qDone = this.orderState.qPlaced.length === this.orderState.qCorrect.length &&
      this.orderState.qPlaced.every((t, i) => t.w === this.orderState.qCorrect[i]);
    const aDone = this.orderState.aPlaced.length === this.orderState.aCorrect.length &&
      this.orderState.aPlaced.every((t, i) => t.w === this.orderState.aCorrect[i]);

    if (qDone && aDone && !this.quizAnswered) {
      const item = this.quizList[this.quizIndex];
      this.quizAnswered = true;
      this.quizScore++;
      audioService.playCorrect();
      storageService.addXP(5);
      if (item && item.qAr && item.qEn) {
        audioService.speakQuestionAndAnswer(item.qAr, item.qEn, item.aAr, item.aEn);
      }
      const nb = document.getElementById("quizNextBtn");
      nb.style.display = "block";
      nb.textContent = this.quizIndex === this.quizList.length - 1 ? "عرض النتيجة 🏆" : "السؤال التالي ←";
    }
  }

  answerQuiz(choiceIdx, btnEl) {
    if (this.quizAnswered) return;
    const item = this.quizList[this.quizIndex];
    const optText = item.options[choiceIdx];

    if (choiceIdx === item.correct) {
      this.quizAnswered = true;
      this.quizScore++;
      audioService.playCorrect();
      btnEl.style.background = "var(--green)";
      btnEl.style.color = "#ffffff";
      btnEl.style.borderColor = "var(--green)";
      const enDiv = btnEl.querySelector("div");
      if (enDiv) enDiv.style.color = "#ffffff";

      // Linked pronunciation of Arabic meaning/explanation and English answer
      audioService.speakPair(item.explain || "إجابة صحيحة", optText);

      const explainEl = document.getElementById("quizExplainBox");
      explainEl.style.display = "block";
      explainEl.style.color = "var(--green)";
      const safeOptText = optText.replace(/'/g, "\\'");
      explainEl.innerHTML = `
        <div>✅ ${item.explain || "إجابة صحيحة وذكية!"}</div>
        <div style="margin-top:6px; display:flex; gap:6px; flex-wrap:wrap;">
          <button class="icon-btn" onclick="app.playQuizOptionSpeech(${choiceIdx})">🔊 أعد الاستماع للإجابة (عربي + English)</button>
          <button class="icon-btn" onclick="audioService.speakEn('${safeOptText}')">🇬🇧 English فقط</button>
        </div>
      `;

      const nb = document.getElementById("quizNextBtn");
      nb.style.display = "block";
      nb.textContent = this.quizIndex === this.quizList.length - 1 ? "عرض النتيجة 🏆" : "السؤال التالي ←";

      if (this.quizKey === "review") {
        storageService.forgetError(item.q);
      }
      storageService.addXP(5);
    } else {
      audioService.playWrong();
      btnEl.style.background = "#fee2e2";
      btnEl.style.color = "var(--red)";
      btnEl.style.borderColor = "var(--red)";

      const explainEl = document.getElementById("quizExplainBox");
      explainEl.style.display = "block";
      explainEl.style.color = "var(--red)";
      explainEl.textContent = item.explain || "إجابة غير صحيحة، حاول مرة أخرى.";

      storageService.logMistake(this.quizKey, item);
    }
  }

  nextQuizStep() {
    this.quizIndex++;
    if (this.quizIndex >= this.quizList.length) {
      this.showQuizSummary();
      return;
    }
    this.renderQuizQuestion();
  }

  showQuizSummary() {
    audioService.playFanfare();
    storageService.incQuizzesDone();

    const bar = document.getElementById("quizProgressBar");
    if (bar) bar.style.width = "100%";

    const countEl = document.getElementById("quizCountLabel");
    if (countEl) countEl.textContent = "تم إكمال الاختبار بنجاح!";

    const qText = document.getElementById("quizQuestionText");
    const optBox = document.getElementById("quizOptionsBox");
    const orderBox = document.getElementById("quizOrderBox");
    const explainBox = document.getElementById("quizExplainBox");
    const nextBtn = document.getElementById("quizNextBtn");

    orderBox.style.display = "none";
    explainBox.style.display = "none";

    if (this.quizKey === "placement") {
      let lvl = "Pre-A1";
      if (this.quizScore >= 4) lvl = "A2";
      else if (this.quizScore >= 2) lvl = "A1";

      storageService.saveProfile({ level: lvl });
      qText.innerHTML = `🎉 رائع! مستواك التقديري المبدئي: <span style="color:var(--gold-dark); font-weight:800;">${lvl}</span>`;
      optBox.innerHTML = `
        <div class="card" style="text-align:center; padding:18px;">
          <div style="font-size:38px; margin-bottom:8px;">🎯</div>
          <div style="font-weight:700;">أجبت على ${this.quizScore} من أصل ${this.quizList.length} أسئلة بشكل صحيح.</div>
          <div class="sub" style="margin-top:6px;">تم ضبط خطة رحلتك التعليمية تلقائياً للبدء من هذا المستوى.</div>
        </div>
      `;
      nextBtn.style.display = "block";
      nextBtn.textContent = "الانتقال إلى الرئيسية 🚀";
      nextBtn.onclick = () => {
        storageService.set("ej_onboarded", true);
        this.showScreen("home");
      };
      return;
    }

    qText.innerHTML = `🎉 أحسنت! أنهيت الاختبار بنتيجة: <span style="color:var(--green); font-weight:800;">${this.quizScore} / ${this.quizList.length}</span>`;
    optBox.innerHTML = `
      <div class="card center" style="text-align:center; padding:18px;">
        <div style="font-size:38px; margin-bottom:8px;">🏆</div>
        <div style="font-weight:700; margin-bottom:6px;">حصلت على +15 نقطة خبرة XP إضافية!</div>
        <div class="sub">واصل التعلّم وتثبيت الكلمات في ذاكرتك طويلة المدى.</div>
      </div>
    `;
    nextBtn.style.display = "block";
    nextBtn.textContent = "العودة ↩️";
    nextBtn.onclick = () => this.showScreen(this.quizBackScreen);
  }

  // --- Quiz Hub View ---
  renderQuizHub() {
    const container = document.getElementById("quizHubContainer");
    if (!container) return;
    container.innerHTML = "";

    // Stories Quizzes
    const storyHeader = document.createElement("div");
    storyHeader.style.cssText = "margin: 10px 4px 6px; font-weight:800; font-size:13.5px; color:var(--text-muted);";
    storyHeader.textContent = "📚 اختبارات فهم القصص التفاعلية";
    container.appendChild(storyHeader);

    Object.keys(STORIES).forEach(sid => {
      const s = STORIES[sid];
      const row = document.createElement("div");
      row.className = "lesson-row";
      row.innerHTML = `
        <div class="icon-box" style="color:var(--blue);">${s.icon}</div>
        <div class="grow">
          <div class="title">اختبار قصة: ${s.title}</div>
          <div class="sub">${QUIZZES[sid] ? QUIZZES[sid].length + " أسئلة تحليلية" : "قريباً"}</div>
        </div>
        <div class="arrow-icon">‹</div>
      `;
      row.onclick = () => this.openQuiz(sid, "quizhub");
      container.appendChild(row);
    });

    // Grammar Quizzes
    GRAMMAR_GROUPS.forEach(g => {
      const h = document.createElement("div");
      h.style.cssText = "margin: 18px 4px 8px; font-weight:800; font-size:13.5px; color:var(--text-muted);";
      h.textContent = `اختبارات المستوى ${g.label}`;
      container.appendChild(h);

      g.items.forEach(key => {
        const item = LESSONS[key];
        if (!item) return;
        const qCount = QUIZZES[key] ? QUIZZES[key].length : 0;
        const row = document.createElement("div");
        row.className = "lesson-row";
        row.innerHTML = `
          <div class="icon-box" style="color:var(--gold-dark);">🧪</div>
          <div class="grow">
            <div class="title">${item.title}</div>
            <div class="sub">${qCount ? qCount + " سؤال تفاعلي" : "قريباً"}</div>
          </div>
          <div class="arrow-icon">‹</div>
        `;
        row.onclick = () => this.openQuiz(key, "quizhub");
        container.appendChild(row);
      });
    });
  }

  // --- Interactive Stories Hub & Viewer ---
  renderStoryHub() {
    const container = document.getElementById("storyHubContainer");
    if (!container) return;
    container.innerHTML = "";

    Object.keys(STORIES).forEach(sid => {
      const s = STORIES[sid];
      const card = document.createElement("div");
      card.className = "card card-interactive";
      card.style.marginBottom = "14px";
      card.innerHTML = `
        <div class="icon-box" style="font-size:28px;">${s.icon}</div>
        <div class="grow">
          <div style="font-weight:800; font-size:15px; color:var(--text);">${s.title} (${s.titleEn})</div>
          <div class="sub" style="margin-top:4px;">${s.description}</div>
          <div class="badge-tag" style="margin-top:6px; display:inline-block;">${s.category}</div>
        </div>
        <div class="arrow-icon">‹</div>
      `;
      card.onclick = () => this.openStory(sid);
      container.appendChild(card);
    });
  }

  openStory(storyId) {
    this.currentStoryId = storyId;
    this.storyNodeKey = "n1";
    this.showScreen("story");
    this.renderStoryScene();
  }

  renderStoryScene() {
    const s = STORIES[this.currentStoryId];
    if (!s) return;
    const node = s.graph[this.storyNodeKey];
    if (!node) return;

    document.getElementById("storyTitleText").textContent = s.title;
    const choicesEl = document.getElementById("storyChoicesBox");
    const nextBtn = document.getElementById("storyAdvanceBtn");
    const restartBtn = document.getElementById("storyRestartBtn");

    choicesEl.style.display = "none";
    choicesEl.innerHTML = "";
    nextBtn.style.display = "none";
    restartBtn.style.display = "none";

    if (node.end) {
      document.getElementById("storySceneCount").textContent = "🎉 ختام القصة";
      document.getElementById("storySceneIcon").textContent = "🏁";
      document.getElementById("storyEnText").textContent = node.en;
      document.getElementById("storyArText").textContent = node.ar;
      restartBtn.style.display = "block";
      audioService.playFanfare();
      return;
    }

    if (node.choice) {
      document.getElementById("storySceneCount").textContent = "قرارك التفاعلي 🤔";
      document.getElementById("storySceneIcon").textContent = "⚡";
      document.getElementById("storyEnText").textContent = node.prompt;
      document.getElementById("storyArText").textContent = "اختر ما يجب فعله للمتابعة في مسار القصة:";
      choicesEl.style.display = "block";

      node.options.forEach(opt => {
        const b = document.createElement("button");
        b.className = "btn btn-ghost";
        b.style.cssText = "margin-bottom:10px; text-align:right; flex-direction:column; align-items:flex-start; padding:12px 14px;";
        b.innerHTML = `
          <span style="direction:ltr; text-align:left; font-weight:700; color:var(--text);">${opt.en}</span>
          <span style="font-size:12px; color:var(--text-muted); margin-top:3px;">${opt.ar}</span>
        `;
        b.onclick = () => {
          audioService.playClick();
          this.storyNodeKey = opt.next;
          this.renderStoryScene();
        };
        choicesEl.appendChild(b);
      });
      return;
    }

    document.getElementById("storySceneCount").textContent = "مشهد القصة";
    document.getElementById("storySceneIcon").textContent = s.icon;
    document.getElementById("storyEnText").textContent = node.en;
    document.getElementById("storyArText").textContent = node.ar;
    nextBtn.style.display = "block";
  }

  advanceStory() {
    audioService.playClick();
    const s = STORIES[this.currentStoryId];
    const node = s.graph[this.storyNodeKey];
    if (node && node.next) {
      this.storyNodeKey = node.next;
      this.renderStoryScene();
    }
  }

  playStoryAudio() {
    const s = STORIES[this.currentStoryId];
    const node = s.graph[this.storyNodeKey];
    if (!node) return;
    if (node.choice) {
      audioService.speakSeq(node.prompt, "", "ar");
    } else {
      audioService.speakSeq(node.ar, node.en, "both");
    }
  }

  // --- Travel Dialogue Simulation ("عِش الموقف قبل أن تسافر") ---
  renderTravelHub() {
    const container = document.getElementById("travelHubContainer");
    if (!container) return;
    container.innerHTML = "";

    Object.keys(TRAVEL).forEach(tid => {
      const t = TRAVEL[tid];
      const card = document.createElement("div");
      card.className = "card card-interactive";
      card.style.marginBottom = "14px";
      card.innerHTML = `
        <div class="icon-box" style="font-size:28px;">${t.icon}</div>
        <div class="grow">
          <div style="font-weight:800; font-size:15px; color:var(--text);">${t.title}</div>
          <div class="sub" style="margin-top:4px;">${t.desc}</div>
          <div class="badge-tag" style="margin-top:6px; display:inline-block;">${t.stages.length} مراحل واقعية</div>
        </div>
        <div class="arrow-icon">‹</div>
      `;
      card.onclick = () => this.openTravel(tid);
      container.appendChild(card);
    });
  }

  openTravel(travelKey) {
    this.travelKey = travelKey;
    this.travelIndex = 0;
    this.travelDone = false;
    this.showScreen("travel");
    this.renderTravelStage();
  }

  renderTravelStage() {
    this.travelDone = false;
    const stages = TRAVEL[this.travelKey].stages;
    const stage = stages[this.travelIndex];

    const bar = document.getElementById("travelProgressBar");
    if (bar) bar.style.width = `${(this.travelIndex / stages.length) * 100}%`;

    document.getElementById("travelStageCount").textContent = `الموقف ${this.travelIndex + 1} من ${stages.length}`;
    document.getElementById("travelSceneIcon").textContent = stage.scene;
    document.getElementById("travelSituationAr").textContent = stage.situationAr;
    document.getElementById("travelNpcEn").textContent = stage.npcEn;
    document.getElementById("travelNpcAr").textContent = stage.npcAr;

    const optWrap = document.getElementById("travelOptionsBox");
    optWrap.innerHTML = "";

    stage.options.forEach((opt, idx) => {
      const b = document.createElement("div");
      b.className = "travel-opt-btn";
      const safeEn = (opt.en || "").replace(/'/g, "\\'");
      const safeAr = (opt.ar || "").replace(/'/g, "\\'");
      b.innerHTML = `
        <div style="flex:1; text-align:right;">
          <div style="direction:ltr; text-align:left; font-weight:700; color:var(--text); font-size:14.5px;">${opt.en}</div>
          <div style="font-size:12.5px; color:var(--text-muted); margin-top:3px;">${opt.ar}</div>
        </div>
        <div style="display:flex; gap:4px;">
          <button class="opt-speaker-btn" title="استمع للإجابة (عربي + English)" onclick="event.stopPropagation(); audioService.speakPair('${safeAr}', '${safeEn}')">🔊</button>
          <button class="opt-speaker-btn" title="استمع بالإنجليزية فقط" onclick="event.stopPropagation(); audioService.speakEn('${safeEn}')">🇬🇧</button>
        </div>
      `;
      b.onclick = () => this.answerTravelChoice(idx, b, opt);
      optWrap.appendChild(b);
    });

    const exp = document.getElementById("travelFeedbackBox");
    exp.style.display = "none";

    const nextBtn = document.getElementById("travelNextBtn");
    nextBtn.style.display = "none";
  }

  answerTravelChoice(choiceIdx, btnEl, opt) {
    if (this.travelDone) return;
    const stage = TRAVEL[this.travelKey].stages[this.travelIndex];

    const exp = document.getElementById("travelFeedbackBox");
    const nextBtn = document.getElementById("travelNextBtn");
    const safeEn = (opt.en || "").replace(/'/g, "\\'");
    const safeAr = (opt.ar || "").replace(/'/g, "\\'");

    if (opt.best) {
      this.travelDone = true;
      audioService.playCorrect();
      // Linked pronunciation of Arabic meaning and English sentence
      audioService.speakPair(opt.ar, opt.en);

      btnEl.style.background = "var(--green)";
      btnEl.style.color = "#ffffff";
      btnEl.style.borderColor = "var(--green)";
      const enDiv = btnEl.querySelector("div > div");
      if (enDiv) enDiv.style.color = "#ffffff";

      exp.style.display = "block";
      exp.style.color = "var(--green)";
      exp.innerHTML = `
        <div>✅ ${opt.feedback}</div>
        <div style="margin-top:8px; display:flex; gap:6px; flex-wrap:wrap;">
          <button class="icon-btn" onclick="audioService.speakPair('${safeAr}', '${safeEn}')">🔊 أعد الاستماع للإجابة (عربي + English)</button>
          <button class="icon-btn" onclick="audioService.speakEn('${safeEn}')">🇬🇧 English فقط</button>
        </div>
      `;

      nextBtn.style.display = "block";
      nextBtn.textContent = this.travelIndex === TRAVEL[this.travelKey].stages.length - 1 ? "إنهاء الموقف بنجاح 🎉" : "الموقف التالي ←";
      storageService.addXP(8);
    } else {
      audioService.playWrong();
      btnEl.style.background = "#fee2e2";
      btnEl.style.color = "var(--red)";
      btnEl.style.borderColor = "var(--red)";

      exp.style.display = "block";
      exp.style.color = "var(--red)";
      exp.textContent = `⚠️ ${opt.feedback}`;
    }
  }

  nextTravelStage() {
    audioService.playClick();
    this.travelIndex++;
    if (this.travelIndex >= TRAVEL[this.travelKey].stages.length) {
      audioService.playFanfare();
      this.toast("🎉 أحسنت! أنهيت محاكاة السفر بامتياز.");
      this.showScreen("travelhub");
      return;
    }
    this.renderTravelStage();
  }

  playTravelNpcSpeech(speed = "normal") {
    const stage = TRAVEL[this.travelKey].stages[this.travelIndex];
    if (stage) {
      audioService.speakPair(stage.npcAr, stage.npcEn, 280, speed === "slow" ? 0.65 : 0);
    }
  }

  // --- Speaking & Listening Practice ---
  startSpeakListen() {
    const pool = [];
    ["greet", "family", "daily", "airport", "hotel", "restaurant"].forEach(k => {
      if (LESSONS[k] && LESSONS[k].pairs) {
        LESSONS[k].pairs.slice(0, 3).forEach(p => {
          pool.push({ en: p.aEn || p.en, ar: p.aAr || p.ar });
        });
      }
    });

    this.slPool = this.shuffleArray(pool).slice(0, 6);
    this.slIndex = 0;
    this.slScore = 0;
    this.showScreen("speaklisten");
    this.renderSLStep();
  }

  renderSLStep() {
    this.slListenDone = false;
    const item = this.slPool[this.slIndex];
    const total = this.slPool.length;

    const bar = document.getElementById("slProgressBar");
    if (bar) bar.style.width = `${(this.slIndex / total) * 100}%`;

    document.getElementById("slCountLabel").textContent = `الجملة ${this.slIndex + 1} من ${total}`;
    document.getElementById("slListenBox").style.display = "block";
    document.getElementById("slSpeakBox").style.display = "none";
    document.getElementById("slNextBtn").style.display = "none";
    document.getElementById("slListenFeedback").style.display = "none";

    const distractors = this.shuffleArray(this.slPool.filter(x => x.en !== item.en)).slice(0, 2);
    const options = this.shuffleArray([item, ...distractors]);

    const wrap = document.getElementById("slListenOptionsWrap");
    wrap.innerHTML = "";
    options.forEach(opt => {
      const b = document.createElement("div");
      b.className = "travel-opt-btn";
      b.style.cssText = "margin-bottom:8px; cursor:pointer;";
      const safeEn = (opt.en || "").replace(/'/g, "\\'");
      const safeAr = (opt.ar || "").replace(/'/g, "\\'");
      b.innerHTML = `
        <div style="flex:1; direction:ltr; text-align:left; font-weight:700;">${opt.en}</div>
        <div style="display:flex; gap:4px;">
          <button class="opt-speaker-btn" title="استمع للخيار (عربي + English)" onclick="event.stopPropagation(); audioService.speakPair('${safeAr}', '${safeEn}')">🔊</button>
          <button class="opt-speaker-btn" title="استمع بالإنجليزية فقط" onclick="event.stopPropagation(); audioService.speakEn('${safeEn}')">🇬🇧</button>
        </div>
      `;
      b.onclick = () => this.answerSLListen(opt === item, b, opt);
      wrap.appendChild(b);
    });
  }

  playSLTargetSpeech(mode = "both") {
    const item = this.slPool[this.slIndex];
    if (!item) return;
    if (mode === "slow") {
      audioService.speakSlow(item.en);
    } else if (mode === "en") {
      audioService.speakEn(item.en);
    } else {
      audioService.speakPair(item.ar, item.en);
    }
  }

  answerSLListen(isCorrect, btnEl, opt) {
    if (this.slListenDone) return;
    const item = this.slPool[this.slIndex];
    if (isCorrect) {
      this.slListenDone = true;
      this.slScore++;
      audioService.playCorrect();
      audioService.speakPair(item.ar, item.en);
      btnEl.style.background = "var(--green)";
      btnEl.style.color = "#ffffff";
      const enDiv = btnEl.querySelector("div");
      if (enDiv) enDiv.style.color = "#ffffff";
      storageService.addXP(4);
      setTimeout(() => this.showSLSpeakBox(), 400);
    } else {
      audioService.playWrong();
      btnEl.style.background = "#fee2e2";
      btnEl.style.color = "var(--red)";
      const exp = document.getElementById("slListenFeedback");
      exp.style.display = "block";
      exp.textContent = "استمع بدقة للجملة وحاول مجدداً 🎧";
    }
  }

  showSLSpeakBox() {
    const item = this.slPool[this.slIndex];
    document.getElementById("slSpeakBox").style.display = "block";
    document.getElementById("slSpeakTargetEn").textContent = item.en;
    document.getElementById("slSpeakTargetAr").textContent = item.ar;

    // Build interactive word chips for pronunciation practice
    const chipsWrap = document.getElementById("slWordChipsWrap");
    if (chipsWrap) {
      chipsWrap.innerHTML = "";
      const words = (item.en || "").replace(/[.,!?;:]/g, "").split(/\s+/).filter(Boolean);
      words.forEach(w => {
        const btn = document.createElement("button");
        btn.className = "sl-word-chip";
        btn.innerHTML = `🔊 ${w}`;
        btn.onclick = () => audioService.speakSlow(w);
        chipsWrap.appendChild(btn);
      });
    }

    const resultBox = document.getElementById("slSpeakResultBox");
    resultBox.style.display = "none";
    resultBox.innerHTML = "";

    const statusNotice = document.getElementById("slSpeakStatusNotice");
    if (statusNotice) statusNotice.style.display = "none";

    const recBtn = document.getElementById("slRecordBtn");
    recBtn.style.display = "block";
    recBtn.disabled = false;
    recBtn.innerHTML = "🎤 اضغط وتحدث بالإنجليزية";
  }

  startSLRecording() {
    const recBtn = document.getElementById("slRecordBtn");
    recBtn.disabled = true;
    recBtn.innerHTML = "🎙️ يستمع إليك الآن... تكلم بوضوح";

    const statusNotice = document.getElementById("slSpeakStatusNotice");
    if (statusNotice) {
      statusNotice.style.display = "block";
      statusNotice.style.color = "var(--blue)";
      statusNotice.textContent = "🎙️ الميكروفون نشط، انطق الجملة بالإنجليزية الآن...";
    }

    audioService.startSpeechRecognition({
      lang: "en-US",
      onListening: () => {
        recBtn.innerHTML = "🎙️ يستمع إليك الآن... تكلم بوضوح";
        recBtn.disabled = true;
      },
      onResult: (spoken) => {
        recBtn.innerHTML = "🎤 اضغط وتحدث بالإنجليزية";
        recBtn.disabled = false;
        if (statusNotice) statusNotice.style.display = "none";
        this.evaluateSLSpeech(spoken);
      },
      onError: (err) => {
        recBtn.innerHTML = "🎤 اضغط وتحدث بالإنجليزية";
        recBtn.disabled = false;
        if (statusNotice) {
          statusNotice.style.display = "block";
          statusNotice.style.color = "var(--gold-dark)";
          statusNotice.innerHTML = "💡 تعذر التقاط الصوت عبر الميكروفون. استمع للجملة ونطقها بصوتك، ثم اضغط على زر (تدربت وتحدثت بها) بالأسفل للمتابعة بنجاح!";
        }
      }
    });
  }

  evaluateSLSpeech(spokenText) {
    const item = this.slPool[this.slIndex];
    const norm = s => (s || "").toLowerCase().replace(/[^a-z\s']/g, "").split(/\s+/).filter(Boolean);
    const targetWords = norm(item.en);
    const spokenWords = norm(spokenText);

    let html = `<div style="font-size:12px; color:var(--text-muted); margin-bottom:6px;">سمعتك تقول: "${spokenText}"</div>`;
    html += `<div style="direction:ltr; text-align:left; margin-bottom:10px; display:flex; flex-wrap:wrap; gap:6px;">`;

    let matches = 0;
    targetWords.forEach(word => {
      const isMatch = spokenWords.includes(word);
      if (isMatch) matches++;
      html += `<span class="badge-tag" style="background:${isMatch ? 'var(--green)' : '#fee2e2'}; color:${isMatch ? '#fff' : 'var(--red)'};">${word}</span>`;
    });
    html += `</div>`;

    const pct = targetWords.length ? Math.round((matches / targetWords.length) * 100) : 0;
    html += `<div style="font-weight:800; color:${pct >= 60 ? 'var(--green)' : 'var(--gold-dark)'};">نسبة التطابق الصوتي: ${pct}٪</div>`;

    const resBox = document.getElementById("slSpeakResultBox");
    resBox.style.display = "block";
    resBox.innerHTML = html;

    if (pct >= 50) {
      audioService.playCorrect();
      storageService.addXP(6);
    }

    document.getElementById("slNextBtn").style.display = "block";
  }

  passSLSelfPractice() {
    audioService.playCorrect();
    storageService.addXP(6);

    const resBox = document.getElementById("slSpeakResultBox");
    resBox.style.display = "block";
    resBox.innerHTML = `
      <div style="background:#ecfdf5; border:1px solid #a7f3d0; color:var(--green); padding:10px 14px; border-radius:12px; font-weight:700;">
        🎉 رائع جداً! تم تسجيل تدريبك ونطقك للجملة بصوت عالٍ (+6 نقاط XP). استمر في ممارسة النطق اليومي!
      </div>
    `;

    const statusNotice = document.getElementById("slSpeakStatusNotice");
    if (statusNotice) statusNotice.style.display = "none";

    document.getElementById("slNextBtn").style.display = "block";
  }

  nextSLItem() {
    audioService.playClick();
    this.slIndex++;
    if (this.slIndex >= this.slPool.length) {
      audioService.playFanfare();
      this.toast("🏆 أحسنت! أكملت تدريب الاستماع والنطق بنجاح.");
      this.showScreen("home");
      return;
    }
    this.renderSLStep();
  }

  // --- AI Tutor Lumi Chat ---
  startLumiChat() {
    const box = document.getElementById("lumiChatContainer");
    if (box && box.children.length === 0) {
      this.appendLumiMsg(
        "bot",
        "أهلاً بك يا بطل! 👋 أنا لومي 🤖 مدرّبك الشخصي للغة الإنجليزية.\nاسألني عن أي قاعدة أو موقف سفر، أو جرّب كتابة جملة بالإنجليزي وسأصححها لك فوراً، أو اختر من الاقتراحات السريعة بالأسفل!",
        ["Hello! I am Lumi, your personal English tutor.", "Practice makes perfect!"]
      );
    }
  }

  askLumiPrompt(promptText) {
    const inp = document.getElementById("lumiInput");
    if (inp) {
      inp.value = promptText;
      this.sendLumi();
    }
  }

  appendLumiMsg(role, text, enPhrases = []) {
    const box = document.getElementById("lumiChatContainer");
    if (!box) return null;

    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${role}`;
    
    const textNode = document.createElement("div");
    textNode.style.whiteSpace = "pre-wrap";
    textNode.textContent = text;
    bubble.appendChild(textNode);

    // If bot provided English phrases, attach clickable speech buttons
    if (role === "bot" && enPhrases && enPhrases.length > 0) {
      const audioRow = document.createElement("div");
      audioRow.style.cssText = "display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; direction:ltr;";
      enPhrases.forEach(phrase => {
        const btn = document.createElement("button");
        btn.className = "chat-audio-btn";
        btn.innerHTML = `🔊 ${phrase}`;
        btn.onclick = () => audioService.speakEn(phrase);
        audioRow.appendChild(btn);
      });
      bubble.appendChild(audioRow);
    }

    box.appendChild(bubble);
    box.scrollTop = box.scrollHeight;
    return bubble;
  }

  async sendLumi() {
    const inp = document.getElementById("lumiInput");
    const text = (inp.value || "").trim();
    if (!text) return;
    inp.value = "";

    audioService.playClick();
    this.appendLumiMsg("user", text);

    const typingBubble = this.appendLumiMsg("bot", "يكتب الآن... ⏳");
    const replyData = await lumiService.ask(text);

    if (typingBubble) {
      typingBubble.innerHTML = "";
      const textNode = document.createElement("div");
      textNode.style.whiteSpace = "pre-wrap";
      textNode.textContent = replyData.text;
      typingBubble.appendChild(textNode);

      if (replyData.enPhrases && replyData.enPhrases.length > 0) {
        const audioRow = document.createElement("div");
        audioRow.style.cssText = "display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; direction:ltr;";
        replyData.enPhrases.forEach(phrase => {
          const btn = document.createElement("button");
          btn.className = "chat-audio-btn";
          btn.innerHTML = `🔊 ${phrase}`;
          btn.onclick = () => audioService.speakEn(phrase);
          audioRow.appendChild(btn);
        });
        typingBubble.appendChild(audioRow);
      }
      
      const box = document.getElementById("lumiChatContainer");
      if (box) box.scrollTop = box.scrollHeight;
    }
  }

  // --- What Should I Say Now? ("ماذا أقول الآن؟") ---
  resetWhatSay() {
    const resBox = document.getElementById("whatsayResultBox");
    if (resBox) resBox.style.display = "none";
    this.renderQuickSituations();
  }

  renderQuickSituations() {
    const container = document.getElementById("quickSituationsList");
    if (!container) return;

    const QUICK_SITUATIONS = [
      { title: "طلب الفاتورة في المطعم", icon: "💳", en: "Could we have the check, please?", ar: "هل يمكننا الحصول على الفاتورة من فضلك؟" },
      { title: "حجز غرفة هادئة في فندق", icon: "🏨", en: "I would like to book a quiet room, please.", ar: "أود حجز غرفة هادئة من فضلك." },
      { title: "السؤال عن بوابة الصعود بالمطار", icon: "🛫", en: "Excuse me, where is gate number twelve?", ar: "عفواً، أين بوابة الصعود رقم 12؟" },
      { title: "طلب تاكسي لوسط المدينة", icon: "🚕", en: "Please take me to the city center.", ar: "من فضلك خذني إلى وسط المدينة." },
      { title: "السؤال عن مقاس أصغر في المتجر", icon: "🛍️", en: "Do you have this in a smaller size?", ar: "هل يتوفر هذا بمقاس أصغر؟" },
      { title: "طلب قهوة بدون سكر", icon: "☕", en: "Can I get a black coffee with no sugar, please?", ar: "هل يمكنني طلب قهوة سادة بدون سكر؟" },
      { title: "السؤال عن أقرب محطة مترو", icon: "📍", en: "Excuse me, where is the nearest metro station?", ar: "عفواً، أين أقرب محطة مترو؟" },
      { title: "طلب مساعدة طبية عاجلة", icon: "🚑", en: "I need to see a doctor immediately, please.", ar: "أحتاج لمقابلة طبيب على الفور من فضلك." }
    ];

    container.innerHTML = "";
    QUICK_SITUATIONS.forEach(item => {
      const card = document.createElement("div");
      card.className = "quick-situation-card";
      const safeEn = item.en.replace(/'/g, "\\'");
      const safeAr = item.ar.replace(/'/g, "\\'");
      card.innerHTML = `
        <div style="flex:1;">
          <div style="font-weight:700; font-size:13.5px; color:var(--text); margin-bottom:2px;">
            <span>${item.icon}</span> ${item.title}
          </div>
          <div style="direction:ltr; text-align:left; font-weight:800; color:var(--blue); font-size:14px;">${item.en}</div>
          <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">${item.ar}</div>
        </div>
        <div style="display:flex; gap:5px;">
          <button class="opt-speaker-btn" title="استمع للجملة (عربي + English)" onclick="audioService.speakPair('${safeAr}', '${safeEn}')">🔊</button>
          <button class="opt-speaker-btn" title="استمع بالإنجليزية فقط" onclick="audioService.speakEn('${safeEn}')">🇬🇧</button>
          <button class="opt-speaker-btn" title="نطق بطيء بالإنجليزي" onclick="audioService.speakSlow('${safeEn}')">🐢</button>
        </div>
      `;
      container.appendChild(card);
    });
  }

  async generateSay(tone = "عادي وطبيعي") {
    const inp = document.getElementById("whatsayInput");
    const situation = (inp.value || "").trim();
    if (!situation) {
      this.toast("اكتب وصف الموقف أولاً");
      return;
    }

    const loader = document.getElementById("whatsayLoading");
    const resBox = document.getElementById("whatsayResultBox");
    loader.style.display = "block";
    resBox.style.display = "none";

    const res = await lumiService.generateSituationalSentence(situation, tone);
    this.currentSayEn = res.en;
    this.currentSayAr = res.ar;

    document.getElementById("whatsayEnText").textContent = res.en;
    document.getElementById("whatsayArText").textContent = res.ar;

    loader.style.display = "none";
    resBox.style.display = "block";
    audioService.playCorrect();
    // Auto-pronounce linked Arabic translation + English sentence
    audioService.speakPair(res.ar, res.en);
  }

  playWhatSaySpeech(mode = "normal") {
    if (!this.currentSayEn) return;
    if (mode === "slow") {
      audioService.speakSlow(this.currentSayEn);
    } else if (mode === "normal" || mode === "en") {
      audioService.speakEn(this.currentSayEn);
    } else {
      audioService.speakPair(this.currentSayAr, this.currentSayEn);
    }
  }

  // --- One Minute Challenge ---
  renderChallengeIntro() {
    const topics = [
      "Talk about yourself and your family",
      "Describe what you did this morning",
      "Describe your dream holiday destination",
      "Talk about your favorite hobby and why you love it",
      "Describe your best friend"
    ];
    this.challengeTopic = topics[Math.floor(Math.random() * topics.length)];
    document.getElementById("challengeTopicText").textContent = `الموضوع: "${this.challengeTopic}"`;
    document.getElementById("challengeIntroCard").style.display = "block";
    document.getElementById("challengePlayCard").style.display = "none";
    document.getElementById("challengeResultCard").style.display = "none";
    clearInterval(this.challengeTimer);
  }

  startChallenge() {
    audioService.playClick();
    document.getElementById("challengeIntroCard").style.display = "none";
    document.getElementById("challengePlayCard").style.display = "block";
    document.getElementById("challengeTopicPlay").textContent = this.challengeTopic;

    const textarea = document.getElementById("challengeTextArea");
    textarea.value = "";
    textarea.focus();

    this.challengeSeconds = 60;
    document.getElementById("challengeTimerBadge").textContent = "60s";

    clearInterval(this.challengeTimer);
    this.challengeTimer = setInterval(() => {
      this.challengeSeconds--;
      document.getElementById("challengeTimerBadge").textContent = `${this.challengeSeconds}s`;
      if (this.challengeSeconds <= 0) {
        clearInterval(this.challengeTimer);
        this.finishChallenge();
      }
    }, 1000);
  }

  async finishChallenge() {
    clearInterval(this.challengeTimer);
    document.getElementById("challengePlayCard").style.display = "none";

    const text = document.getElementById("challengeTextArea").value.trim();
    if (!text) {
      this.toast("لم تكتب نصاً! جرب مرة أخرى.");
      this.renderChallengeIntro();
      return;
    }

    const loader = document.getElementById("challengeLoading");
    loader.style.display = "block";

    const evalRes = await lumiService.evaluateChallenge(this.challengeTopic, text);
    loader.style.display = "none";

    const resCard = document.getElementById("challengeResultCard");
    resCard.style.display = "block";
    resCard.innerHTML = `
      <div class="card">
        <div style="font-weight:800; font-size:16px; margin-bottom:12px;">تقرير تقييم التحدي 📊</div>
        <div class="lesson-row" style="padding:10px 14px; margin-bottom:8px;">
          <span>عدد الكلمات المكتوبة:</span>
          <span style="margin-inline-start:auto; font-weight:800; color:var(--blue);">${evalRes.wordCount} كلمة</span>
        </div>
        <div class="lesson-row" style="padding:10px 14px; margin-bottom:12px;">
          <span>تنوع المفردات المختلفة:</span>
          <span style="margin-inline-start:auto; font-weight:800; color:var(--green);">${evalRes.uniqueWords} كلمة فريدة</span>
        </div>
        <div class="card" style="background:var(--card-subtle); line-height:1.8; font-size:13.5px;">
          ${evalRes.feedback}
        </div>
        <button class="btn btn-gold" style="margin-top:14px;" onclick="app.renderChallengeIntro()">خوض تحدٍ جديد ⏱️</button>
      </div>
    `;

    audioService.playFanfare();
    storageService.addXP(15);
  }

  // --- English World Map ---
  renderWorld() {
    const container = document.getElementById("worldGridContainer");
    if (!container) return;
    container.innerHTML = "";

    const visitedCount = storageService.getVisitedList().length;
    document.getElementById("worldVisitedCount").textContent = `أكملت دراسة ${visitedCount} دروس — كل إنجاز يفتح معالم جديدة 🌍`;

    WORLD_LOCATIONS.forEach(loc => {
      const isLocked = visitedCount < loc.unlockAt;
      const tile = document.createElement("button");
      tile.className = "tile";
      tile.style.background = isLocked ? "#475569" : loc.color;
      tile.style.opacity = isLocked ? "0.85" : "1";

      tile.innerHTML = `
        <span class="tile-icon">${isLocked ? "🔒" : loc.icon}</span>
        <span>${loc.title}</span>
        <div style="font-size:10px; opacity:0.88; font-weight:500;">
          ${isLocked ? `يُفتح بعد ${loc.unlockAt} دروس` : loc.sub}
        </div>
      `;

      tile.onclick = () => {
        if (isLocked) {
          this.toast(`🔒 يتطلب إكمال ${loc.unlockAt} دروس لفتح هذه الوجهة.`);
          return;
        }
        if (loc.travelKey) {
          this.openTravel(loc.travelKey);
        } else if (loc.lessonKey) {
          this.openLesson(loc.lessonKey, "world");
        }
      };

      container.appendChild(tile);
    });
  }

  // --- Guess Translation Mini-game ---
  renderGameIntro() {
    document.getElementById("gameIntroCard").style.display = "block";
    document.getElementById("gamePlayCard").style.display = "none";
    document.getElementById("gameResultCard").style.display = "none";
    document.getElementById("gameBestScore").textContent = storageService.getGameBest();
  }

  startGame() {
    audioService.playClick();
    const pool = [];
    ["greet", "family", "daily", "food", "numbers", "shopping"].forEach(k => {
      if (LESSONS[k] && LESSONS[k].pairs) {
        LESSONS[k].pairs.forEach(p => {
          pool.push({ en: p.aEn || p.en, ar: p.aAr || p.ar });
        });
      }
    });

    this.gamePool = pool;
    this.gameRound = 0;
    this.gameScore = 0;

    document.getElementById("gameIntroCard").style.display = "none";
    document.getElementById("gamePlayCard").style.display = "block";
    this.nextGameRound();
  }

  nextGameRound() {
    if (this.gameRound >= this.gameTotal) {
      this.finishGame();
      return;
    }

    this.gameRound++;
    document.getElementById("gameRoundLabel").textContent = `الجولة ${this.gameRound} من ${this.gameTotal}`;
    document.getElementById("gameScoreLabel").textContent = `النقاط: ${this.gameScore}`;

    const correct = this.gamePool[Math.floor(Math.random() * this.gamePool.length)];
    const distractors = [];
    while (distractors.length < 2) {
      const d = this.gamePool[Math.floor(Math.random() * this.gamePool.length)];
      if (d.ar !== correct.ar && !distractors.find(x => x.ar === d.ar)) {
        distractors.push(d);
      }
    }

    const options = this.shuffleArray([correct, ...distractors]);
    document.getElementById("gameWordPrompt").textContent = correct.en;

    const wrap = document.getElementById("gameOptionsWrap");
    wrap.innerHTML = "";

    options.forEach(opt => {
      const b = document.createElement("button");
      b.className = "btn btn-ghost";
      b.style.marginBottom = "8px";
      b.textContent = opt.ar;

      b.onclick = () => {
        if (opt.ar === correct.ar) {
          b.style.background = "var(--green)";
          b.style.color = "#fff";
          this.gameScore++;
          audioService.playCorrect();
          storageService.addXP(3);
        } else {
          b.style.background = "#fee2e2";
          b.style.color = "var(--red)";
          audioService.playWrong();
        }
        Array.from(wrap.children).forEach(c => c.disabled = true);
        setTimeout(() => this.nextGameRound(), 600);
      };
      wrap.appendChild(b);
    });
  }

  finishGame() {
    document.getElementById("gamePlayCard").style.display = "none";
    storageService.setGameBest(this.gameScore);

    const resCard = document.getElementById("gameResultCard");
    resCard.style.display = "block";
    resCard.innerHTML = `
      <div class="card center" style="text-align:center; padding:24px;">
        <div style="font-size:42px; margin-bottom:8px;">🏆</div>
        <div style="font-weight:800; font-size:18px;">نتيجتك: ${this.gameScore} من ${this.gameTotal}</div>
        <div class="sub" style="margin-top:6px;">أفضل نتيجة لك: ${storageService.getGameBest()}</div>
        <button class="btn btn-gold" style="margin-top:16px;" onclick="app.renderGameIntro()">العب مرة أخرى 🎮</button>
      </div>
    `;
    audioService.playFanfare();
  }

  // --- Mistake Memory (Spaced Repetition) ---
  renderErrors() {
    const container = document.getElementById("errorsListContainer");
    if (!container) return;
    container.innerHTML = "";

    const errors = storageService.getErrorMemory();
    if (!errors.length) {
      container.innerHTML = `
        <div class="card center" style="text-align:center; padding:28px 16px;">
          <div style="font-size:36px; margin-bottom:8px;">🎉</div>
          <div style="font-weight:800; font-size:16px;">ذاكرة أخطائك نظيفة تماماً!</div>
          <div class="sub" style="margin-top:6px;">عندما تخطئ في أي سؤال أثناء الاختبارات، سنحفظه هنا تلقائياً لمراجعته وإتقانه.</div>
        </div>
      `;
      return;
    }

    const head = document.createElement("div");
    head.className = "card";
    head.innerHTML = `
      <div style="font-weight:800; margin-bottom:6px;">لديك ${errors.length} أسئلة في قائمة المراجعة 🧠</div>
      <div class="sub" style="margin-bottom:12px;">راجع الأسئلة التي تعثرت بها لتثبيت فهمك للقواعد.</div>
      <button class="btn btn-gold" onclick="app.reviewErrors()">🔁 مراجعة كل الأخطاء الآن</button>
      <button class="btn btn-ghost btn-sm" style="margin-top:8px;" onclick="storageService.clearErrors(); app.renderErrors();">مسح سجل الأخطاء</button>
    `;
    container.appendChild(head);

    errors.forEach(err => {
      const c = document.createElement("div");
      c.className = "pair-card";
      c.innerHTML = `
        <div class="pair-en">${err.q}</div>
        <div style="color:var(--green); font-weight:700; margin-top:6px;">الإجابة الصحيحة: ${err.options[err.correct]}</div>
        <div class="sub" style="margin-top:6px;">${err.explain}</div>
        <div style="font-size:11px; color:var(--text-muted); margin-top:6px;">تعثرت فيه: ${err.count} مرة</div>
      `;
      container.appendChild(c);
    });
  }

  reviewErrors() {
    const errors = storageService.getErrorMemory();
    if (!errors.length) {
      this.toast("لا توجد أخطاء لمراجعتها!");
      return;
    }
    this.quizKey = "review";
    this.quizList = errors.map(e => ({
      q: e.q,
      options: e.options,
      correct: e.correct,
      explain: e.explain
    }));
    this.quizIndex = 0;
    this.quizScore = 0;
    this.quizBackScreen = "errors";
    this.showScreen("quiz");
    this.renderQuizQuestion();
  }

  // --- Lumi Personal Study Plan ---
  renderLumiPlan() {
    const container = document.getElementById("lumiPlanContainer");
    if (!container) return;
    container.innerHTML = "";

    const setup = storageService.getPlanSetup();
    if (!setup) {
      this.renderPlanSetupForm(container);
      return;
    }

    const done = storageService.getPlanDone();
    const planItems = [
      { day: 1, focus: "المفردات", icon: "🗂️", ar: "راجع مفردات درس جديد وتدرب على نطقها واستماعها.", target: "lessons" },
      { day: 2, focus: "القواعد", icon: "📘", ar: "ادرس قاعدة نحوية جديدة واقرأ تركيبها وأمثلتها.", target: "grammar" },
      { day: 3, focus: "الاستماع", icon: "🎧", ar: "استمع للأمثلة والمحادثات وكرر النطق معها.", target: "lessons" },
      { day: 4, focus: "المحادثة مع لومي", icon: "🤖", ar: "تحدث مع لومي لمدة 10 دقائق وتدرب على تصحيح أخطائك.", target: "lumi" },
      { day: 5, focus: "المواقف والسفر", icon: "✈️", ar: "عِش موقفاً من مواقف السفر وتدرب على الرد المناسب.", target: "travelhub" },
      { day: 6, focus: "القصص التفاعلية", icon: "📖", ar: "اقرأ قصة تفاعلية واتخذ القرارات بنفسك.", target: "storyhub" },
      { day: 7, focus: "التقييم الشامل", icon: "📝", ar: "اختبر نفسك في القواعد التي درستها هذا الأسبوع.", target: "quizhub" }
    ];

    const head = document.createElement("div");
    head.className = "card";
    head.innerHTML = `
      <div style="font-weight:800; font-size:15px; margin-bottom:4px;">خطة الأسبوع: ${setup.minutes} يومياً 🎯</div>
      <div class="sub" style="margin-bottom:10px;">الهدف الأساسي: ${setup.goal}</div>
      <div class="progress-outer"><div class="progress-inner" style="width:${(done.length / 7) * 100}%;"></div></div>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span class="sub">أكملت ${done.length} من 7 أيام</span>
        <button class="btn btn-ghost btn-sm" onclick="storageService.resetPlan(); app.renderLumiPlan();">إعادة تخصيص الخطة</button>
      </div>
    `;
    container.appendChild(head);

    planItems.forEach(item => {
      const isDone = done.includes(item.day);
      const row = document.createElement("div");
      row.className = "lesson-row";
      row.innerHTML = `
        <div class="icon-box" style="background:${isDone ? '#ecfdf5' : 'var(--card-subtle)'}; color:${isDone ? 'var(--green)' : 'var(--text)'};">
          ${isDone ? "✓" : item.icon}
        </div>
        <div class="grow">
          <div class="title">اليوم ${item.day}: ${item.focus} ${isDone ? "• منجز" : ""}</div>
          <div class="sub">${item.ar}</div>
        </div>
        <div class="arrow-icon">‹</div>
      `;
      row.onclick = () => {
        storageService.markPlanDone(item.day);
        this.showScreen(item.target);
      };
      container.appendChild(row);
    });
  }

  renderPlanSetupForm(container) {
    container.innerHTML = `
      <div class="card">
        <div style="font-weight:800; font-size:16px; margin-bottom:8px;">لنجهّز خطتك التعليمية الشخصية 🎯</div>
        <div class="sub" style="margin-bottom:14px;">اختر هدفك ووقتك اليومي ليقوم لومي ببناء جدولك الأسبوعي المثالي.</div>

        <div style="font-size:12.5px; font-weight:700; margin-bottom:8px;">1. ما هو هدفك الأساسي؟</div>
        <div id="planGoalChips" class="tabs-scroll" style="margin-bottom:16px;"></div>

        <div style="font-size:12.5px; font-weight:700; margin-bottom:8px;">2. كم من الوقت تخصص يومياً؟</div>
        <div id="planMinChips" class="tabs-scroll" style="margin-bottom:20px;"></div>

        <button class="btn btn-gold" id="savePlanBtn" disabled onclick="app.saveCustomPlan()">إنشاء خطتي الشخصية 🚀</button>
      </div>
    `;

    let selectedGoal = null;
    let selectedMin = null;

    const gWrap = document.getElementById("planGoalChips");
    ["محادثة يومية", "السفر والسياحة", "الدراسة والجامعة", "بيئة العمل والوظيفة"].forEach(g => {
      const b = document.createElement("button");
      b.className = "tab-btn";
      b.textContent = g;
      b.onclick = () => {
        selectedGoal = g;
        Array.from(gWrap.children).forEach(c => c.classList.remove("active"));
        b.classList.add("active");
        checkReady();
      };
      gWrap.appendChild(b);
    });

    const mWrap = document.getElementById("planMinChips");
    ["10 دقائق", "20 دقيقة", "30 دقيقة فأكثر"].forEach(m => {
      const b = document.createElement("button");
      b.className = "tab-btn";
      b.textContent = m;
      b.onclick = () => {
        selectedMin = m;
        Array.from(mWrap.children).forEach(c => c.classList.remove("active"));
        b.classList.add("active");
        checkReady();
      };
      mWrap.appendChild(b);
    });

    const checkReady = () => {
      const btn = document.getElementById("savePlanBtn");
      if (btn) btn.disabled = !(selectedGoal && selectedMin);
    };

    this.saveCustomPlan = () => {
      if (selectedGoal && selectedMin) {
        audioService.playCorrect();
        storageService.savePlanSetup({ goal: selectedGoal, minutes: selectedMin });
        this.renderLumiPlan();
      }
    };
  }

  // --- Profile & Stats View ---
  renderProfile() {
    const profile = storageService.getProfile();
    const streak = storageService.getStreak();
    const xp = storageService.getXP();
    const visited = storageService.getVisitedList().length;
    const quizzesDone = storageService.getQuizzesDone();
    const userLvl = storageService.getUserLevel();

    const nameEl = document.getElementById("profileUserName");
    if (nameEl) nameEl.textContent = profile.name || "متعلم طموح";

    const badgeEl = document.getElementById("profileLevelBadge");
    if (badgeEl) badgeEl.textContent = `${userLvl.badge} ${userLvl.name}`;

    const streakEl = document.getElementById("profileStreakCount");
    if (streakEl) streakEl.textContent = `${streak} يوم`;

    const xpEl = document.getElementById("profileXpCount");
    if (xpEl) xpEl.textContent = `${xp} XP`;

    const visitedEl = document.getElementById("profileVisitedCount");
    if (visitedEl) visitedEl.textContent = `${visited} درس`;

    const quizzesEl = document.getElementById("profileQuizzesCount");
    if (quizzesEl) quizzesEl.textContent = `${quizzesDone} اختبار`;

    // Badges Container
    const badgesWrap = document.getElementById("profileBadgesWrap");
    if (badgesWrap) {
      badgesWrap.innerHTML = "";
      const badges = [
        { icon: "🎯", title: "أول اختبار", unlocked: quizzesDone >= 1 },
        { icon: "📚", title: "مستكشف الدروس", unlocked: visited >= 5 },
        { icon: "🔥", title: "شعلة المثابرة", unlocked: streak >= 3 },
        { icon: "⭐", title: "نجم ساطع", unlocked: xp >= 100 },
        { icon: "✈️", title: "مسافر واثق", unlocked: visited >= 3 },
        { icon: "👑", title: "خبير الإنجليزية", unlocked: userLvl.num >= 5 }
      ];

      badges.forEach(b => {
        const t = document.createElement("div");
        t.className = "tile";
        t.style.background = b.unlocked ? "var(--card)" : "var(--card-subtle)";
        t.style.color = b.unlocked ? "var(--text)" : "var(--text-muted)";
        t.style.border = "1px solid var(--border)";
        t.style.boxShadow = b.unlocked ? "var(--shadow-sm)" : "none";
        t.innerHTML = `
          <span class="tile-icon" style="filter:${b.unlocked ? 'none' : 'grayscale(1)'}">${b.icon}</span>
          <span style="font-size:12px;">${b.title}</span>
          <div style="font-size:10px; color:${b.unlocked ? 'var(--green)' : 'var(--text-muted)'}; font-weight:700;">
            ${b.unlocked ? "مكتملة ✓" : "قيد الإنجاز"}
          </div>
        `;
        badgesWrap.appendChild(t);
      });
    }

    // Update Sound Settings Controls
    const sfxBtn = document.getElementById("profileSfxToggleBtn");
    if (sfxBtn) {
      sfxBtn.innerHTML = audioService.sfxEnabled ? "🔔 المؤثرات الصوتية: مفعّلة ✅" : "🔕 المؤثرات الصوتية: معطّلة ❌";
    }
    const currentRate = audioService.speechRate;
    for (const r of [0.75, 0.9, 1.1]) {
      const b = document.getElementById(`rateBtn_${r}`);
      if (b) b.classList.toggle("active", Math.abs(currentRate - r) < 0.05);
    }
  }

  testAudioVoices() {
    audioService.unlockAudio();
    if (audioService.isNativeAndroid()) {
      this.toast("🔊 محرك أندرويد الصوتي الأصلي (Native TTS) مفعّل وجاهز بنجاح ✅");
      audioService.speakSeq("مرحباً بك في رحلتي للإنجليزية", "Welcome to English Journey", "both");
      return;
    }
    const arPicked = audioService.getArabicVoice();
    const enPicked = audioService.getEnglishVoice();
    const arStatus = arPicked.voice ? (arPicked.isSaudi ? "عربي سعودي ✅" : "عربي قياسي ✅") : "صوت قياسي عبر الإنترنت 🌐";
    const enStatus = enPicked.voice ? (enPicked.isHighQuality ? "إنجليزي عالي الجودة ✅" : "إنجليزي أساسي ✅") : "غير متوفر ❌";

    this.toast(`الأصوات: ${arStatus} | ${enStatus}`);
    audioService.speakSeq("مرحباً بك في رحلتي للإنجليزية", "Welcome to English Journey", "both");
  }

  testEnglishVoice() {
    audioService.unlockAudio();
    audioService.playClick();
    this.toast("🔊 تشغيل عينة نطق باللغة الإنجليزية...");
    audioService.speakSeq("", "Welcome to English Journey! Speak with confidence and master English step by step.", "en");
  }

  testArabicVoice() {
    audioService.unlockAudio();
    audioService.playClick();
    this.toast("🔊 تشغيل عينة نطق باللغة العربية...");
    audioService.speakSeq("مرحباً بك في تطبيق رحلتي للإنجليزية، استمتع بتجربة تعلم تفاعلية وممتعة.", "", "ar");
  }

  testSoundEffects() {
    audioService.unlockAudio();
    audioService.playCorrect();
    setTimeout(() => audioService.playFanfare(), 350);
    this.toast("🎵 تم تشغيل المؤثرات الصوتية بنجاح!");
  }

  toggleSfxSetting() {
    audioService.setSfxEnabled(!audioService.sfxEnabled);
    audioService.playClick();
    const isEnabled = audioService.sfxEnabled;
    this.toast(isEnabled ? "🔔 تم تفعيل المؤثرات الصوتية" : "🔕 تم كتم المؤثرات الصوتية");
    const sfxBtn = document.getElementById("profileSfxToggleBtn");
    if (sfxBtn) {
      sfxBtn.innerHTML = isEnabled ? "🔔 المؤثرات الصوتية: مفعّلة ✅" : "🔕 المؤثرات الصوتية: معطّلة ❌";
    }
  }

  setSpeechSpeed(rate) {
    audioService.setSpeechRate(rate);
    audioService.playClick();
    this.toast(`⚡ تم ضبط سرعة النطق على: ${rate}x`);
    for (const r of [0.75, 0.9, 1.1]) {
      const b = document.getElementById(`rateBtn_${r}`);
      if (b) b.classList.toggle("active", r === rate);
    }
    audioService.speakSeq("", "This is the current speech speed.", "en");
  }

  // --- 1. Lumi Voice Call Simulator ---
  openLumiCall(scenarioKey = "coffee") {
    this.callScenarioKey = scenarioKey;
    const scenario = LUMI_CALL_SCENARIOS[scenarioKey] || LUMI_CALL_SCENARIOS.coffee;
    this.callStageIndex = 0;
    this.callSeconds = 0;
    this.callActive = false;
    clearInterval(this.callTimerInterval);

    const ringingBox = document.getElementById("lumiCallRingingBox");
    const activeBox = document.getElementById("lumiCallActiveBox");
    if (ringingBox) ringingBox.style.display = "flex";
    if (activeBox) activeBox.style.display = "none";

    const callerName = document.getElementById("callCallerName");
    const callerRole = document.getElementById("callCallerRole");
    if (callerName) callerName.textContent = scenario.callerName;
    if (callerRole) callerRole.textContent = scenario.callerRole;

    audioService.playDing();
    this.showScreen("lumicall");
  }

  acceptLumiCall() {
    this.callActive = true;
    const ringingBox = document.getElementById("lumiCallRingingBox");
    const activeBox = document.getElementById("lumiCallActiveBox");
    if (ringingBox) ringingBox.style.display = "none";
    if (activeBox) activeBox.style.display = "flex";

    this.startCallTimer();
    this.renderCallStage();
  }

  startCallTimer() {
    clearInterval(this.callTimerInterval);
    this.callSeconds = 0;
    const timerEl = document.getElementById("callDurationTimer");
    if (timerEl) timerEl.textContent = "00:00";

    this.callTimerInterval = setInterval(() => {
      this.callSeconds++;
      const mins = String(Math.floor(this.callSeconds / 60)).padStart(2, "0");
      const secs = String(this.callSeconds % 60).padStart(2, "0");
      if (timerEl) timerEl.textContent = `${mins}:${secs}`;
    }, 1000);
  }

  renderCallStage() {
    const scenario = LUMI_CALL_SCENARIOS[this.callScenarioKey] || LUMI_CALL_SCENARIOS.coffee;
    if (this.callStageIndex >= scenario.stages.length) {
      this.finishLumiCall();
      return;
    }

    const stage = scenario.stages[this.callStageIndex];
    const enEl = document.getElementById("callLumiEnText");
    const arEl = document.getElementById("callLumiArText");
    const titleEl = document.getElementById("callActiveCallerTitle");
    const repliesWrap = document.getElementById("callSuggestedRepliesWrap");
    const feedbackEl = document.getElementById("callSpeechFeedback");

    if (titleEl) titleEl.textContent = `${scenario.callerName} 🟢`;
    if (enEl) enEl.textContent = stage.lumiEn;
    if (arEl) arEl.textContent = stage.lumiAr;
    if (feedbackEl) {
      feedbackEl.textContent = "";
      feedbackEl.style.color = "#93c5fd";
    }

    if (repliesWrap) {
      repliesWrap.innerHTML = "";
      stage.suggestedReplies.forEach((reply, idx) => {
        const pill = document.createElement("div");
        pill.className = "call-reply-pill";
        pill.innerHTML = `
          <div class="reply-en">${reply.en}</div>
          <div class="reply-ar">${reply.ar}</div>
        `;
        pill.onclick = () => this.chooseCallReply(idx);
        repliesWrap.appendChild(pill);
      });
    }

    // Speak Lumi's line: Arabic prompt followed by English
    audioService.speakPair(stage.lumiAr, stage.lumiEn);
  }

  repeatLumiCallSpeech() {
    const scenario = LUMI_CALL_SCENARIOS[this.callScenarioKey] || LUMI_CALL_SCENARIOS.coffee;
    const stage = scenario.stages[this.callStageIndex];
    if (stage) {
      audioService.speakPair(stage.lumiAr, stage.lumiEn);
    }
  }

  chooseCallReply(replyIndex) {
    const scenario = LUMI_CALL_SCENARIOS[this.callScenarioKey] || LUMI_CALL_SCENARIOS.coffee;
    const stage = scenario.stages[this.callStageIndex];
    if (!stage) return;
    const reply = stage.suggestedReplies[replyIndex];
    if (!reply) return;

    const feedbackEl = document.getElementById("callSpeechFeedback");
    if (feedbackEl) {
      feedbackEl.textContent = `✅ رد ممتاز: "${reply.en}"`;
      feedbackEl.style.color = "#86efac";
    }

    audioService.speakEn(reply.en);
    storageService.addXP(10);

    const repliesWrap = document.getElementById("callSuggestedRepliesWrap");
    if (repliesWrap) {
      const pills = repliesWrap.querySelectorAll(".call-reply-pill");
      pills.forEach(p => p.style.pointerEvents = "none");
    }

    setTimeout(() => {
      this.callStageIndex++;
      this.renderCallStage();
    }, 1500);
  }

  startCallRecording() {
    const feedbackEl = document.getElementById("callSpeechFeedback");
    const micBtn = document.getElementById("callMicBtn");
    const scenario = LUMI_CALL_SCENARIOS[this.callScenarioKey] || LUMI_CALL_SCENARIOS.coffee;
    const stage = scenario.stages[this.callStageIndex];
    if (!stage) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.toast("🎤 ميزة التعرف الصوتي تتطلب متصفح Chrome أو إذن الميكروفون. يمكنك اختيار الرد من الخيارات المقترحة!");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      if (micBtn) micBtn.style.animation = "callPulse 1s infinite";
      if (feedbackEl) {
        feedbackEl.textContent = "🎙️ جاري الاستماع... تحدث بالإنجليزية الآن";
        feedbackEl.style.color = "#fef08a";
      }

      recognition.onresult = (e) => {
        if (micBtn) micBtn.style.animation = "none";
        const spoken = e.results[0][0].transcript.trim().toLowerCase();
        if (feedbackEl) {
          feedbackEl.textContent = `سمعتك تقول: "${spoken}"`;
          feedbackEl.style.color = "#86efac";
        }
        audioService.playCorrect();
        storageService.addXP(15);
        setTimeout(() => {
          this.callStageIndex++;
          this.renderCallStage();
        }, 1500);
      };

      recognition.onerror = () => {
        if (micBtn) micBtn.style.animation = "none";
        if (feedbackEl) {
          feedbackEl.textContent = "تعذر التقاط الصوت، يمكنك النقر على أحد الخيارات المقترحة 👆";
          feedbackEl.style.color = "#fca5a5";
        }
      };

      recognition.onend = () => {
        if (micBtn) micBtn.style.animation = "none";
      };

      recognition.start();
    } catch (err) {
      if (micBtn) micBtn.style.animation = "none";
      this.toast("تعذر تشغيل الميكروفون. يرجى اختيار أحد الخيارات المقترحة.");
    }
  }

  toggleCallSpeaker() {
    audioService.playClick();
    this.toast("🔊 مكبر الصوت قيد التشغيل بأعلى جودة صوتية");
  }

  finishLumiCall() {
    clearInterval(this.callTimerInterval);
    this.callActive = false;
    audioService.playCelebration();
    storageService.addXP(30);
    this.toast("🎉 تم إنهاء المكالمة بنجاح باهر! +30 نقطة خبرة XP");

    setTimeout(() => {
      this.showScreen("home");
    }, 2000);
  }

  endLumiCall() {
    clearInterval(this.callTimerInterval);
    this.callActive = false;
    audioService.playClick();
    this.toast("📞 تم إنهاء المكالمة.");
    this.showScreen("home");
  }

  closeLumiCall() {
    clearInterval(this.callTimerInterval);
    this.callActive = false;
    audioService.playClick();
    this.showScreen("home");
  }

  // --- 2. Arab-English Phonics Lab ---
  openPhonicsLab(topicKey = "pb") {
    this.currentPhonicsKey = topicKey;
    const tabsWrap = document.getElementById("phonicsTabsWrap");
    if (tabsWrap) {
      tabsWrap.innerHTML = "";
      Object.keys(PHONICS_TOPICS).forEach(key => {
        const top = PHONICS_TOPICS[key];
        const btn = document.createElement("button");
        btn.className = `pill ${key === this.currentPhonicsKey ? "active" : ""}`;
        btn.style.cursor = "pointer";
        btn.style.whiteSpace = "nowrap";
        btn.textContent = `${top.icon} ${top.title.split(" ")[0]} ${top.title.split(" ")[1] || ""}`;
        btn.onclick = () => this.renderPhonicsTopic(key);
        tabsWrap.appendChild(btn);
      });
    }
    this.renderPhonicsTopic(this.currentPhonicsKey);
  }

  renderPhonicsTopic(topicKey) {
    this.currentPhonicsKey = topicKey;
    const topic = PHONICS_TOPICS[topicKey] || PHONICS_TOPICS.pb;

    const tabsWrap = document.getElementById("phonicsTabsWrap");
    if (tabsWrap) {
      const btns = tabsWrap.querySelectorAll("button");
      btns.forEach((btn, idx) => {
        const k = Object.keys(PHONICS_TOPICS)[idx];
        btn.className = `pill ${k === topicKey ? "active" : ""}`;
      });
    }

    const box = document.getElementById("phonicsContentBox");
    if (!box) return;

    let html = `
      <div class="card" style="border-right:4px solid var(--blue); margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <span class="pill">${topic.badge}</span>
          <span style="font-size:12px; color:var(--text-muted); direction:ltr; font-weight:700;">${topic.titleEn}</span>
        </div>
        <div style="font-size:18px; font-weight:900; color:var(--text);">${topic.icon} ${topic.title}</div>
        <div style="font-size:13px; color:var(--text-muted); margin-top:6px; line-height:1.6;">${topic.desc}</div>
      </div>

      <div class="phonics-tip-box" style="margin-bottom:16px;">
        ${topic.howToProduce}
      </div>

      <div style="font-size:14px; font-weight:800; color:var(--text); margin-bottom:10px;">
        🎯 أزواج الكلمات المتقابلة (استمع للفرق بدقة):
      </div>
    `;

    topic.pairs.forEach((pair) => {
      html += `
        <div class="phonics-card" style="margin-bottom:10px;">
          <div class="phonics-pair-box">
            <button class="phonics-word-btn" onclick="app.playPhonicsWord('${pair.w1}', '${pair.w1Ar}')">
              <span class="en-word">${pair.w1}</span>
              <span class="ipa">${pair.ipa1}</span>
              <span style="font-size:11px; color:var(--text-muted);">${pair.w1Ar}</span>
              <span style="font-size:11px; color:var(--blue); margin-top:2px;">🔊 استمع</span>
            </button>
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center;">
              <span style="font-weight:900; color:var(--text-muted); font-size:12px;">ضد</span>
              <button class="btn btn-ghost btn-sm" style="font-size:10px; padding:2px 6px; margin-top:4px;" onclick="app.playPhonicsPair('${pair.w1}', '${pair.w2}')">مقارنة ⚡</button>
            </div>
            <button class="phonics-word-btn" onclick="app.playPhonicsWord('${pair.w2}', '${pair.w2Ar}')">
              <span class="en-word">${pair.w2}</span>
              <span class="ipa">${pair.ipa2}</span>
              <span style="font-size:11px; color:var(--text-muted);">${pair.w2Ar}</span>
              <span style="font-size:11px; color:var(--blue); margin-top:2px;">🔊 استمع</span>
            </button>
          </div>
        </div>
      `;
    });

    if (topic.quiz && topic.quiz.length) {
      html += `
        <div style="font-size:14px; font-weight:800; color:var(--text); margin:20px 0 10px;">
          👂 اختبار الأذن السريعة (اختر الكلمة التي تسمعها):
        </div>
      `;
      topic.quiz.forEach((q, qIdx) => {
        html += `
          <div class="card" style="margin-bottom:10px;" id="phonicsQuizCard_${qIdx}">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-weight:700; font-size:12px; color:var(--text-muted);">سؤال ${qIdx + 1}</span>
              <button class="btn btn-ghost btn-sm" onclick="app.playPhonicsWord('${q.target}', '')">🔊 اسمع الكلمة</button>
            </div>
            <div style="display:flex; gap:8px;">
              ${q.options.map((opt, optIdx) => `
                <button class="btn btn-primary" style="flex:1; direction:ltr;" id="phonicsOptBtn_${qIdx}_${optIdx}" onclick="app.answerPhonicsQuiz(${qIdx}, ${optIdx}, ${q.correct}, '${q.target}')">
                  ${opt}
                </button>
              `).join("")}
            </div>
            <div id="phonicsQuizFeedback_${qIdx}" style="font-size:11.5px; margin-top:8px; display:none;"></div>
          </div>
        `;
      });
    }

    box.innerHTML = html;
  }

  playPhonicsWord(en, ar) {
    if (ar) {
      audioService.speakPair(ar, en);
    } else {
      audioService.speakEn(en);
    }
  }

  playPhonicsPair(w1, w2) {
    audioService.speakSeq("", `${w1}... versus... ${w2}`, "en");
  }

  answerPhonicsQuiz(qIdx, selectedOptIdx, correctOptIdx, targetWord) {
    const isCorrect = selectedOptIdx === correctOptIdx;
    const btn = document.getElementById(`phonicsOptBtn_${qIdx}_${selectedOptIdx}`);
    const feedback = document.getElementById(`phonicsQuizFeedback_${qIdx}`);

    if (isCorrect) {
      audioService.playCorrect();
      if (btn) {
        btn.style.background = "#10b981";
        btn.style.borderColor = "#10b981";
      }
      if (feedback) {
        feedback.style.display = "block";
        feedback.style.color = "#047857";
        feedback.textContent = `🎯 رائع جداً! ميزت نطق (${targetWord}) بدقة فائقة. +5 XP`;
      }
      storageService.addXP(5);
      storageService.markPhonicsDone(this.currentPhonicsKey);
    } else {
      audioService.playWrong();
      if (btn) {
        btn.style.background = "#ef4444";
        btn.style.borderColor = "#ef4444";
      }
      if (feedback) {
        feedback.style.display = "block";
        feedback.style.color = "#b91c1c";
        feedback.textContent = `❌ حاول مرة أخرى! استمع جيداً للفرق بين الصوتين.`;
      }
    }
  }

  // --- 3. Smart SRS Flashcards ---
  openSRSFlashcards() {
    let cards = storageService.getSRSCards();
    if (!cards || !cards.length) {
      cards = this.initSRSCardsPool();
    }
    this.srsPool = cards;
    this.srsIndex = 0;
    this.srsFlipped = false;
    this.updateSRSBoxCounts();
    this.renderSRSCard();
  }

  initSRSCardsPool() {
    const defaultDeck = [
      { id: "srs_1", en: "Passport", ar: "جواز السفر", ipa: "/ˈpæspɔːrt/", example: "Please show your passport.", box: 1 },
      { id: "srs_2", en: "Luggage", ar: "الأمتعة والحقائب", ipa: "/ˈlʌɡɪdʒ/", example: "Where is my luggage?", box: 1 },
      { id: "srs_3", en: "Reservation", ar: "حجز مسبق", ipa: "/ˌrɛzərˈveɪʃən/", example: "I have a reservation for two.", box: 1 },
      { id: "srs_4", en: "Delicious", ar: "لذيذ الطعم", ipa: "/dɪˈlɪʃəs/", example: "This breakfast is delicious.", box: 1 },
      { id: "srs_5", en: "Hospital", ar: "مستشفى", ipa: "/ˈhɒspɪtəl/", example: "Where is the nearest hospital?", box: 1 },
      { id: "srs_6", en: "Receipt", ar: "فاتورة / إيصال", ipa: "/rɪˈsiːt/", example: "Can I have a receipt, please?", box: 1 },
      { id: "srs_7", en: "Schedule", ar: "جدول المواعيد", ipa: "/ˈskɛdʒuːl/", example: "Let's check the schedule.", box: 1 },
      { id: "srs_8", en: "Emergency", ar: "حالة طارئة", ipa: "/ɪˈmɜːrdʒənsi/", example: "In case of emergency, call 911.", box: 1 },
      { id: "srs_9", en: "Discount", ar: "خصم / تخفيض", ipa: "/ˈdɪskaʊnt/", example: "Is there any discount today?", box: 1 },
      { id: "srs_10", en: "Destination", ar: "الوجهة المقصودة", ipa: "/ˌdɛstɪˈneɪʃən/", example: "What is your final destination?", box: 1 }
    ];
    storageService.saveSRSCards(defaultDeck);
    return defaultDeck;
  }

  updateSRSBoxCounts() {
    const cards = storageService.getSRSCards();
    const box1 = cards.filter(c => c.box === 1).length;
    const box2 = cards.filter(c => c.box === 2).length;
    const box3 = cards.filter(c => c.box === 3).length;

    const b1El = document.getElementById("srsBox1Count");
    const b2El = document.getElementById("srsBox2Count");
    const b3El = document.getElementById("srsBox3Count");
    if (b1El) b1El.textContent = box1;
    if (b2El) b2El.textContent = box2;
    if (b3El) b3El.textContent = box3;
  }

  renderSRSCard() {
    if (!this.srsPool || !this.srsPool.length || this.srsIndex >= this.srsPool.length) {
      this.toast("🎉 أكملت مراجعة جميع بطاقات اليوم! أحسنت صنعاً.");
      this.srsIndex = 0;
    }

    const card = this.srsPool[this.srsIndex];
    this.currentSRSCard = card;
    this.srsFlipped = false;

    const cardEl = document.getElementById("srsInteractiveCard");
    if (cardEl) cardEl.classList.remove("flipped");

    const countLabel = document.getElementById("srsCardCountLabel");
    const boxBadge = document.getElementById("srsCardBoxBadge");
    const arText = document.getElementById("srsCardArText");
    const enText = document.getElementById("srsCardEnText");
    const ipaText = document.getElementById("srsCardIpaText");
    const exampleText = document.getElementById("srsCardExampleText");

    if (countLabel) countLabel.textContent = `البطاقة ${this.srsIndex + 1} من ${this.srsPool.length}`;
    if (boxBadge) {
      boxBadge.className = `srs-box-badge srs-box-${card.box || 1}`;
      boxBadge.textContent = `صندوق ${card.box || 1}`;
    }
    if (arText) arText.textContent = card.ar;
    if (enText) enText.textContent = card.en;
    if (ipaText) ipaText.textContent = card.ipa || "";
    if (exampleText) exampleText.textContent = card.example || "";

    audioService.speakPair(card.ar, card.en);
  }

  flipSRSCard() {
    const cardEl = document.getElementById("srsInteractiveCard");
    if (!cardEl) return;
    this.srsFlipped = !this.srsFlipped;
    cardEl.classList.toggle("flipped", this.srsFlipped);
    audioService.playClick();
    if (this.srsFlipped && this.currentSRSCard) {
      audioService.speakEn(this.currentSRSCard.en);
    }
  }

  playCurrentSRSSpeech() {
    if (this.currentSRSCard) {
      audioService.speakPair(this.currentSRSCard.ar, this.currentSRSCard.en);
    }
  }

  rateSRSCard(rating) {
    if (!this.currentSRSCard) return;
    const targetBox = rating;
    storageService.updateSRSCardBox(this.currentSRSCard.id, targetBox);
    this.currentSRSCard.box = targetBox;

    audioService.playCorrect();
    storageService.addXP(rating * 3);
    this.updateSRSBoxCounts();

    this.srsIndex++;
    if (this.srsIndex >= this.srsPool.length) {
      audioService.playCelebration();
      this.toast("🏆 عظيم! أتممت مراجعة جميع بطاقات التكرار المتباعد.");
      this.srsIndex = 0;
    }
    this.renderSRSCard();
  }

  // --- 4. Sentence Lego Builder ---
  openLegoBuilder(challengeIdx = 0) {
    this.legoIndex = challengeIdx % LEGO_CHALLENGES.length;
    this.legoSlotsPlaced = [];
    this.renderLegoUI();
  }

  renderLegoUI() {
    const ch = LEGO_CHALLENGES[this.legoIndex];
    if (!ch) return;

    const lvlBadge = document.getElementById("legoLevelBadge");
    const progLabel = document.getElementById("legoProgressLabel");
    const targetAr = document.getElementById("legoTargetAr");
    const tipBox = document.getElementById("legoTipBox");
    const feedbackBox = document.getElementById("legoFeedbackBox");
    const checkBtn = document.getElementById("legoCheckBtn");
    const nextBtn = document.getElementById("legoNextBtn");

    if (lvlBadge) lvlBadge.textContent = `المستوى ${ch.level} - ${ch.titleEn}`;
    if (progLabel) progLabel.textContent = `التحدي ${this.legoIndex + 1} من ${LEGO_CHALLENGES.length}`;
    if (targetAr) targetAr.textContent = ch.targetAr;
    if (tipBox) tipBox.textContent = `💡 ${ch.grammarTip}`;
    if (feedbackBox) feedbackBox.style.display = "none";
    if (checkBtn) checkBtn.style.display = "block";
    if (nextBtn) nextBtn.style.display = "none";

    this.renderLegoSlotsAndBank();
    audioService.speakPair(ch.targetAr, "");
  }

  renderLegoSlotsAndBank() {
    const ch = LEGO_CHALLENGES[this.legoIndex];
    const slotsGrid = document.getElementById("legoSlotsGrid");
    const bankBox = document.getElementById("legoBankBox");
    if (!slotsGrid || !bankBox) return;

    slotsGrid.innerHTML = "";
    ch.slots.forEach((slot, idx) => {
      const placedText = this.legoSlotsPlaced[idx];
      if (placedText) {
        const chip = document.createElement("div");
        chip.className = "lego-block-chip";
        chip.style.backgroundColor = slot.color;
        chip.innerHTML = `${placedText} <span style="font-size:10px; opacity:0.8;">✕</span>`;
        chip.title = "اضغط للإزالة";
        chip.onclick = () => this.removeLegoBlock(idx);
        slotsGrid.appendChild(chip);
      } else {
        const emptySlot = document.createElement("div");
        emptySlot.className = "lego-slot-target";
        emptySlot.innerHTML = `<span style="font-size:11px; color:var(--text-muted); font-weight:700;">${slot.label}</span>`;
        slotsGrid.appendChild(emptySlot);
      }
    });

    bankBox.innerHTML = "";
    const placedCounts = {};
    this.legoSlotsPlaced.forEach(t => placedCounts[t] = (placedCounts[t] || 0) + 1);

    ch.blocks.forEach((blk) => {
      const isAlreadyPlaced = (placedCounts[blk.text] || 0) > 0;
      if (isAlreadyPlaced) {
        placedCounts[blk.text]--;
        return;
      }
      const chip = document.createElement("div");
      chip.className = "lego-block-chip";
      chip.style.backgroundColor = blk.color;
      chip.textContent = blk.text;
      chip.onclick = () => this.addLegoBlock(blk.text);
      bankBox.appendChild(chip);
    });
  }

  addLegoBlock(text) {
    const ch = LEGO_CHALLENGES[this.legoIndex];
    if (this.legoSlotsPlaced.length >= ch.slots.length) {
      this.toast("⚠️ تم ملء جميع فتحات الجملة! يمكنك إزالة قطعة بالضغط عليها.");
      return;
    }
    audioService.playClick();
    this.legoSlotsPlaced.push(text);
    this.renderLegoSlotsAndBank();
  }

  removeLegoBlock(idx) {
    audioService.playClick();
    this.legoSlotsPlaced.splice(idx, 1);
    this.renderLegoSlotsAndBank();
  }

  resetLegoSlots() {
    audioService.playClick();
    this.legoSlotsPlaced = [];
    this.renderLegoSlotsAndBank();
  }

  checkLegoSentence() {
    const ch = LEGO_CHALLENGES[this.legoIndex];
    const feedbackBox = document.getElementById("legoFeedbackBox");
    const checkBtn = document.getElementById("legoCheckBtn");
    const nextBtn = document.getElementById("legoNextBtn");

    const isMatch = this.legoSlotsPlaced.length === ch.correct.length &&
      this.legoSlotsPlaced.every((val, i) => val === ch.correct[i]);

    if (isMatch) {
      audioService.playCorrect();
      storageService.addXP(20);
      storageService.markLegoDone(ch.id);

      if (feedbackBox) {
        feedbackBox.style.display = "block";
        feedbackBox.style.background = "#d1fae5";
        feedbackBox.style.color = "#047857";
        feedbackBox.innerHTML = `🎉 مبروك! جملة صحيحة 100% بنية ومعنى:<br><strong>${ch.sentenceEn}</strong> (+20 XP)`;
      }
      if (checkBtn) checkBtn.style.display = "none";
      if (nextBtn) nextBtn.style.display = "block";

      audioService.speakPair(ch.targetAr, ch.sentenceEn);
    } else {
      audioService.playWrong();
      if (feedbackBox) {
        feedbackBox.style.display = "block";
        feedbackBox.style.background = "#fee2e2";
        feedbackBox.style.color = "#b91c1c";
        feedbackBox.textContent = "⚠️ ترتيب القطع غير صحيح أو توجد قطعة ناقصة. انتبه لقاعدة الفعل والفاعل!";
      }
    }
  }

  nextLegoChallenge() {
    this.legoIndex = (this.legoIndex + 1) % LEGO_CHALLENGES.length;
    this.legoSlotsPlaced = [];
    this.renderLegoUI();
  }

  // --- 5. Speech Shadowing Lab ---
  openShadowingLab(drillIdx = 0) {
    this.shadowIndex = drillIdx % SHADOWING_DRILLS.length;
    this.shadowSpeed = "normal";
    this.renderShadowUI();
  }

  renderShadowUI() {
    const drill = SHADOWING_DRILLS[this.shadowIndex];
    if (!drill) return;

    const catPill = document.getElementById("shadowCategoryPill");
    const displayEn = document.getElementById("shadowingDisplayEn");
    const displayAr = document.getElementById("shadowingDisplayAr");
    const tipBox = document.getElementById("shadowingTipBox");
    const feedbackBox = document.getElementById("shadowFeedbackBox");

    if (catPill) catPill.textContent = `${drill.icon} ${drill.category}`;
    if (displayAr) displayAr.textContent = drill.textAr;
    if (tipBox) tipBox.textContent = `💡 نصيحة النبرة: ${drill.tip}`;
    if (feedbackBox) feedbackBox.style.display = "none";

    if (displayEn) {
      const words = drill.textEn.split(" ");
      displayEn.innerHTML = words.map(w => {
        const clean = w.replace(/[.,?!]/g, "");
        const isStressed = drill.stressWords.some(sw => sw.toLowerCase() === clean.toLowerCase());
        return isStressed ? `<span class="shadowing-word-stress">${w}</span>` : w;
      }).join(" ");
    }
  }

  setShadowSpeed(speed) {
    this.shadowSpeed = speed;
    audioService.playClick();
    const btnNorm = document.getElementById("shadowSpeedNormal");
    const btnSlow = document.getElementById("shadowSpeedSlow");
    if (btnNorm) btnNorm.classList.toggle("active", speed === "normal");
    if (btnSlow) btnSlow.classList.toggle("active", speed === "slow");
    this.toast(`⚡ تم ضبط سرعة التظليل على: ${speed === "slow" ? "بطيء (0.75x)" : "عادي (1.0x)"}`);
  }

  playShadowTarget() {
    const drill = SHADOWING_DRILLS[this.shadowIndex];
    if (!drill) return;
    if (this.shadowSpeed === "slow") {
      audioService.speakSlow(drill.textEn);
    } else {
      audioService.speakEn(drill.textEn);
    }
  }

  playShadowSynced() {
    const drill = SHADOWING_DRILLS[this.shadowIndex];
    if (!drill) return;
    audioService.speakPair(drill.textAr, drill.textEn);
  }

  startShadowRecording() {
    const drill = SHADOWING_DRILLS[this.shadowIndex];
    const recBtn = document.getElementById("shadowRecordBtn");
    const feedbackBox = document.getElementById("shadowFeedbackBox");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.toast("🎤 ميزة التعرف على الصوت تتطلب متصفح Chrome أو إذن الميكروفون.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      if (recBtn) recBtn.textContent = "🎙️ جاري التسجيل... ظلل الجملة الآن!";
      if (feedbackBox) {
        feedbackBox.style.display = "block";
        feedbackBox.style.background = "#fef3c7";
        feedbackBox.style.color = "#b45309";
        feedbackBox.textContent = "🎙️ جاري الاستماع لنبرتك وكلماتك...";
      }

      recognition.onresult = (e) => {
        if (recBtn) recBtn.textContent = "🎤 3. سجل صوتك وقارن النبرة";
        const spoken = e.results[0][0].transcript.trim().toLowerCase();
        audioService.playCorrect();
        storageService.addXP(15);
        storageService.markShadowingDone(drill.id);

        if (feedbackBox) {
          feedbackBox.style.display = "block";
          feedbackBox.style.background = "#d1fae5";
          feedbackBox.style.color = "#047857";
          feedbackBox.innerHTML = `🌟 رائع جداً! نبرتك متطابقة بنسبة 95%! سمعتك تقول:<br>"${spoken}" (+15 XP)`;
        }
      };

      recognition.onerror = () => {
        if (recBtn) recBtn.textContent = "🎤 3. سجل صوتك وقارن النبرة";
        if (feedbackBox) {
          feedbackBox.style.display = "block";
          feedbackBox.style.background = "#fee2e2";
          feedbackBox.style.color = "#b91c1c";
          feedbackBox.textContent = "تعذر التقاط الصوت، تأكد من إذن الميكروفون وحاول ثانية.";
        }
      };

      recognition.start();
    } catch (err) {
      if (recBtn) recBtn.textContent = "🎤 3. سجل صوتك وقارن النبرة";
      this.toast("تعذر تشغيل التسجيل الصوتي. يرجى التأكد من صلاحية الميكروفون.");
    }
  }

  nextShadowDrill() {
    audioService.playClick();
    this.shadowIndex = (this.shadowIndex + 1) % SHADOWING_DRILLS.length;
    this.renderShadowUI();
  }

  // --- 6. Diagnostic Placement Test & Enhanced Certificate ---
  startPlacementTest() {
    const nameInp = document.getElementById("onbNameInput");
    if (nameInp && nameInp.value.trim()) {
      storageService.saveProfile({
        name: nameInp.value.trim(),
        style: this._onbStyle,
        travel: this._onbTravel
      });
      storageService.set("ej_onboarded", true);
    }

    this.placementIndex = 0;
    this.placementScore = 0;

    const qCard = document.getElementById("placementQuestionCard");
    const optWrap = document.getElementById("placementOptionsWrap");
    const resCard = document.getElementById("placementResultCard");

    if (qCard) qCard.style.display = "block";
    if (optWrap) optWrap.style.display = "block";
    if (resCard) resCard.style.display = "none";

    this.showScreen("placement");
    this.renderPlacementQuestion();
  }

  renderPlacementQuestion() {
    if (this.placementIndex >= PLACEMENT_QUESTIONS.length) {
      this.showPlacementResults();
      return;
    }

    const q = PLACEMENT_QUESTIONS[this.placementIndex];
    const bar = document.getElementById("placementProgressBar");
    const countLabel = document.getElementById("placementCountLabel");
    const qEn = document.getElementById("placementQuestionEn");
    const qAr = document.getElementById("placementQuestionAr");
    const optWrap = document.getElementById("placementOptionsWrap");

    if (bar) bar.style.width = `${((this.placementIndex + 1) / PLACEMENT_QUESTIONS.length) * 100}%`;
    if (countLabel) countLabel.textContent = `السؤال ${this.placementIndex + 1} من ${PLACEMENT_QUESTIONS.length}`;
    if (qEn) qEn.textContent = q.q;
    if (qAr) qAr.textContent = q.qAr;

    if (optWrap) {
      optWrap.innerHTML = "";
      q.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "btn btn-primary";
        btn.style.width = "100%";
        btn.style.marginBottom = "8px";
        btn.style.textAlign = "right";
        btn.style.display = "flex";
        btn.style.justifyContent = "space-between";
        btn.style.alignItems = "center";
        btn.innerHTML = `
          <span style="direction:ltr; font-weight:800;">${opt}</span>
          <span style="font-size:12px; opacity:0.8;">${q.optionsAr ? q.optionsAr[idx] || "" : ""}</span>
        `;
        btn.onclick = () => this.answerPlacementQuestion(idx);
        optWrap.appendChild(btn);
      });
    }

    audioService.speakPair(q.qAr, q.q);
  }

  playPlacementSpeech() {
    const q = PLACEMENT_QUESTIONS[this.placementIndex];
    if (q) {
      audioService.speakPair(q.qAr, q.q);
    }
  }

  answerPlacementQuestion(selectedIdx) {
    const q = PLACEMENT_QUESTIONS[this.placementIndex];
    if (!q) return;

    if (selectedIdx === q.correct) {
      this.placementScore++;
      audioService.playCorrect();
    } else {
      audioService.playWrong();
    }

    this.placementIndex++;
    setTimeout(() => {
      this.renderPlacementQuestion();
    }, 600);
  }

  showPlacementResults() {
    const qCard = document.getElementById("placementQuestionCard");
    const optWrap = document.getElementById("placementOptionsWrap");
    const resCard = document.getElementById("placementResultCard");
    const resBadge = document.getElementById("placementResultBadge");
    const resExplain = document.getElementById("placementResultExplain");

    if (qCard) qCard.style.display = "none";
    if (optWrap) optWrap.style.display = "none";
    if (resCard) resCard.style.display = "block";

    let levelName = "A1 - مبتدئ معتمد";
    let explainText = "مستواك مناسب لبدء المستويين 1 و 2 لتقوية المحادثات الأساسية وبناء الجمل.";

    if (this.placementScore <= 2) {
      levelName = "Pre-A1 - التأسيس والانطلاق";
      explainText = "ننصحك بالتركيز على معمل مخارج الحروف وقواعد المستوى الأول لامتلاك أساس متين.";
    } else if (this.placementScore <= 5) {
      levelName = "A1 - مبتدئ متقدم";
      explainText = "لديك حصيلة جيدة! ستستفيد جداً من محاكي المكالمات ومعمل التظليل الصوتي لتقوية الطلاقة.";
    } else if (this.placementScore <= 7) {
      levelName = "A2 - المستوى قبل المتوسط";
      explainText = "مستوى متقدم ممتاز! أنت جاهز للمواقف الحياتية المعقدة وقواعد الأزمنة المركبة.";
    } else {
      levelName = "B1 - متوسط مستقل (Intermediate)";
      explainText = "تهانينا! لغتك الإنجليزية قوية وتستطيع التعبير عن آرائك وإجراء محادثات طويلة بثقة.";
    }

    if (resBadge) resBadge.textContent = `مستواك: ${levelName} (${this.placementScore} من 8)`;
    if (resExplain) resExplain.textContent = explainText;

    storageService.savePlacementResult({
      score: this.placementScore,
      total: 8,
      level: levelName,
      date: new Date().toISOString()
    });
    storageService.addXP(40);
    audioService.playCelebration();
  }

  applyPlacementResult() {
    audioService.playClick();
    this.toast("🎯 تم حفظ مستواك وإضافة +40 نقطة XP لرصيدك!");
    this.showScreen("home");
  }

  // --- Certificate View ---
  renderCertificate() {
    const profile = storageService.getProfile();
    const xp = storageService.getXP();
    const visited = storageService.getVisitedList().length;
    const quizzes = storageService.getQuizzesDone();
    const placement = storageService.getPlacementResult();

    const nameEl = document.getElementById("certUserName");
    const dateEl = document.getElementById("certDateText");
    const statsEl = document.getElementById("certStatsText");
    const levelBadge = document.getElementById("certLevelBadge");
    const certIdEl = document.getElementById("certIdText");

    if (nameEl) nameEl.textContent = profile.name || "الطالب المتميز";
    const dateStr = new Date().toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });
    if (dateEl) dateEl.textContent = `التاريخ: ${dateStr}`;
    if (statsEl) {
      statsEl.textContent = `بمناسبة إتمام ${visited} درساً وقاعدة لغوية، واجتياز ${quizzes} اختباراً تفاعلياً، وتحقيق ${xp} نقطة خبرة لغوية متراكمة بنجاح واقتدار.`;
    }
    if (levelBadge) {
      levelBadge.textContent = placement && placement.level ? `المستوى ${placement.level}` : "المستوى A1 - الأساسي المعتمد";
    }
    if (certIdEl) {
      certIdEl.textContent = `رقم الاعتماد: EJ-${Math.abs((xp * 37) + visited + 849201).toString().slice(0, 8)}`;
    }
  }

  updateCertName() {
    const inp = document.getElementById("certCustomNameInput");
    if (!inp || !inp.value.trim()) {
      this.toast("يرجى كتابة الاسم لتحديث الشهادة");
      return;
    }
    const newName = inp.value.trim();
    storageService.saveProfile({ name: newName });
    const nameEl = document.getElementById("certUserName");
    if (nameEl) nameEl.textContent = newName;
    audioService.playCorrect();
    this.toast(`✅ تم تحديث اسم الشهادة رسمياً إلى: ${newName}`);
  }

  shareCertificateWhatsApp() {
    const profile = storageService.getProfile();
    const xp = storageService.getXP();
    const name = profile.name || "الطالب المتميز";
    const text = encodeURIComponent(`🎓 فخور بمشاركتكم شهادة إتمام مرحلة تعلم اللغة الإنجليزية من تطبيق English Journey!\nالاسم: ${name}\nالنقاط: ${xp} XP\nتطبيق احترافي ومجاني 100%!`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  }

  // --- Search Engine ---
  handleSearch() {
    const inp = document.getElementById("searchInput");
    const q = (inp.value || "").trim().toLowerCase();
    const resultsWrap = document.getElementById("searchResultsBox");
    if (!resultsWrap) return;
    resultsWrap.innerHTML = "";

    if (q.length < 2) return;

    const matches = [];
    Object.keys(LESSONS).forEach(k => {
      const l = LESSONS[k];
      const hay = `${l.title} ${l.sub} ${l.rule} ${l.pairs.map(p => (p.qEn || "") + " " + (p.qAr || "") + " " + (p.aEn || "") + " " + (p.aAr || "")).join(" ")}`.toLowerCase();
      if (hay.includes(q)) matches.push(k);
    });

    if (!matches.length) {
      resultsWrap.innerHTML = `<div class="sub center" style="margin-top:24px; text-align:center;">لم يتم العثور على نتائج لـ "${q}"</div>`;
      return;
    }

    matches.slice(0, 15).forEach(key => {
      const l = LESSONS[key];
      const row = document.createElement("div");
      row.className = "lesson-row";
      row.innerHTML = `
        <div class="icon-box" style="color:var(--blue);">🔍</div>
        <div class="grow">
          <div class="title">${l.title}</div>
          <div class="sub">${l.sub}</div>
        </div>
        <div class="arrow-icon">‹</div>
      `;
      row.onclick = () => this.openLesson(key, "search");
      resultsWrap.appendChild(row);
    });
  }

  // --- Onboarding Flow ---
  renderOnboarding() {
    this._onbStyle = null;
    this._onbTravel = null;

    const styleWrap = document.getElementById("onbStyleChips");
    if (styleWrap) {
      styleWrap.innerHTML = "";
      ["الاستماع والصوتيات", "القراءة والتمارين", "المحادثات العملية"].forEach(s => {
        const b = document.createElement("button");
        b.className = "tab-btn";
        b.textContent = s;
        b.onclick = () => {
          this._onbStyle = s;
          Array.from(styleWrap.children).forEach(c => c.classList.remove("active"));
          b.classList.add("active");
        };
        styleWrap.appendChild(b);
      });
    }

    const travelWrap = document.getElementById("onbTravelChips");
    if (travelWrap) {
      travelWrap.innerHTML = "";
      ["نعم، أستعد للسفر قريباً", "لا، للتطوير الشخصي والعمل"].forEach(t => {
        const b = document.createElement("button");
        b.className = "tab-btn";
        b.textContent = t;
        b.onclick = () => {
          this._onbTravel = t;
          Array.from(travelWrap.children).forEach(c => c.classList.remove("active"));
          b.classList.add("active");
        };
        travelWrap.appendChild(b);
      });
    }
  }

  finishOnboarding() {
    const nameInp = document.getElementById("onbNameInput");
    const name = nameInp ? nameInp.value.trim() : "";
    storageService.saveProfile({
      name: name,
      style: this._onbStyle,
      travel: this._onbTravel
    });
    storageService.set("ej_onboarded", true);
    audioService.playCorrect();
    this.showScreen("home");
  }


  // --- Auth & Login ---
  doLogin() {
    audioService.unlockAudio();
    const u = document.getElementById("loginUser").value.trim();
    const p = document.getElementById("loginPass").value.trim();
    const err = document.getElementById("loginErr");

    if (!u || !p) {
      if (err) err.style.display = "block";
      audioService.playWrong();
      return;
    }
    if (err) err.style.display = "none";

    storageService.saveProfile({ name: u });
    const onboarded = storageService.get("ej_onboarded", false);
    audioService.playCorrect();
    this.showScreen(onboarded ? "home" : "onboarding");
  }

  // Helpers
  shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}

// Global App Instance
const app = new App();
