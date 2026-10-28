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
          card.innerHTML = `
            <div style="font-size:11px; font-weight:800; color:var(--blue); margin-bottom:2px;">سؤال Q</div>
            <div class="pair-en">${p.qEn}</div>
            <div class="pair-ar">${p.qAr}</div>
            <div style="font-size:11px; font-weight:800; color:var(--green); margin-top:10px; margin-bottom:2px;">إجابة A</div>
            <div class="pair-en">${p.aEn}</div>
            <div class="pair-ar">${p.aAr}</div>
            <div class="pair-audio-row">
              <button class="icon-btn" onclick="app.playPair(${idx}, 'ar')">🔊 عربي</button>
              <button class="icon-btn" onclick="app.playPair(${idx}, 'en')">🔊 English</button>
              <button class="icon-btn" onclick="app.playPair(${idx}, 'both')">🔊 الاستماع للاثنين</button>
            </div>
          `;
        } else {
          card.innerHTML = `
            <div class="pair-en">${p.en}</div>
            <div class="pair-ar">${p.ar}</div>
            <div class="pair-audio-row">
              <button class="icon-btn" onclick="app.playPair(${idx}, 'ar')">🔊 عربي</button>
              <button class="icon-btn" onclick="app.playPair(${idx}, 'en')">🔊 English</button>
              <button class="icon-btn" onclick="app.playPair(${idx}, 'both')">🔊 الاستماع للاثنين</button>
            </div>
          `;
        }
        pairsContainer.appendChild(card);
      });
    }

    this.showScreen("detail");
  }

  playPair(index, mode) {
    const item = LESSONS[this.currentLessonKey];
    if (!item || !item.pairs[index]) return;
    const p = item.pairs[index];
    const ar = p.qAr ? `${p.qAr} ... ${p.aAr}` : p.ar;
    const en = p.qEn ? `${p.qEn} ... ${p.aEn}` : p.en;
    audioService.speakSeq(ar, en, mode);
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
      const btn = document.createElement("button");
      btn.className = "btn btn-ghost";
      btn.style.cssText = "margin-bottom:9px; text-align:right; justify-content:flex-start; direction:ltr;";
      btn.textContent = optText;
      btn.onclick = () => this.answerQuiz(idx, btn);
      optWrap.appendChild(btn);
    });
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
      this.quizAnswered = true;
      this.quizScore++;
      audioService.playCorrect();
      storageService.addXP(5);
      const nb = document.getElementById("quizNextBtn");
      nb.style.display = "block";
      nb.textContent = this.quizIndex === this.quizList.length - 1 ? "عرض النتيجة 🏆" : "السؤال التالي ←";
    }
  }

  answerQuiz(choiceIdx, btnEl) {
    if (this.quizAnswered) return;
    const item = this.quizList[this.quizIndex];

    if (choiceIdx === item.correct) {
      this.quizAnswered = true;
      this.quizScore++;
      audioService.playCorrect();
      btnEl.style.background = "var(--green)";
      btnEl.style.color = "#ffffff";
      btnEl.style.borderColor = "var(--green)";

      const explainEl = document.getElementById("quizExplainBox");
      explainEl.style.display = "none";

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
      const b = document.createElement("button");
      b.className = "btn btn-ghost";
      b.style.cssText = "margin-bottom:10px; text-align:right; flex-direction:column; align-items:flex-start; padding:12px 14px;";
      b.innerHTML = `
        <span style="direction:ltr; text-align:left; font-weight:700; color:var(--text);">${opt.en}</span>
        <span style="font-size:12px; color:var(--text-muted); margin-top:3px;">${opt.ar}</span>
      `;
      b.onclick = () => this.answerTravelChoice(idx, b);
      optWrap.appendChild(b);
    });

    const exp = document.getElementById("travelFeedbackBox");
    exp.style.display = "none";

    const nextBtn = document.getElementById("travelNextBtn");
    nextBtn.style.display = "none";
  }

  answerTravelChoice(choiceIdx, btnEl) {
    if (this.travelDone) return;
    const stage = TRAVEL[this.travelKey].stages[this.travelIndex];
    const opt = stage.options[choiceIdx];

    const exp = document.getElementById("travelFeedbackBox");
    const nextBtn = document.getElementById("travelNextBtn");

    if (opt.best) {
      this.travelDone = true;
      audioService.playCorrect();
      btnEl.style.background = "var(--green)";
      btnEl.style.color = "#ffffff";
      btnEl.style.borderColor = "var(--green)";

      exp.style.display = "block";
      exp.style.color = "var(--green)";
      exp.textContent = `✅ ${opt.feedback}`;

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

  playTravelNpcSpeech() {
    const stage = TRAVEL[this.travelKey].stages[this.travelIndex];
    if (stage) {
      audioService.speakSeq(stage.npcAr, stage.npcEn, "both");
    }
  }

  // --- Speaking & Listening Practice ---
  startSpeakListen() {
    // Generate pool from lessons
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

    // Build distractors
    const distractors = this.shuffleArray(this.slPool.filter(x => x.en !== item.en)).slice(0, 2);
    const options = this.shuffleArray([item, ...distractors]);

    const wrap = document.getElementById("slListenOptionsWrap");
    wrap.innerHTML = "";
    options.forEach(opt => {
      const b = document.createElement("button");
      b.className = "btn btn-ghost";
      b.style.cssText = "margin-bottom:8px; text-align:right; direction:ltr;";
      b.textContent = opt.en;
      b.onclick = () => this.answerSLListen(opt === item, b);
      wrap.appendChild(b);
    });
  }

  playSLTargetSpeech() {
    const item = this.slPool[this.slIndex];
    if (item) audioService.speakSeq("", item.en, "en");
  }

  answerSLListen(isCorrect, btnEl) {
    if (this.slListenDone) return;
    if (isCorrect) {
      this.slListenDone = true;
      this.slScore++;
      audioService.playCorrect();
      btnEl.style.background = "var(--green)";
      btnEl.style.color = "#ffffff";
      storageService.addXP(4);
      setTimeout(() => this.showSLSpeakBox(), 400);
    } else {
      audioService.playWrong();
      btnEl.style.background = "#fee2e2";
      btnEl.style.color = "var(--red)";
      const exp = document.getElementById("slListenFeedback");
      exp.style.display = "block";
      exp.textContent = "استمع بدقة للجملة الإنجليزية وحاول مجدداً 🎧";
    }
  }

  showSLSpeakBox() {
    const item = this.slPool[this.slIndex];
    document.getElementById("slSpeakBox").style.display = "block";
    document.getElementById("slSpeakTargetEn").textContent = item.en;
    document.getElementById("slSpeakTargetAr").textContent = item.ar;

    const resultBox = document.getElementById("slSpeakResultBox");
    resultBox.style.display = "none";
    resultBox.innerHTML = "";

    const SR = audioService.getSpeechRecognition();
    const recBtn = document.getElementById("slRecordBtn");
    const fallbackMsg = document.getElementById("slSpeakFallbackMsg");

    if (!SR) {
      fallbackMsg.style.display = "block";
      recBtn.style.display = "none";
      document.getElementById("slNextBtn").style.display = "block";
    } else {
      fallbackMsg.style.display = "none";
      recBtn.style.display = "block";
      recBtn.disabled = false;
      recBtn.innerHTML = "🎤 اضغط وتحدث بالإنجليزية";
    }
  }

  startSLRecording() {
    const SR = audioService.getSpeechRecognition();
    if (!SR) return;

    const recBtn = document.getElementById("slRecordBtn");
    recBtn.disabled = true;
    recBtn.innerHTML = "🎙️ يستمع إليك الآن...";

    try {
      const rec = new SR();
      rec.lang = "en-US";
      rec.maxAlternatives = 1;
      rec.onresult = (e) => {
        const spoken = e.results[0][0].transcript;
        this.evaluateSLSpeech(spoken);
      };
      rec.onerror = () => {
        this.toast("تعذر التقاط الصوت، تأكد من إذن الميكروفون.");
        recBtn.disabled = false;
        recBtn.innerHTML = "🎤 اضغط وتحدث بالإنجليزية";
      };
      rec.onend = () => {
        recBtn.disabled = false;
        recBtn.innerHTML = "🎤 اضغط وتحدث بالإنجليزية";
      };
      rec.start();
    } catch (e) {
      this.toast("ميزة التعرف على الصوت غير مدعومة على جهازك.");
      recBtn.disabled = false;
      recBtn.innerHTML = "🎤 اضغط وتحدث بالإنجليزية";
    }
  }

  evaluateSLSpeech(spokenText) {
    const item = this.slPool[this.slIndex];
    const norm = s => (s || "").toLowerCase().replace(/[^a-z\s']/g, "").split(/\s+/).filter(Boolean);
    const targetWords = norm(item.en);
    const spokenWords = norm(spokenText);

    let html = `<div style="font-size:12px; color:var(--text-muted); margin-bottom:6px;">سمعتك تقول: "${spokenText}"</div>`;
    html += `<div style="direction:ltr; text-align:left; margin-bottom:10px; display:flex; flex-wrap:wrap; gap:6px;">`;

    let matches = 0;
    targetWords.forEach((word, i) => {
      const isMatch = spokenWords.includes(word);
      if (isMatch) matches++;
      html += `<span class="badge-tag" style="background:${isMatch ? 'var(--green)' : '#fee2e2'}; color:${isMatch ? '#fff' : 'var(--red)'};">${word}</span>`;
    });
    html += `</div>`;

    const pct = targetWords.length ? Math.round((matches / targetWords.length) * 100) : 0;
    html += `<div style="font-weight:800; color:${pct >= 70 ? 'var(--green)' : 'var(--gold-dark)'};">نسبة التطابق الصوتي: ${pct}٪</div>`;

    const resBox = document.getElementById("slSpeakResultBox");
    resBox.style.display = "block";
    resBox.innerHTML = html;

    if (pct >= 60) {
      audioService.playCorrect();
      storageService.addXP(6);
    }

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
      this.appendLumiMsg("bot", "أهلاً بك يا بطل! 👋 أنا لومي 🤖 مدرّبك الشخصي للغة الإنجليزية.\nاسألني أي سؤال عن القواعد، أو جرّب كتابة جملة بالإنجليزي وسأصححها لك فوراً!");
    }
  }

  appendLumiMsg(role, text) {
    const box = document.getElementById("lumiChatContainer");
    if (!box) return null;
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${role}`;
    bubble.textContent = text;
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
    const reply = await lumiService.ask(text);
    if (typingBubble) {
      typingBubble.textContent = reply;
    }
  }

  // --- What Should I Say Now? ("ماذا أقول الآن؟") ---
  resetWhatSay() {
    const resBox = document.getElementById("whatsayResultBox");
    if (resBox) resBox.style.display = "none";
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
  }

  playWhatSaySpeech() {
    if (this.currentSayEn) {
      audioService.speakSeq(this.currentSayAr, this.currentSayEn, "both");
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
  }

  testAudioVoices() {
    audioService.unlockAudio();
    const arPicked = audioService.getArabicVoice();
    const enPicked = audioService.getEnglishVoice();
    const arStatus = arPicked.voice ? (arPicked.isSaudi ? "عربي سعودي ✅" : "عربي قياسي ⚠️") : "غير متوفر ❌";
    const enStatus = enPicked.voice ? (enPicked.isHighQuality ? "إنجليزي عالي الجودة ✅" : "إنجليزي أساسي ⚠️") : "غير متوفر ❌";

    this.toast(`الأصوات: ${arStatus} | ${enStatus}`);
    audioService.speakSeq("مرحباً بك في رحلتي للإنجليزية", "Welcome to English Journey", "both");
  }

  // --- Certificate View ---
  renderCertificate() {
    const profile = storageService.getProfile();
    const xp = storageService.getXP();
    const visited = storageService.getVisitedList().length;
    const quizzes = storageService.getQuizzesDone();

    document.getElementById("certUserName").textContent = profile.name || "الطالب المتميز";
    const dateStr = new Date().toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });
    document.getElementById("certDateText").textContent = `صدرت بتاريخ: ${dateStr}`;
    document.getElementById("certStatsText").textContent = `بمناسبة إتمام ${visited} درساً وقاعدة لغوية، واجتياز ${quizzes} اختباراً تفاعلياً، وتحقيق ${xp} نقطة خبرة.`;
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

  startPlacementTest() {
    const nameInp = document.getElementById("onbNameInput");
    const name = nameInp ? nameInp.value.trim() : "";
    storageService.saveProfile({
      name: name,
      style: this._onbStyle,
      travel: this._onbTravel
    });
    this.openQuiz("placement", "onboarding");
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
