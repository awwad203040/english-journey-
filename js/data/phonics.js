// English Journey - Arab-English Phonics Lab Data
// Master the most challenging phonetic distinctions for Arabic native speakers

const PHONICS_TOPICS = {
  pb: {
    id: "pb",
    title: "الفرق بين P و B",
    titleEn: "P vs B (Voiceless vs Voiced)",
    icon: "💨",
    badge: "صوت انفجاري",
    desc: "أشهر فخ صوتي يقع فيه المتحدث العربي؛ اللغة العربية لا تحتوي على صوت P، فيميل اللسان لنطقها B.",
    howToProduce: "💡 سر النطق: ضع ورقة أمام شفتيك وانطق (P)، يجب أن تتحرك الورقة بسبب ضخ الهواء القوي بدون اهتزاز أوتارك الصوتية. بينما مع (B) تهتز الأوتار الصوتية ولا يخرج هواء قوي.",
    pairs: [
      { w1: "Park", w1Ar: "حديقة / يصف سيارة", w2: "Bark", w2Ar: "ينبح / لحاء شجر", ipa1: "/pɑːrk/", ipa2: "/bɑːrk/" },
      { w1: "Peach", w1Ar: "خوخ", w2: "Beach", w2Ar: "شاطئ البحر", ipa1: "/piːtʃ/", ipa2: "/biːtʃ/" },
      { w1: "Pen", w1Ar: "قلم حبر", w2: "Ben", w2Ar: "اسم علم (بن)", ipa1: "/pɛn/", ipa2: "/bɛn/" },
      { w1: "Pin", w1Ar: "دبوس", w2: "Bin", w2Ar: "سلة مهملات", ipa1: "/pɪn/", ipa2: "/bɪn/" },
      { w1: "Pear", w1Ar: "كمثرى", w2: "Bear", w2Ar: "دب", ipa1: "/pɛər/", ipa2: "/bɛər/" },
      { w1: "Pig", w1Ar: "خنزير", w2: "Big", w2Ar: "كبير الحجم", ipa1: "/pɪɡ/", ipa2: "/bɪɡ/" }
    ],
    quiz: [
      { target: "Park", options: ["Park", "Bark"], correct: 0, hint: "استمع هل خرج هواء انفجاري خفيف أم اهتزاز شفوي؟" },
      { target: "Beach", options: ["Peach", "Beach"], correct: 1, hint: "الكلمة تعني الشاطئ" },
      { target: "Pen", options: ["Pen", "Ben"], correct: 0, hint: "الكلمة تعني قلم" },
      { target: "Big", options: ["Pig", "Big"], correct: 1, hint: "الكلمة تعني كبير" }
    ]
  },

  th: {
    id: "th",
    title: "نطق حرفي TH (الثاء والذال)",
    titleEn: "TH Sounds: Voiced /ð/ & Voiceless /θ/",
    icon: "👅",
    badge: "مخرج طرف اللسان",
    desc: "تركيبة TH تعطي صوتين مختلفين تماماً، مثل حرفي الثاء والذال في اللغة العربية.",
    howToProduce: "💡 سر النطق: ضع طرف لسانك بلطف بين أسنانك العلوية والسفلية. إذا اهتزت حنجرتك فهو صوت الذال /ð/ مثل (This)، وإذا خرج هواء نقي فهو صوت الثاء /θ/ مثل (Think). لا تنطقها S أو Z أبداً!",
    pairs: [
      { w1: "Think", w1Ar: "يفكّر / يعتقد (صوت الثاء)", w2: "This", w2Ar: "هذا (صوت الذال)", ipa1: "/θɪŋk/", ipa2: "/ðɪs/" },
      { w1: "Three", w1Ar: "رقم 3 (صوت الثاء)", w2: "The", w2Ar: "ألـ التعريف (صوت الذال)", ipa1: "/θriː/", ipa2: "/ðə/" },
      { w1: "Thank", w1Ar: "يشكر (صوت الثاء)", w2: "That", w2Ar: "ذلك (صوت الذال)", ipa1: "/θæŋk/", ipa2: "/ðæt/" },
      { w1: "Teeth", w1Ar: "أسنان (صوت الثاء)", w2: "Breathe", w2Ar: "يتنفس (صوت الذال)", ipa1: "/tiːθ/", ipa2: "/briːð/" },
      { w1: "Bath", w1Ar: "حمام (صوت الثاء)", w2: "Bathe", w2Ar: "يستحم (صوت الذال)", ipa1: "/bɑːθ/", ipa2: "/beɪð/" }
    ],
    quiz: [
      { target: "Think", options: ["Think", "Sink"], correct: 0, hint: "احرص على إخراج طرف اللسان ولا تنطقها Sink!" },
      { target: "This", options: ["This", "Dis"], correct: 0, hint: "طرف اللسان بين الأسنان لصوت الذال /ð/" },
      { target: "Three", options: ["Three", "Tree"], correct: 0, hint: "تأكد من صوت الثاء وليس التاء كشجرة Tree!" }
    ]
  },

  vf: {
    id: "vf",
    title: "الفرق بين V و F",
    titleEn: "V vs F (Voiced vs Voiceless)",
    icon: "⚡",
    badge: "الأسنان والشفتين",
    desc: "صوت V يشبه F تماماً في مخرج الأسنان مع الشفة السفلى، لكن الفارق الوحيد هو تشغيل الأوتار الصوتية.",
    howToProduce: "💡 سر النطق: ضع أسنانك العلوية على شفتك السفلية. إذا أخرجت هواء فقط فهو (F). إذا شغلت صوت الحنجرة وشعرت باهتزاز وطنين فهو (V).",
    pairs: [
      { w1: "Van", w1Ar: "شاحنة صغيرة", w2: "Fan", w2Ar: "مروحة / معجب", ipa1: "/væn/", ipa2: "/fæn/" },
      { w1: "Very", w1Ar: "جداً", w2: "Ferry", w2Ar: "عبّارة بحرية", ipa1: "/ˈvɛri/", ipa2: "/ˈfɛri/" },
      { w1: "View", w1Ar: "إطلالة / منظر", w2: "Few", w2Ar: "قليل من", ipa1: "/vjuː/", ipa2: "/fjuː/" },
      { w1: "Save", w1Ar: "يحفظ / ينقذ", w2: "Safe", w2Ar: "آمن / خزنة", ipa1: "/seɪv/", ipa2: "/seɪf/" },
      { w1: "Leave", w1Ar: "يغادر", w2: "Leaf", w2Ar: "ورقة شجر", ipa1: "/liːv/", ipa2: "/liːf/" }
    ],
    quiz: [
      { target: "Van", options: ["Van", "Fan"], correct: 0, hint: "استمع لصوت الطنين الحنجري في بداية الكلمة" },
      { target: "Very", options: ["Very", "Ferry"], correct: 0, hint: "Very تعني جداً" },
      { target: "Safe", options: ["Save", "Safe"], correct: 1, hint: "Safe تنتهي بصوت F النقي بدون اهتزاز" }
    ]
  },

  silent: {
    id: "silent",
    title: "الحروف الصامتة السحرية",
    titleEn: "Silent Letters Masterclass",
    icon: "🤫",
    badge: "تُكتب ولا تُنطق",
    desc: "في الإنجليزية الكثير من الحروف التي تُكتب لأسباب تاريخية لكنها لا تُنطق إطلاقاً.",
    howToProduce: "💡 القاعدة الذهبية: احفظ هذه الأنماط الشائعة: K قبل N صامتة (Knife)، W قبل R صامتة (Write)، B بعد M صامتة (Climb)، H بعد W غالباً صامتة (What).",
    pairs: [
      { w1: "Knife", w1Ar: "سكين (الـ K صامتة!)", w2: "Knee", w2Ar: "ركبة (الـ K صامتة!)", ipa1: "/naɪf/", ipa2: "/niː/" },
      { w1: "Write", w1Ar: "يكتب (الـ W صامتة!)", w2: "Wrong", w2Ar: "خطأ (الـ W صامتة!)", ipa1: "/raɪt/", ipa2: "/rɒŋ/" },
      { w1: "Doubt", w1Ar: "شك (الـ B صامتة!)", w2: "Debt", w2Ar: "دَين مالي (الـ B صامتة!)", ipa1: "/daʊt/", ipa2: "/dɛt/" },
      { w1: "Listen", w1Ar: "يستمع (الـ T صامتة!)", w2: "Castle", w2Ar: "قلعة (الـ T صامتة!)", ipa1: "/ˈlɪsən/", ipa2: "/ˈkɑːsəl/" },
      { w1: "Half", w1Ar: "نصف (الـ L صامتة!)", w2: "Talk", w2Ar: "يتحدث (الـ L صامتة!)", ipa1: "/hɑːf/", ipa2: "/tɔːk/" },
      { w1: "Hour", w1Ar: "ساعة زمنية (الـ H صامتة!)", w2: "Honest", w2Ar: "صادق / أمين (الـ H صامتة!)", ipa1: "/ˈaʊər/", ipa2: "/ˈɒnɪst/" }
    ],
    quiz: [
      { target: "Knife", options: ["Knife", "Kanife"], correct: 0, hint: "حرف K لا يُنطق أبداً قبل N!" },
      { target: "Listen", options: ["Listen", "List-en"], correct: 0, hint: "حرف T صامت تماماً في كلمة Listen" },
      { target: "Hour", options: ["Hour", "Howr"], correct: 0, hint: "حرف H صامت، وتبدأ الكلمة بصوت العلة Ow!" }
    ]
  },

  vowels: {
    id: "vowels",
    title: "حروف العلة: القصيرة والطويلة",
    titleEn: "Short vs Long Vowels",
    icon: "🎵",
    badge: "موسيقى اللغة",
    desc: "مدّ الصوت أو قصره يغير معنى الكلمة كلياً في الإنجليزية.",
    howToProduce: "💡 سر النطق: صوت /ɪ/ القصير يُنطق بخطف سريع دون ابتسامة عريضة (Ship)، بينما صوت /iː/ الطويل يحتاج لابتسامة واضحة ومطّ الصوت ثانية واحدة (Sheep).",
    pairs: [
      { w1: "Ship", w1Ar: "سفينة (صوت قصير)", w2: "Sheep", w2Ar: "خروف (صوت طويل وممدود)", ipa1: "/ʃɪp/", ipa2: "/ʃiːp/" },
      { w1: "Fit", w1Ar: "لائق بدنياً (قصير)", w2: "Feet", w2Ar: "أقدام (طويل وممدود)", ipa1: "/fɪt/", ipa2: "/fiːt/" },
      { w1: "Bit", w1Ar: "قطعة صغيرة (قصير)", w2: "Beat", w2Ar: "يهزم / نبضة (طويل)", ipa1: "/bɪt/", ipa2: "/biːt/" },
      { w1: "Pull", w1Ar: "يسحب (قصير)", w2: "Pool", w2Ar: "مسبح (طويل وممدود)", ipa1: "/pʊl/", ipa2: "/puːl/" },
      { w1: "Sit", w1Ar: "يجلس (قصير)", w2: "Seat", w2Ar: "مقعد (طويل وممدود)", ipa1: "/sɪt/", ipa2: "/siːt/" }
    ],
    quiz: [
      { target: "Sheep", options: ["Ship", "Sheep"], correct: 1, hint: "استمع للمدّ الطويل في صوت ee" },
      { target: "Fit", options: ["Fit", "Feet"], correct: 0, hint: "نطق خاطف وسريع" },
      { target: "Pool", options: ["Pull", "Pool"], correct: 1, hint: "Pool تعني مسبح مع مد حرف الواو oo" }
    ]
  }
};
