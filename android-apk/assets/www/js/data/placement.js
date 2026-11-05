// English Journey - Diagnostic Placement Test Data
// Evaluates CEFR baseline proficiency (Pre-A1, A1, A2, B1) in 3 minutes

const PLACEMENT_QUESTIONS = [
  {
    id: "place_1",
    q: "Hello! My name is John. ______ are you from?",
    qAr: "مرحباً! اسمي جون. من ______ أنت؟",
    options: ["Where", "What", "Who", "When"],
    optionsAr: ["من أين", "ماذا", "من (للأشخاص)", "متى"],
    correct: 0,
    explain: "نستخدم Where للسؤال عن المكان والأصل والبلد (Where are you from?).",
    levelPoint: "pre_a1"
  },
  {
    id: "place_2",
    q: "She ______ a cup of coffee every morning before work.",
    qAr: "هي ______ فنجان قهوة كل صباح قبل العمل.",
    options: ["drinks", "drink", "drinking", "drank"],
    optionsAr: ["تشرب (مع s المفرد)", "يشرب (مجرد)", "تشرب مستمر", "شربت بالماضي"],
    correct: 0,
    explain: "مع الفاعل المفرد الغائب (She) في المضارع البسيط للروتين اليومي، نضيف (s) للفعل (drinks).",
    levelPoint: "a1"
  },
  {
    id: "place_3",
    q: "Excuse me, how ______ is this blue shirt?",
    qAr: "لو سمحت، كم ______ سعر هذا القميص الأزرق؟",
    options: ["much", "many", "long", "old"],
    optionsAr: ["السعر (كم ثمن)", "العدد (كم عدد)", "الطول / المدة", "العمر"],
    correct: 0,
    explain: "نستخدم (How much) للسؤال عن سعر وثمن الأشياء.",
    levelPoint: "a1"
  },
  {
    id: "place_4",
    q: "Yesterday evening, we ______ a fantastic dinner at the Italian restaurant.",
    qAr: "مساء الأمس، نحن ______ عشاءً رائعاً في المطعم الإيطالي.",
    options: ["had", "have", "having", "has"],
    optionsAr: ["تناولنا (ماضي have)", "نتناول", "نتناول مستمر", "يتناول للمفرد"],
    correct: 0,
    explain: "كلمة (Yesterday) تدل على الماضي البسيط، والتصريف الماضي لـ have هو had.",
    levelPoint: "a1_plus"
  },
  {
    id: "place_5",
    q: "Look outside! The dark clouds are gathering, it ______ rain very soon.",
    qAr: "انظر في الخارج! الغيوم الداكنة تتجمع، إنها ______ تمطر قريباً جداً.",
    options: ["is going to", "will to", "is", "was"],
    optionsAr: ["سوف (بناءً على دليل مرئي)", "سوف مع to (خاطئة)", "تكون", "كانت"],
    correct: 0,
    explain: "نستخدم (is going to) للتنبؤ بحدث في المستقبل القريب بناءً على دليل مرئي واضح (الغيوم).",
    levelPoint: "a2"
  },
  {
    id: "place_6",
    q: "I have lived in this beautiful city ______ five years.",
    qAr: "أنا أعيش في هذه المدينة الجميلة ______ خمس سنوات.",
    options: ["for", "since", "at", "during"],
    optionsAr: ["لمدة (فترة زمنية كاملة)", "منذ (بداية نقطة زمنية)", "في", "أثناء"],
    correct: 0,
    explain: "نستخدم (for) مع طول المدة الإجمالية (for five years)، بينما since تُستخدم مع بداية التاريخ مثل since 2021.",
    levelPoint: "a2"
  },
  {
    id: "place_7",
    q: "If I miss the bus this morning, I ______ a taxi to the office.",
    qAr: "إذا فاتني الحافلة هذا الصباح، فسوف ______ تاكسي إلى المكتب.",
    options: ["will take", "took", "have taken", "taking"],
    optionsAr: ["سوف أستقل (مستقبل بسيط)", "استقللت", "قد استقللت", "مستقل"],
    correct: 0,
    explain: "في قاعدة الشرط الأولى (First Conditional): جملة If تكون مضارع بسيط وجواب الشرط يكون (will + المصدر).",
    levelPoint: "a2_plus"
  },
  {
    id: "place_8",
    q: "Could you please tell me where the nearest metro station ______?",
    qAr: "هل يمكنك إخباري من فضلك أين ______ أقرب محطة مترو؟",
    options: ["is", "is it", "it is", "are"],
    optionsAr: ["تكون (في نهاية السؤال غير المباشر)", "تكون هي (ترتيب سؤال عادي)", "هي تكون", "للجمع"],
    correct: 0,
    explain: "في الأسئلة غير المباشرة والمهذبة (Indirect Questions) يأتي الفعل المساعد في نهاية الجملة بعد الفاعل.",
    levelPoint: "b1"
  }
];
