// English Journey - Lumi Voice Call Simulator Data
// Realistic beginner phone call scenarios with interactive conversational flows

const LUMI_CALL_SCENARIOS = {
  coffee: {
    id: "coffee",
    title: "طلب قهوة من المقهى",
    titleEn: "Ordering at a Cafe",
    icon: "☕",
    callerName: "Lumi - Barista",
    callerRole: "نادل في مقهى ستاربكس",
    stages: [
      {
        lumiEn: "Hello! Welcome to Coffee House. What can I get for you today?",
        lumiAr: "أهلاً بك في كوفي هاوس! ماذا تحب أن تطلب اليوم؟",
        suggestedReplies: [
          { en: "I would like a caramel latte, please.", ar: "أريد كراميل لاتيه، من فضلك.", isBest: true },
          { en: "Can I have an iced Americano?", ar: "هل يمكنني الحصول على أمريكانو مثلج؟", isBest: true },
          { en: "Just a hot black coffee, please.", ar: "فقط قهوة سوداء ساخنة، من فضلك.", isBest: true }
        ],
        keywords: ["latte", "coffee", "americano", "cappuccino", "tea", "please", "like"]
      },
      {
        lumiEn: "Great choice! What size would you like: small, medium, or large?",
        lumiAr: "اختيار رائع! ما الحجم الذي تفضله: صغير، متوسط، أم كبير؟",
        suggestedReplies: [
          { en: "Medium size, please.", ar: "حجم متوسط، من فضلك.", isBest: true },
          { en: "A large cup, please.", ar: "كوب كبير، من فضلك.", isBest: true },
          { en: "Small size is fine.", ar: "الحجم الصغير مناسب.", isBest: true }
        ],
        keywords: ["small", "medium", "large", "size", "cup"]
      },
      {
        lumiEn: "Perfect! Would you like that hot or iced?",
        lumiAr: "تمام! هل تحبها ساخنة أم مثلجة؟",
        suggestedReplies: [
          { en: "Iced, please.", ar: "مثلجة، من فضلك.", isBest: true },
          { en: "Hot, please.", ar: "ساخنة، من فضلك.", isBest: true },
          { en: "With extra ice, please.", ar: "مع ثلج إضافي، من فضلك.", isBest: true }
        ],
        keywords: ["hot", "iced", "ice", "cold"]
      },
      {
        lumiEn: "Is it for here or to go?",
        lumiAr: "هل ستشربها هنا أم تأخذها معك للخارج؟",
        suggestedReplies: [
          { en: "To go, please.", ar: "سفري (للخارج)، من فضلك.", isBest: true },
          { en: "For here, please.", ar: "محلي (هنا)، من فضلك.", isBest: true },
          { en: "Takeaway, thank you.", ar: "سفري، شكراً لك.", isBest: true }
        ],
        keywords: ["to go", "here", "takeaway", "out"]
      },
      {
        lumiEn: "All done! That will be four dollars. Your coffee will be ready in two minutes. Have a wonderful day!",
        lumiAr: "تم كل شيء! الحساب 4 دولارات. قهوتك ستكون جاهزة خلال دقيقتين. أتمنى لك يوماً رائعاً!",
        suggestedReplies: [
          { en: "Thank you so much! Have a great day!", ar: "شكراً جزيلاً لك! يوماً سعيداً!", isBest: true },
          { en: "Here is the money. Thank you!", ar: "تفضل المبلغ. شكراً لك!", isBest: true }
        ],
        keywords: ["thank", "thanks", "money", "day", "bye"]
      }
    ]
  },

  hotel: {
    id: "hotel",
    title: "مكالمة استقبال الفندق",
    titleEn: "Hotel Reception Call",
    icon: "🏨",
    callerName: "Lumi - Receptionist",
    callerRole: "موظف استقبال فندق جراند",
    stages: [
      {
        lumiEn: "Good afternoon, Grand Hotel reception. How may I assist you today?",
        lumiAr: "مساء الخير، استقبال فندق جراند. كيف يمكنني مساعدتك اليوم؟",
        suggestedReplies: [
          { en: "Hello, I would like to check in, please.", ar: "مرحباً، أود تسجيل الوصول، من فضلك.", isBest: true },
          { en: "Hi, I have a room reservation under my name.", ar: "أهلاً، لدي حجز غرفة باسمي.", isBest: true }
        ],
        keywords: ["check in", "reservation", "booking", "room", "assist", "name"]
      },
      {
        lumiEn: "Welcome! May I have your full name and booking confirmation number?",
        lumiAr: "أهلاً وسهلاً بك! هل يمكنني الحصول على اسمك الكامل ورقم تأكيد الحجز؟",
        suggestedReplies: [
          { en: "My name is Ahmed, and my booking number is 402.", ar: "اسمي أحمد، ورقم حجزي هو 402.", isBest: true },
          { en: "Here is my passport and confirmation email.", ar: "تفضل جواز سفري والبريد الإلكتروني للتأكيد.", isBest: true }
        ],
        keywords: ["name", "booking", "number", "passport", "email", "ahmed"]
      },
      {
        lumiEn: "Thank you, Ahmed. Your deluxe room on the fifth floor is ready. Would you like a non-smoking room?",
        lumiAr: "شكراً لك يا أحمد. غرفتك الفاخرة بالطابق الخامس جاهزة. هل تفضل غرفة لغير المدخنين؟",
        suggestedReplies: [
          { en: "Yes, non-smoking, please.", ar: "نعم، لغير المدخنين من فضلك.", isBest: true },
          { en: "Yes, that would be wonderful.", ar: "نعم، هذا سيكون رائعاً.", isBest: true }
        ],
        keywords: ["yes", "smoking", "non", "room", "please"]
      },
      {
        lumiEn: "Here is your keycard. Breakfast is served from 7 to 10 AM. Enjoy your stay with us!",
        lumiAr: "تفضل بطاقة غرفتك. الإفطار يُقدّم من 7 إلى 10 صباحاً. استمتع بإقامتك معنا!",
        suggestedReplies: [
          { en: "Thank you very much for your help!", ar: "شكراً جزيلاً لمساعدتك!", isBest: true },
          { en: "What is the Wi-Fi password, please?", ar: "ما هي كلمة سر الواي فاي، من فضلك؟", isBest: true }
        ],
        keywords: ["thank", "thanks", "wifi", "help", "stay"]
      }
    ]
  },

  taxi: {
    id: "taxi",
    title: "مكالمة سائق الأجرة / أوبر",
    titleEn: "Taxi Driver Call",
    icon: "🚕",
    callerName: "Lumi - Taxi Driver",
    callerRole: "سائق تاكسي",
    stages: [
      {
        lumiEn: "Hello! This is your taxi driver. I have arrived at your location. Where are you standing?",
        lumiAr: "مرحباً! معك سائق التاكسي. لقد وصلت لموقعك. أين تقف بالضبط؟",
        suggestedReplies: [
          { en: "I am waiting in front of the main entrance.", ar: "أنا أنتظر أمام المدخل الرئيسي.", isBest: true },
          { en: "I am standing next to the bookstore.", ar: "أنا أقف بجوار متجر الكتب.", isBest: true }
        ],
        keywords: ["front", "entrance", "standing", "waiting", "here", "door", "next"]
      },
      {
        lumiEn: "I see you! I am in a silver Toyota with emergency hazard lights on. Please come in.",
        lumiAr: "لقد رأيتك! أنا في سيارة تويوتا فضية مشغّل أضواء التنبيه. تفضل بالركوب.",
        suggestedReplies: [
          { en: "I see your car. I am coming now.", ar: "رأيت سيارتك. أنا قادم الآن.", isBest: true },
          { en: "Great, opening the door now.", ar: "رائع، أفتح الباب الآن.", isBest: true }
        ],
        keywords: ["coming", "see", "car", "door", "now", "okay"]
      },
      {
        lumiEn: "Good day! Where would you like to go today?",
        lumiAr: "طاب يومك! إلى أين ترغب في الذهاب اليوم؟",
        suggestedReplies: [
          { en: "To the international airport, Terminal 2, please.", ar: "إلى المطار الدولي، الصالة 2، من فضلك.", isBest: true },
          { en: "To the city center mall, please.", ar: "إلى مول مركز المدينة، من فضلك.", isBest: true }
        ],
        keywords: ["airport", "terminal", "mall", "center", "hotel", "please", "go"]
      },
      {
        lumiEn: "Understood. The traffic is light, so it should take about twenty minutes. Fasten your seatbelt, please.",
        lumiAr: "مفهوم. حركة المرور خفيفة، سيستغرق الطريق حوالي 20 دقيقة. اربط حزام الأمان من فضلك.",
        suggestedReplies: [
          { en: "Thank you! I fastened my seatbelt.", ar: "شكراً لك! لقد ربطت الحزام.", isBest: true },
          { en: "Sounds good, thank you.", ar: "يبدو جيداً، شكراً لك.", isBest: true }
        ],
        keywords: ["thank", "seatbelt", "fastened", "good", "okay"]
      }
    ]
  },

  doctor: {
    id: "doctor",
    title: "مكالمة عيادة الطبيب / الصيدلية",
    titleEn: "Doctor Clinic & Pharmacy Call",
    icon: "💊",
    callerName: "Lumi - Clinic Assistant",
    callerRole: "مساعد الطبيب في العيادة",
    stages: [
      {
        lumiEn: "Health Clinic, good morning! How can I help you?",
        lumiAr: "عيادة الصحة، صباح الخير! كيف يمكنني مساعدتك؟",
        suggestedReplies: [
          { en: "Hello, I would like to book an appointment with the doctor.", ar: "مرحباً، أود حجز موعد مع الطبيب.", isBest: true },
          { en: "I have a terrible headache and fever.", ar: "لدي صداع شديد وحرارة مرتفعة.", isBest: true }
        ],
        keywords: ["appointment", "book", "doctor", "headache", "fever", "sick", "help"]
      },
      {
        lumiEn: "I am sorry to hear that. How long have you felt these symptoms?",
        lumiAr: "يؤسفني سماع ذلك. منذ متى وأنت تشعر بهذه الأعراض؟",
        suggestedReplies: [
          { en: "Since yesterday evening.", ar: "منذ مساء الأمس.", isBest: true },
          { en: "For two days now.", ar: "منذ يومين حتى الآن.", isBest: true }
        ],
        keywords: ["yesterday", "days", "since", "morning", "evening", "hours"]
      },
      {
        lumiEn: "Do you have any allergies to medicine like penicillin or aspirin?",
        lumiAr: "هل لديك أي حساسية من أدوية مثل البنسلين أو الأسبرين؟",
        suggestedReplies: [
          { en: "No, I do not have any allergies.", ar: "لا، ليس لدي أي حساسية.", isBest: true },
          { en: "Yes, I am allergic to penicillin.", ar: "نعم، لدي حساسية من البنسلين.", isBest: true }
        ],
        keywords: ["no", "yes", "allergies", "allergic", "penicillin", "aspirin"]
      },
      {
        lumiEn: "Doctor Miller can see you today at 4:30 PM. Does that time work for you?",
        lumiAr: "الدكتور ميلر يمكنه رؤيتك اليوم الساعة 4:30 عصراً. هل هذا الوقت مناسب لك؟",
        suggestedReplies: [
          { en: "Yes, 4:30 PM is perfect for me.", ar: "نعم، 4:30 عصراً وقت مثالي لي.", isBest: true },
          { en: "Yes, please confirm the appointment.", ar: "نعم، أرجو تأكيد الموعد من فضلك.", isBest: true }
        ],
        keywords: ["yes", "perfect", "time", "confirm", "appointment", "good"]
      }
    ]
  }
};
