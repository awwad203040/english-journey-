// English Journey - Speech Shadowing Lab Data
// Master native cadence, rhythm, and stress through immediate vocal shadowing

const SHADOWING_DRILLS = [
  {
    id: "sh_1",
    category: "التحيات اليومية والتعارف",
    icon: "🤝",
    textEn: "It is really nice to finally meet you in person!",
    textAr: "من اللطيف حقاً مقابلتك شخصياً أخيراً!",
    stressWords: ["really", "nice", "finally", "meet", "person"],
    tip: "ركز على نبرة الحماس في كلمة 'really' ومدّ كلمة 'nice' بانسيابية."
  },
  {
    id: "sh_2",
    category: "المطاعم والطلبات",
    icon: "🍽️",
    textEn: "Excuse me, could we please have the bill whenever you are ready?",
    textAr: "لو سمحت، هل يمكننا الحصول على الفاتورة عندما تكون جاهزاً؟",
    stressWords: ["Excuse", "could", "please", "bill", "ready"],
    tip: "ابدأ بنبرة مهذبة هادئة مع ارتفاع طفيف في نبرة الصوت عند كلمة 'ready'."
  },
  {
    id: "sh_3",
    category: "السفر والمطارات",
    icon: "✈️",
    textEn: "Which terminal do I need to go to for international flights?",
    textAr: "أي صالة أحتاج للذهاب إليها من أجل الرحلات الدولية؟",
    stressWords: ["Which", "terminal", "need", "international", "flights"],
    tip: "ركز على ضغط المقطع الصوتي الأول في كلمة 'TER-mi-nal'."
  },
  {
    id: "sh_4",
    category: "التسوق والأسعار",
    icon: "🛍️",
    textEn: "Do you happen to have this exact jacket in a medium size?",
    textAr: "هل يتوفر لديكم بالصدفة نفس هذه السترة بحجم متوسط؟",
    stressWords: ["exact", "jacket", "medium", "size"],
    tip: "اربط بين كلمتي 'this' و 'exact' لتصبح مثل كلمة واحدة سلسة 'this-exact'."
  },
  {
    id: "sh_5",
    category: "المشاعر والاطمئنان",
    icon: "❤️",
    textEn: "Do not worry about anything, everything is going to be completely fine.",
    textAr: "لا تقلق بشأن أي شيء، كل شيء سيكون على ما يرام تماماً.",
    stressWords: ["worry", "everything", "completely", "fine"],
    tip: "اجعل نبرة صوتك دافئة ومطمئنة مع إعطاء ثقل لكلمة 'fine'."
  },
  {
    id: "sh_6",
    category: "العمل والاجتماعات",
    icon: "💼",
    textEn: "Thank you all for your time, and I look forward to working together.",
    textAr: "شكراً لكم جميعاً على وقتكم، وأتطلع بحماس للعمل معاً.",
    stressWords: ["Thank", "time", "look", "forward", "working", "together"],
    tip: "انطق 'look forward to' بدمج صوتي طبيعي ونبرة احترافية واثقة."
  },
  {
    id: "sh_7",
    category: "الاتجاهات في الشارع",
    icon: "🗺️",
    textEn: "Go straight ahead for two blocks, then take a sharp right turn.",
    textAr: "امشِ للأمام مباشرة لمسافة مبنيين، ثم انعطف يميناً مباشرة.",
    stressWords: ["straight", "two", "blocks", "sharp", "right"],
    tip: "استخدم إيقاعاً حازماً وواضحاً كأنك ترسم الخريطة بصوتك."
  },
  {
    id: "sh_8",
    category: "الاعتذار واللباقة",
    icon: "🙏",
    textEn: "I am terribly sorry for keeping you waiting so long.",
    textAr: "أنا آسف بشدة لأنني جعلتك تنتظر طوال هذه المدة.",
    stressWords: ["terribly", "sorry", "waiting", "long"],
    tip: "اضغط بنبرة صدق واضحة على كلمة 'terribly' ثم اخفض نبرتك في النهاية."
  }
];
