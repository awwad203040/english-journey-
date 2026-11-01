// English Journey - Local Persistence & State Management Service

class StorageService {
  constructor() {
    this.KEYS = {
      XP: "ej_xp",
      STREAK: "ej_streak",
      LAST_VISIT: "ej_last_visit",
      VISITED: "ej_visited",
      LAST_LESSON: "ej_last_lesson",
      QUIZZES_DONE: "ej_quizzes_done",
      ERRORS: "ej_errors",
      PROFILE: "ej_profile",
      PLAN_SETUP: "ej_plan_setup",
      PLAN_DONE: "ej_plan_done",
      GAME_BEST: "ej_game_best",
      THEME: "ej_theme",
      ONBOARDED: "ej_onboarded",
      TRIAL_START: "ej_trial_start",
      SUBSCRIBED: "ej_subscribed",
      SFX: "ej_sfx_enabled",
      VOICE_RATE: "ej_voice_rate"
    };
    this.initTrial();
  }

  get(key, fallback = null) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn("Storage write failed", e);
    }
  }

  // XP & Levels
  getXP() {
    return Number(this.get(this.KEYS.XP, 0));
  }

  addXP(points) {
    const next = this.getXP() + points;
    this.set(this.KEYS.XP, next);
    return next;
  }

  getUserLevel() {
    const xp = this.getXP();
    if (xp < 50) return { num: 1, name: "مبتدئ طموح", badge: "🌱", nextThreshold: 50 };
    if (xp < 150) return { num: 2, name: "مستكشف نشيط", badge: "🧭", nextThreshold: 150 };
    if (xp < 300) return { num: 3, name: "متحدث واثق", badge: "🗣️", nextThreshold: 300 };
    if (xp < 500) return { num: 4, name: "محاور متمكن", badge: "💼", nextThreshold: 500 };
    if (xp < 800) return { num: 5, name: "متقن للطلاقة", badge: "🌟", nextThreshold: 800 };
    return { num: 6, name: "خبير الإنجليزية", badge: "👑", nextThreshold: 1500 };
  }

  // Streaks
  touchStreak() {
    const today = new Date().toDateString();
    const last = this.get(this.KEYS.LAST_VISIT, null);
    if (last === today) return this.getStreak();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let streak = this.getStreak();
    if (last === yesterday.toDateString()) {
      streak += 1;
    } else {
      streak = 1;
    }
    this.set(this.KEYS.STREAK, streak);
    this.set(this.KEYS.LAST_VISIT, today);
    return streak;
  }

  getStreak() {
    return Number(this.get(this.KEYS.STREAK, 0));
  }

  // Completed & Visited Lessons
  getVisitedList() {
    return this.get(this.KEYS.VISITED, []);
  }

  markLessonVisited(key) {
    const list = this.getVisitedList();
    if (!list.includes(key)) {
      list.push(key);
      this.set(this.KEYS.VISITED, list);
      this.addXP(10);
    }
    this.set(this.KEYS.LAST_LESSON, key);
  }

  getLastLesson() {
    return this.get(this.KEYS.LAST_LESSON, null);
  }

  // Quizzes Completed
  getQuizzesDone() {
    return Number(this.get(this.KEYS.QUIZZES_DONE, 0));
  }

  incQuizzesDone() {
    const next = this.getQuizzesDone() + 1;
    this.set(this.KEYS.QUIZZES_DONE, next);
    this.addXP(15);
    return next;
  }

  // Error Memory
  getErrorMemory() {
    return this.get(this.KEYS.ERRORS, []);
  }

  logMistake(topicKey, item) {
    const errors = this.getErrorMemory();
    const existing = errors.find(e => e.q === item.q);
    if (existing) {
      existing.count = (existing.count || 1) + 1;
    } else {
      errors.push({
        topicKey: topicKey,
        q: item.q,
        options: item.options,
        correct: item.correct,
        explain: item.explain || "",
        count: 1,
        loggedAt: new Date().toISOString()
      });
    }
    this.set(this.KEYS.ERRORS, errors);
  }

  forgetError(questionText) {
    const errors = this.getErrorMemory().filter(e => e.q !== questionText);
    this.set(this.KEYS.ERRORS, errors);
  }

  clearErrors() {
    this.set(this.KEYS.ERRORS, []);
  }

  // User Profile
  getProfile() {
    return this.get(this.KEYS.PROFILE, { name: "", style: null, travel: null, level: null });
  }

  saveProfile(profileObj) {
    const curr = this.getProfile();
    this.set(this.KEYS.PROFILE, { ...curr, ...profileObj });
  }

  // Lumi Personal Study Plan
  getPlanSetup() {
    return this.get(this.KEYS.PLAN_SETUP, null);
  }

  savePlanSetup(setupObj) {
    this.set(this.KEYS.PLAN_SETUP, setupObj);
    this.set(this.KEYS.PLAN_DONE, []);
  }

  getPlanDone() {
    return this.get(this.KEYS.PLAN_DONE, []);
  }

  markPlanDone(dayNumber) {
    const done = this.getPlanDone();
    if (!done.includes(dayNumber)) {
      done.push(dayNumber);
      this.set(this.KEYS.PLAN_DONE, done);
      this.addXP(10);
    }
  }

  resetPlan() {
    this.set(this.KEYS.PLAN_SETUP, null);
    this.set(this.KEYS.PLAN_DONE, []);
  }

  // Mini-game best score
  getGameBest() {
    return Number(this.get(this.KEYS.GAME_BEST, 0));
  }

  setGameBest(score) {
    const current = this.getGameBest();
    if (score > current) {
      this.set(this.KEYS.GAME_BEST, score);
    }
  }

  // Theme & Settings
  getTheme() {
    return this.get(this.KEYS.THEME, "light");
  }

  setTheme(theme) {
    this.set(this.KEYS.THEME, theme);
  }

  getSfxEnabled() {
    return this.get(this.KEYS.SFX, true) !== false;
  }

  setSfxEnabled(val) {
    this.set(this.KEYS.SFX, !!val);
  }

  getSpeechRate() {
    return Number(this.get(this.KEYS.VOICE_RATE, 0.9)) || 0.9;
  }

  setSpeechRate(rate) {
    this.set(this.KEYS.VOICE_RATE, Number(rate) || 0.9);
  }

  // Trial & Access
  initTrial() {
    if (!this.get(this.KEYS.TRIAL_START)) {
      this.set(this.KEYS.TRIAL_START, new Date().toISOString());
    }
  }

  getTrialDaysLeft(totalDays = 7) {
    const startStr = this.get(this.KEYS.TRIAL_START);
    if (!startStr) return totalDays;
    const diffDays = Math.floor((Date.now() - new Date(startStr).getTime()) / 86400000);
    return Math.max(0, totalDays - diffDays);
  }

  isSubscribed() {
    return this.get(this.KEYS.SUBSCRIBED, false) === true;
  }

  setSubscribed(val) {
    this.set(this.KEYS.SUBSCRIBED, val);
  }

  hasFullAccess(forceFree = true) {
    if (forceFree) return true;
    return this.isSubscribed() || this.getTrialDaysLeft() > 0;
  }
}

const storageService = new StorageService();
