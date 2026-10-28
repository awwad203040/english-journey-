// English Journey - English World Landmarks & Progression Map

const WORLD_LOCATIONS = [
  {
    id: "home",
    icon: "🏠",
    title: "المنزل والعائلة",
    sub: "Family & Everyday Life",
    desc: "ابدأ من محيطك المألوف: الحديث عن أفراد العائلة، المنزل، والروتين اليومي.",
    color: "#2563EB",
    unlockAt: 0,
    lessonKey: "family"
  },
  {
    id: "restaurant",
    icon: "🍽️",
    title: "المطعم والمأكولات",
    sub: "Dining & Ordering",
    desc: "تعلّم كيف تطلب طعامك المفضل في المطاعم وتسأل عن المكونات والحساب بثقة.",
    color: "#F97316",
    unlockAt: 2,
    lessonKey: "restaurant"
  },
  {
    id: "school",
    icon: "🏫",
    title: "المدرسة والتعلم",
    sub: "School & Study",
    desc: "محادثات الفصول الدراسية، تكوين الأصدقاء، والمناقشات التعليمية اليومية.",
    color: "#10B981",
    unlockAt: 4,
    lessonKey: "daily"
  },
  {
    id: "travel",
    icon: "✈️",
    title: "المطار الدولي",
    sub: "Airports & Flights",
    desc: "تعلّم إجراءات السفر، الجوازات، استلام الأمتعة، والصعود للطائرة دون ارتباك.",
    color: "#8B5CF6",
    unlockAt: 6,
    travelKey: "airport_hotel"
  },
  {
    id: "shopping",
    icon: "🛍️",
    title: "المجمع التجاري",
    sub: "Shopping & Fashion",
    desc: "التسوق للملابس، البحث عن المقاسات، السؤال عن الخصومات، وطرق الدفع الحديثة.",
    color: "#EF4444",
    unlockAt: 8,
    lessonKey: "shopping"
  },
  {
    id: "hospital",
    icon: "🏥",
    title: "المركز الطبي",
    sub: "Healthcare & Clinics",
    desc: "وصف الأعراض بوضوح للطبيب، حجز المواعيد، وصرف الأدوية من الصيدلية.",
    color: "#06B6D4",
    unlockAt: 10,
    lessonKey: "health"
  },
  {
    id: "office",
    icon: "🏢",
    title: "برج الأعمال",
    sub: "Work & Corporations",
    desc: "لغة الاجتماعات، كتابة رسائل العمل المهنية، وإدارة المواعيد النهائية للمشاريع.",
    color: "#64748B",
    unlockAt: 12,
    lessonKey: "office"
  },
  {
    id: "university",
    icon: "🎓",
    title: "الجامعة والبحوث",
    sub: "Higher Education",
    desc: "النقاشات الأكاديمية المتقدمة، التعبير عن الآراء، والتحضير للماجستير والمنح.",
    color: "#D97706",
    unlockAt: 15,
    lessonKey: "university"
  }
];
