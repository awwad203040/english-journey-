// English Journey - Sentence Lego Builder Data
// Hands-on visual grammar construction kit for beginners

const LEGO_CHALLENGES = [
  {
    id: "lego_1",
    level: 1,
    title: "المضارع البسيط للمفرد (he/she/it)",
    titleEn: "Present Simple (Third Person -s)",
    targetAr: "هي تشرب عصير البرتقال كل صباح.",
    grammarTip: "قاعدة الليغو: عندما يكون الفاعل مفرد (He/She/It)، نضيف حرف (s) لنهاية الفعل الرئيسي!",
    slots: [
      { key: "subject", label: "الفاعل 👤", color: "#2563eb" },
      { key: "verb", label: "الفعل (+s) ⚡", color: "#f59e0b" },
      { key: "object", label: "المفعول به 📦", color: "#10b981" },
      { key: "time", label: "الزمان ⏰", color: "#8b5cf6" }
    ],
    blocks: [
      { text: "drinks", type: "verb", color: "#f59e0b" },
      { text: "She", type: "subject", color: "#2563eb" },
      { text: "orange juice", type: "object", color: "#10b981" },
      { text: "every morning", type: "time", color: "#8b5cf6" },
      // Distractors
      { text: "drink", type: "verb", color: "#f59e0b" },
      { text: "drinking", type: "verb", color: "#f59e0b" }
    ],
    correct: ["She", "drinks", "orange juice", "every morning"],
    sentenceEn: "She drinks orange juice every morning."
  },

  {
    id: "lego_2",
    level: 1,
    title: "المضارع المستمر (الحدث الجاري الآن)",
    titleEn: "Present Continuous (am/is/are + ing)",
    targetAr: "هم يلعبون كرة القدم في الحديقة الآن.",
    grammarTip: "قاعدة الليغو: الفعل المستمر يتكون من قطعتين لا تنفصلان: (am/is/are) + فعل ينتهي بـ (ing)!",
    slots: [
      { key: "subject", label: "الفاعل 👤", color: "#2563eb" },
      { key: "aux", label: "فعل مساعد 🧩", color: "#ec4899" },
      { key: "verb", label: "فعل مستمر (ing) ⚡", color: "#f59e0b" },
      { key: "object", label: "المفعول به ⚽", color: "#10b981" },
      { key: "place", label: "المكان 📍", color: "#06b6d4" }
    ],
    blocks: [
      { text: "They", type: "subject", color: "#2563eb" },
      { text: "are", type: "aux", color: "#ec4899" },
      { text: "playing", type: "verb", color: "#f59e0b" },
      { text: "football", type: "object", color: "#10b981" },
      { text: "in the park", type: "place", color: "#06b6d4" },
      // Distractors
      { text: "is", type: "aux", color: "#ec4899" },
      { text: "plays", type: "verb", color: "#f59e0b" }
    ],
    correct: ["They", "are", "playing", "football", "in the park"],
    sentenceEn: "They are playing football in the park."
  },

  {
    id: "lego_3",
    level: 2,
    title: "تكوين السؤال بـ Do / Does",
    titleEn: "Asking Questions with Do & Does",
    targetAr: "هل تتحدث اللغة الإنجليزية بطلاقة؟",
    grammarTip: "قاعدة الليغو في السؤال: نبدأ بالفعل المساعد أولاً (Do)، يليه الفاعل، ثم الفعل في المصدر بدون أي إضافات!",
    slots: [
      { key: "aux", label: "أداة السؤال ❓", color: "#ec4899" },
      { key: "subject", label: "الفاعل 👤", color: "#2563eb" },
      { key: "verb", label: "الفعل الأساسي ⚡", color: "#f59e0b" },
      { key: "object", label: "المفعول به 📦", color: "#10b981" },
      { key: "adv", label: "الحال 🌟", color: "#8b5cf6" }
    ],
    blocks: [
      { text: "Do", type: "aux", color: "#ec4899" },
      { text: "you", type: "subject", color: "#2563eb" },
      { text: "speak", type: "verb", color: "#f59e0b" },
      { text: "English", type: "object", color: "#10b981" },
      { text: "fluently?", type: "adv", color: "#8b5cf6" },
      // Distractors
      { text: "Does", type: "aux", color: "#ec4899" },
      { text: "speaks", type: "verb", color: "#f59e0b" }
    ],
    correct: ["Do", "you", "speak", "English", "fluently?"],
    sentenceEn: "Do you speak English fluently?"
  },

  {
    id: "lego_4",
    level: 2,
    title: "الماضي البسيط مع زمن محدد",
    titleEn: "Past Simple Tense",
    targetAr: "أنا زرت متحف لندن الصيف الماضي.",
    grammarTip: "قاعدة الليغو في الماضي: نستخدم التصريف الثاني للفعل بإضافة (ed) أو التصريف الشاذ!",
    slots: [
      { key: "subject", label: "الفاعل 👤", color: "#2563eb" },
      { key: "verb", label: "فعل ماضي ⚡", color: "#f59e0b" },
      { key: "object", label: "المكان / المفعول 🏛️", color: "#10b981" },
      { key: "time", label: "الزمن الماضي ⏰", color: "#8b5cf6" }
    ],
    blocks: [
      { text: "I", type: "subject", color: "#2563eb" },
      { text: "visited", type: "verb", color: "#f59e0b" },
      { text: "the London museum", type: "object", color: "#10b981" },
      { text: "last summer", type: "time", color: "#8b5cf6" },
      // Distractors
      { text: "visit", type: "verb", color: "#f59e0b" },
      { text: "am visiting", type: "verb", color: "#f59e0b" }
    ],
    correct: ["I", "visited", "the London museum", "last summer"],
    sentenceEn: "I visited the London museum last summer."
  },

  {
    id: "lego_5",
    level: 2,
    title: "النفي بـ doesn't للمفرد",
    titleEn: "Negative Sentences with Doesn't",
    targetAr: "هو لا يأكل الطعام الحار.",
    grammarTip: "قاعدة الليغو: كلمة (doesn't) تأخذ حرف الـ s من الفعل، فيرجع الفعل بعدها للمصدر بدون s!",
    slots: [
      { key: "subject", label: "الفاعل 👤", color: "#2563eb" },
      { key: "neg", label: "أداة النفي 🚫", color: "#ef4444" },
      { key: "verb", label: "فعل مجرد ⚡", color: "#f59e0b" },
      { key: "object", label: "المفعول به 🌶️", color: "#10b981" }
    ],
    blocks: [
      { text: "He", type: "subject", color: "#2563eb" },
      { text: "does not", type: "neg", color: "#ef4444" },
      { text: "eat", type: "verb", color: "#f59e0b" },
      { text: "spicy food", type: "object", color: "#10b981" },
      // Distractors
      { text: "eats", type: "verb", color: "#f59e0b" },
      { text: "do not", type: "neg", color: "#ef4444" }
    ],
    correct: ["He", "does not", "eat", "spicy food"],
    sentenceEn: "He does not eat spicy food."
  },

  {
    id: "lego_6",
    level: 3,
    title: "أفعال القدرة والنصيحة (Can & Should)",
    titleEn: "Modals: Can & Should",
    targetAr: "أنت تستطيع تحدث الإنجليزية بثقة تامة.",
    grammarTip: "قاعدة الليغو: الأفعال المساعدة المودال مثل (Can / Should) يأتي بعدها الفعل ناصعاً ومجرداً دائماً!",
    slots: [
      { key: "subject", label: "الفاعل 👤", color: "#2563eb" },
      { key: "modal", label: "فعل القدرة 🚀", color: "#8b5cf6" },
      { key: "verb", label: "فعل مجرد ⚡", color: "#f59e0b" },
      { key: "object", label: "المفعول به 💬", color: "#10b981" },
      { key: "adv", label: "الحال 🎯", color: "#06b6d4" }
    ],
    blocks: [
      { text: "You", type: "subject", color: "#2563eb" },
      { text: "can", type: "modal", color: "#8b5cf6" },
      { text: "speak", type: "verb", color: "#f59e0b" },
      { text: "English", type: "object", color: "#10b981" },
      { text: "with total confidence", type: "adv", color: "#06b6d4" },
      // Distractors
      { text: "can to", type: "modal", color: "#8b5cf6" },
      { text: "speaking", type: "verb", color: "#f59e0b" }
    ],
    correct: ["You", "can", "speak", "English", "with total confidence"],
    sentenceEn: "You can speak English with total confidence."
  }
];
