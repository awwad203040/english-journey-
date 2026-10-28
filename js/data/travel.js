// English Journey - Situational Travel Dialogues ("عِش الموقف قبل أن تسافر")

const TRAVEL = {
  airport_hotel: {
    title: "من المطار إلى الفندق",
    icon: "✈️",
    desc: "تدرب على رحلة الوصول: كاونتر الجوازات، استلام الأمتعة، طلب تاكسي، وتسجيل دخول الفندق.",
    stages: [
      {
        scene: "🛫",
        situationAr: "أنت في المطار لتسجيل دخول رحلتك.",
        npcEn: "Good morning! May I see your passport and flight booking confirmation, please?",
        npcAr: "صباح الخير! هل يمكنني رؤية جواز سفرك وتأكيد حجز الرحلة من فضلك؟",
        options: [
          { en: "Sure, here you are.", ar: "بالتأكيد، تفضل.", best: true, feedback: "رد ممتاز ومهذب، تماماً كما يقوله المسافرون في هذا الموقف." },
          { en: "No, I don't have them right now.", ar: "لا، ليست معي حالياً.", best: false, feedback: "بدون الجواز والتذكرة لن تستطيع السفر! قدم أوراقك مباشرة للموظف." }
        ]
      },
      {
        scene: "🛂",
        situationAr: "أنت الآن عند نقطة التفتيش الأمني.",
        npcEn: "Please place your carry-on bag on the belt and remove your laptop.",
        npcAr: "من فضلك ضع حقيبتك اليدوية على الحزام وأخرج جهاز الحاسوب المحمول.",
        options: [
          { en: "Okay, no problem. Should I remove my watch as well?", ar: "حسناً، لا مشكلة. هل يجب أن أنزع ساعتي أيضاً؟", best: true, feedback: "إجابة متعاونة وطبيعية جداً تسرّع إجراءات التفتيش الأمني." },
          { en: "I refuse to do that, it's personal.", ar: "أرفض فعل ذلك، إنها أشيائي الخاصة.", best: false, feedback: "رفض التفتيش الأمني يمنعك من الصعود إلى الطائرة. التعاون هنا ضروري." }
        ]
      },
      {
        scene: "🛃",
        situationAr: "وصلت إلى نقطة مراقبة الجوازات في مطار وجهتك.",
        npcEn: "Welcome to London. What is the purpose of your visit, and how long are you staying?",
        npcAr: "أهلاً بك في لندن. ما هو الغرض من زيارتك، وكم المدة التي ستقضيها؟",
        options: [
          { en: "I am here on vacation for two weeks.", ar: "أنا هنا في إجازة سياحية لمدة أسبوعين.", best: true, feedback: "إجابة واضحة ومباشرة ومطابقة تماماً لما يبحث عنه ضابط الهجرة." },
          { en: "That is none of your business.", ar: "هذا أمر لا يخصك.", best: false, feedback: "هذا الرد فظ وقد يعرضك للمنع من الدخول أو للتحقيق المطول." }
        ]
      },
      {
        scene: "🚕",
        situationAr: "خرجت من صالة الوصول وتريد الذهاب إلى فندقك بواسطة سيارة أجرة.",
        npcEn: "Hello! Where would you like to go today?",
        npcAr: "مرحباً! إلى أين تود الذهاب اليوم؟",
        options: [
          { en: "To the Hilton Hotel on King Street, please.", ar: "إلى فندق هيلتون في شارع الملك من فضلك.", best: true, feedback: "رد دقيق مع ذكر اسم الفندق والشارع يضمن وصولك بدون أي ارتباك." },
          { en: "Somewhere nice, I don't know.", ar: "إلى مكان جميل، لا أعرف أين.", best: false, feedback: "السائق يحتاج عنواناً واضحاً ومحدداً ليوصلك." }
        ]
      },
      {
        scene: "🏨",
        situationAr: "وصلت إلى الفندق وتريد تسجيل الدخول واستلام مفتاح غرفتك.",
        npcEn: "Good evening, sir. Welcome to Hilton. Do you have a reservation with us?",
        npcAr: "مساء الخير يا سيدي. أهلاً بك في هيلتون. هل لديك حجز مسبق لدينا؟",
        options: [
          { en: "Yes, I have a reservation under the name Ahmed Khalid.", ar: "نعم، لدي حجز باسم أحمد خالد.", best: true, feedback: "ممتاز! ذكر الاسم الكامل يتيح للموظف إيجاد الحجز بضغطة زر واحدة." },
          { en: "Give me a room now.", ar: "أعطني غرفة الآن.", best: false, feedback: "أسلوب حاد وغير ملائم؛ الأفضل دائماً ذكر الحجز والاسم بأدب." }
        ]
      }
    ]
  },

  restaurant_trip: {
    title: "في المطعم الراقي",
    icon: "🍽️",
    desc: "طلب طاولة، الاستفسار عن المكونات، طلب الأطباق، وحساب الفاتورة وطريقة الدفع.",
    stages: [
      {
        scene: "🍽️",
        situationAr: "وصلت إلى المطعم وتريد طاولة لشخصين.",
        npcEn: "Good evening! Do you have a reservation, or would you like a table for tonight?",
        npcAr: "مساء الخير! هل لديكم حجز، أم ترغبون في طاولة الليلة؟",
        options: [
          { en: "We don't have a reservation, but do you have a table for two near the window?", ar: "ليس لدينا حجز، لكن هل تتوفر لديكم طاولة لشخصين قرب النافذة؟", best: true, feedback: "سؤال مهذب ومفصل يوضح عدد الأشخاص ومكان التفضيل." },
          { en: "Two people.", ar: "شخصان.", best: false, feedback: "موجزة جداً وتفتقر للأدب؛ تحدث بجملة كاملة." }
        ]
      },
      {
        scene: "📋",
        situationAr: "النادل يقترب ليسأل عن طلباتكم.",
        npcEn: "Are you ready to order, or would you like a couple more minutes with the menu?",
        npcAr: "هل أنتم جاهزون للطلب، أم تفضلون دقيقتين إضافيتين مع قائمة الطعام؟",
        options: [
          { en: "We are ready, thank you. I would like the grilled salmon with vegetables.", ar: "نحن جاهزون، شكراً لك. أود طلب السلمون المشوي مع الخضار.", best: true, feedback: "طلب واضح ودقيق بأسلوب مهذب ومثالي." },
          { en: "Just bring whatever food you have.", ar: "فقط أحضر أي طعام لديكم.", best: false, feedback: "غير محدد؛ من الأفضل اختيار طبق محدد من القائمة." }
        ]
      },
      {
        scene: "🍲",
        situationAr: "النادل يأتي ليتأكد من جودة الوجبة.",
        npcEn: "How is everything tasting tonight? Is your meal to your satisfaction?",
        npcAr: "كيف تجدون الطعام الليلة؟ هل الوجبة نالت إعجابكم ورضاكم؟",
        options: [
          { en: "It is absolutely delicious, compliments to the chef!", ar: "إنها لذيذة جداً بالتأكيد، تحياتنا وشكرنا للطاهي!", best: true, feedback: "إطراء جميل ولطيف يسعد طاقم المطعم." },
          { en: "It is okay.", ar: "إنها عادية.", best: false, feedback: "رد بارد، وإذا كان هناك ملاحظة فالأفضل صياغتها بلطف." }
        ]
      },
      {
        scene: "🧾",
        situationAr: "انتهيتم من تناول الطعام وتريدون الفاتورة والدفع بالبطاقة.",
        npcEn: "Would you like some coffee or dessert, or can I get the bill started for you?",
        npcAr: "هل تودون قهوة أو حلوى، أم أبدأ بتجهيز الفاتورة لكم؟",
        options: [
          { en: "Just the bill, please. Could we pay by credit card?", ar: "الفاتورة فقط من فضلك. هل يمكننا الدفع بالبطاقة الائتمانية؟", best: true, feedback: "طلب مهذب يحدد الرغبة وطريقة الدفع المتوقعة." },
          { en: "Bill. Card.", ar: "فاتورة. بطاقة.", best: false, feedback: "استخدم جملة كاملة دائماً لتحسين لغتك وتواصلك." }
        ]
      }
    ]
  },

  shopping_trip: {
    title: "التسوق في المتجر",
    icon: "🛍️",
    desc: "البحث عن مقاس محدد، الاستفسار عن الألوان وغرفة القياس، وسؤال الكاشير عن الخصومات.",
    stages: [
      {
        scene: "🛍️",
        situationAr: "دخلت إلى متجر ملابس وأنت تبحث عن قميص رسمي أزرق.",
        npcEn: "Hi there! Welcome to our store. Are you looking for anything specific today?",
        npcAr: "أهلاً بك! مرحباً بك في متجرنا. هل تبحث عن شيء محدد اليوم؟",
        options: [
          { en: "Yes, please. I am looking for a blue formal shirt.", ar: "نعم من فضلك. أبحث عن قميص رسمي أزرق اللون.", best: true, feedback: "تحديد طلبك بدقة يساعد البائع على إرشادك فوراً للقسم المناسب." },
          { en: "No, don't talk to me.", ar: "لا، لا تتحدث معي.", best: false, feedback: "رد فظ؛ إذا أردت التصفح بمفردك قل: 'Just looking around, thanks'." }
        ]
      },
      {
        scene: "📏",
        situationAr: "وجدت قميصاً يعجبك لكنك تحتاج مقاساً أكبر.",
        npcEn: "What size do you typically wear?",
        npcAr: "ما هو المقاس الذي ترتديه عادة؟",
        options: [
          { en: "I wear a medium, but do you have this in a large size to try on?", ar: "أرتدي المقاس المتوسط، لكن هل يتوفر لديكم هذا بمقاس كبير لتجربته؟", best: true, feedback: "سؤال مهذب ومباشر يوضح المقاس المطلوب." },
          { en: "This shirt is too small. Bad store.", ar: "هذا القميص صغير جداً. متجر سيء.", best: false, feedback: "اختلاف المقاسات أمر طبيعي؛ اطلب المقاس المناسب لك بلباقة." }
        ]
      },
      {
        scene: "👕",
        situationAr: "البائع يحضر المقاس المطلوب ويعرض عليك القياس.",
        npcEn: "Here you go! Would you like to try it on in the fitting room?",
        npcAr: "تفضل! هل تود تجربته في غرفة القياس؟",
        options: [
          { en: "Yes, thank you. Where are the fitting rooms located?", ar: "نعم، شكراً لك. أين تقع غرف القياس؟", best: true, feedback: "إجابة مهذبة وسؤال طبيعي للتوجه لغرفة القياس." },
          { en: "I don't need to try, just take my money.", ar: "لا أحتاج للتجربة، فقط خذ نقودي.", best: false, feedback: "تجربة المقاس مهمة للتأكد من ملاءمته وتوفير وقت التبديل." }
        ]
      },
      {
        scene: "💳",
        situationAr: "وصلت لكاونتر الدفع وتريد السؤال عن وجود خصومات أو استرجاع.",
        npcEn: "That will be one hundred and twenty riyals. How would you like to pay?",
        npcAr: "المجموع مئة وعشرون ريالاً. كيف تود الدفع؟",
        options: [
          { en: "I will pay with Apple Pay. Can I return it within two weeks with the receipt?", ar: "سأدفع عبر Apple Pay. هل يمكنني الاسترجاع خلال أسبوعين مع الإيصال؟", best: true, feedback: "سؤال ذكي واحترافي يضمن معرفة سياسة الاسترجاع قبل المغادرة." },
          { en: "Too expensive! Give me a discount right now.", ar: "غالٍ جداً! أعطني خصماً الآن.", best: false, feedback: "في المتاجر الكبرى الأسعار محددة؛ يمكنك السؤال بلطف: 'Is there any ongoing promotion?'" }
        ]
      }
    ]
  },

  emergency_trip: {
    title: "حالة طارئة وطلب المساعدة",
    icon: "🚨",
    desc: "الاتصال بالطوارئ، وصف الموقع بوضوح، الإبلاغ عن حادث أو حريق، واتباع التعليمات بدقة.",
    stages: [
      {
        scene: "🔥",
        situationAr: "شاهدت دخاناً يتصاعد من مبنى واتصلت بالطوارئ فوراً.",
        npcEn: "Emergency services, what service do you require: police, fire, or ambulance?",
        npcAr: "خدمات الطوارئ، أي خدمة تطلبها: الشرطة، الإطفاء، أم الإسعاف؟",
        options: [
          { en: "Fire service, please! There is heavy smoke coming from a residential building.", ar: "خدمة الإطفاء من فضلك! هناك دخان كثيف يتصاعد من مبنى سكني.", best: true, feedback: "تحديد فوري لنوع الخدمة ووصف سريع ودقيق للمشكلة." },
          { en: "Help! Bad things are happening!", ar: "النجدة! أشياء سيئة تحدث!", best: false, feedback: "الذعر والغموض يعطلان وصول المساعدة؛ حدد نوع الطارئة فوراً." }
        ]
      },
      {
        scene: "📍",
        situationAr: "مأمور الطوارئ يسألك عن موقعك وعنوان الحادثة بدقة.",
        npcEn: "What is your exact location or nearest landmark?",
        npcAr: "ما هو موقعك بالضبط أو أقرب معلم بارز بجانبك؟",
        options: [
          { en: "I am at 45 King Fahd Road, right next to the central library.", ar: "أنا عند طريق الملك فهد مبنى 45، بجانب المكتبة المركزية تماماً.", best: true, feedback: "إعطاء اسم الشارع ورقم المبنى وأقرب معلم يسهل وصول سيارات الإسعاف والإطفاء فوراً." },
          { en: "I am on the street somewhere in town.", ar: "أنا في الشارع في مكان ما بالمدينة.", best: false, feedback: "الوصف المبهم يضيع وقتاً ثميناً في إنقاذ الأرواح." }
        ]
      },
      {
        scene: "🚪",
        situationAr: "المأمور يسألك إن كان هناك أي مصابين أو عالقين داخل المبنى.",
        npcEn: "Are there any people injured or trapped inside the building?",
        npcAr: "هل يوجد أي مصابين أو عالقين داخل المبنى؟",
        options: [
          { en: "Most people have evacuated outside, but someone may still be on the second floor.", ar: "معظم الناس خرجوا للخارج، لكن يُحتمل وجود شخص في الطابق الثاني.", best: true, feedback: "معلومة بالغة الأهمية تساعد رجال الإطفاء على توجيه جهود الإنقاذ فور وصولهم." },
          { en: "I have no idea, I didn't check.", ar: "ليس لدي أدنى فكرة، لم أتحقق.", best: false, feedback: "صف ما تراه بعينيك بهدوء لمساعدة المستجيبين." }
        ]
      },
      {
        scene: "🚒",
        situationAr: "المأمور يخبرك بأن الفرق في طريقها ويوجهك بالابتعاد لمكان آمن.",
        npcEn: "The fire engines are two minutes away. Please stay at a safe distance and keep the road clear.",
        npcAr: "سيارات الإطفاء على بعد دقيقتين. من فضلك ابقَ على مسافة آمنة وحافظ على خلو الطريق.",
        options: [
          { en: "Understood, I am standing safely across the street and will guide them when they arrive.", ar: "مفهوم، أنا أقف بأمان في الجهة المقابلة من الشارع وسأرشدهم فور وصولهم.", best: true, feedback: "استجابة مثالية وهادئة تؤمن سلامتك وتساعد فرق الإنقاذ." },
          { en: "I am going to run inside to save my belongings.", ar: "سأركض للداخل لإنقاذ أغراضي الشخصية.", best: false, feedback: "خطر جسيم جداً! لا تدخل أبداً إلى مبنى محترق." }
        ]
      }
    ]
  }
};
