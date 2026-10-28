// English Journey - Interactive Branching Stories Data

const STORIES = {
  new_friend: {
    title: "صديق جديد",
    titleEn: "A New Friend",
    icon: "🏫",
    category: "حياة مدرسية وتواصل",
    description: "قصة تفاعلية عن أحمد في أول يوم له في مدرسة جديدة، وتأثير الردود اللطيفة على تكوين الصداقات.",
    graph: {
      n1: { en: "Ahmed is a new student at school.", ar: "أحمد طالب جديد في المدرسة.", next: "n2" },
      n2: { en: "He walks into the crowded courtyard and feels a little nervous.", ar: "يمشي في ساحة المدرسة المزدحمة ويشعر ببعض التوتر والتردد.", next: "n3" },
      n3: { en: "Suddenly, a friendly boy smiles at him and says: 'Hi! I am Ali. Welcome to our school!'", ar: "فجأة، ابتسم له ولد ودود وقال: 'مرحباً! أنا علي. أهلاً بك في مدرستنا!'", next: "n4" },
      n4: {
        choice: true,
        prompt: "ماذا يقول أحمد رداً على تحية علي؟",
        options: [
          { en: "Thank you! Nice to meet you, Ali.", ar: "شكراً لك! سعيد بلقائك يا علي.", next: "n5a" },
          { en: "I am busy, please leave me alone.", ar: "أنا مشغول، من فضلك اتركني وشأني.", next: "n5b" }
        ]
      },
      n5a: { en: "Ahmed smiles back warmly, and they become friends right away.", ar: "يبتسم أحمد بالمقابل بدفء، وتنشأ بينهما صداقة فورية متينة.", next: "n6a" },
      n6a: { en: "They study together every day and help each other during break time.", ar: "يدرسان معاً كل يوم ويساعد أحدهما الآخر خلال فترات الاستراحة.", next: "end1" },
      n5b: { en: "Ali looks disappointed, takes a step back, and walks away quietly.", ar: "يبدو علي محبطاً، ويتراجع خطوة للوراء ثم يبتعد بهدوء.", next: "n6b" },
      n6b: { en: "Ahmed stands alone, feeling isolated and regretful for the rest of the day.", ar: "يقف أحمد وحيداً، ويشعر بالعزلة والندم طوال بقية اليوم.", next: "n7" },
      n7: {
        choice: true,
        prompt: "ماذا يفعل أحمد الآن لتصحيح الموقف؟",
        options: [
          { en: "Walk up to Ali, apologize sincerely, and ask to sit with him.", ar: "يتوجه إلى علي، يعتذر بصدق، ويطلب الجلوس معه.", next: "n8a" },
          { en: "Stay silent and spend the whole week alone.", ar: "يلتزم الصمت ويقضي الأسبوع كاملاً وحيداً.", next: "n8b" }
        ]
      },
      n8a: { en: "Ahmed apologizes, and Ali smiles generously: 'No worries at all! Let's be friends.'", ar: "يعتذر أحمد، فيبتسم علي بكرم: 'لا تقلق أبداً! لنكن أصدقاء.'", next: "end1" },
      n8b: { en: "Ahmed misses out on making good friends and feels sad for a long time.", ar: "يضيّع أحمد فرصة تكوين صداقات ممتازة ويشعر بالحزن لفترة طويلة.", next: "end2" },
      end1: { end: true, en: "The End 🎉 Ahmed learned that kindness and a warm smile open doors to lasting friendships.", ar: "النهاية 🎉 تعلّم أحمد أن اللطف والابتسامة الصادقة مفتاح لصداقات تدوم طويلاً." },
      end2: { end: true, en: "The End. Ahmed learned that fear and pride can prevent us from connecting with kind people.", ar: "النهاية. تعلّم أحمد أن الخوف والانغلاق قد يحرماننا من لقاء أناس رائعين." }
    }
  },

  first_day_work: {
    title: "أول يوم في العمل",
    titleEn: "First Day at Work",
    icon: "💼",
    category: "بيئة مهنية واجتماعات",
    description: "سارة تبدأ مسارها المهني في شركة تقنية عالمية، وتتعلم كيف تعبر عن آرائها المهنية بثقة.",
    graph: {
      n1: { en: "Sara walks through the glass doors of her new company on her first morning.", ar: "تدخل سارة من الأبواب الزجاجية لشركتها الجديدة في صباح أول يوم لها.", next: "n2" },
      n2: { en: "Her heart beats fast; she feels a mix of enthusiasm and natural nervousness.", ar: "يدق قلبها بسرعة؛ تشعر بمزيج من الحماس والتوتر الطبيعي لأي بداية.", next: "n3" },
      n3: { en: "Her manager, Mr. Khalid, welcomes her: 'Good morning Sara! Would you prefer a tour of the building first, or meeting your team?'", ar: "يحييها مديرها الأستاذ خالد: 'صباح الخير يا سارة! هل تفضلين جولة في المبنى أولاً أم مقابلة فريقك مباشرة؟'", next: "n4" },
      n4: {
        choice: true,
        prompt: "ماذا تختار سارة لبدء يومها؟",
        options: [
          { en: "I would love a tour of the office first, thank you.", ar: "أحب أن آخذ جولة في المكتب أولاً، شكراً لك.", next: "n5a" },
          { en: "Let's meet the team right away! I am ready.", ar: "لنقابل الفريق فوراً! أنا مستعدة ومتحمسة.", next: "n5b" }
        ]
      },
      n5a: { en: "Mr. Khalid shows her the coffee area, quiet workspaces, and conference rooms. She feels well-prepared.", ar: "يُريها الأستاذ خالد ركن القهوة ومساحات العمل الهادئة وقاعات الاجتماعات، فتشعر بالاستقرار والمعرفة.", next: "n6a" },
      n6a: { en: "Sara joins her team with confidence and a clear picture of the environment.", ar: "تنضم سارة إلى فريقها بثقة وصورة واضحة عن بيئة العمل.", next: "n7" },
      n5b: { en: "She meets her teammates immediately; they shake hands and welcome her with great enthusiasm.", ar: "تقابل زملاءها مباشرة، يصافحونها ويرحبون بها بحرارة وحماس كبير.", next: "n6b" },
      n6b: { en: "Sara feels the team spirit instantly, breaking the ice within minutes.", ar: "تذوب الحواجز خلال دقائق وتشعر بروح الفريق فوراً.", next: "n7" },
      n7: {
        choice: true,
        prompt: "في أول اجتماع للفريق، يسألها المدير: 'سارة، ما رأيك في فكرة إطلاق التطبيق الجديد الأسبوع القادم؟'",
        options: [
          { en: "I think it is a promising idea, but we should test the payment gateway one more time.", ar: "أعتقد أنها فكرة واعدة جداً، لكن أقترح إعادة اختبار بوابة الدفع مرة إضافية لضمان الأمان.", next: "n8a" },
          { en: "I am new here, so I don't really have an opinion yet.", ar: "أنا جديدة هنا، لذلك ليس لدي رأي محدد بعد.", next: "n8b" }
        ]
      },
      n8a: { en: "The manager and lead engineers nod in agreement: 'Sharp observation! That's exactly why we hired you.'", ar: "يومئ المدير وكبار المهندسين بالموافقة: 'ملاحظة ذكية ودقيقة! لهذا السبب اخترناك بالذات.'", next: "end1" },
      n8b: { en: "The manager gently encourages her: 'Remember, Sara, your fresh perspective is always valuable to us.'", ar: "يشجعها المدير بلطف: 'تذكري يا سارة أن وجهة نظرك الجديدة ذات قيمة كبيرة لنا دائماً.'", next: "end2" },
      end1: { end: true, en: "The End 🎉 Sara earned respect and trust on day one by speaking up with constructive insight.", ar: "النهاية 🎉 كسبت سارة احترام وثقة الجميع منذ يومها الأول بفضل مشاركتها الذكية والبناءة." },
      end2: { end: true, en: "The End. Sara realized that having confidence in your voice is as important as technical skills.", ar: "النهاية. أدركت سارة أن الثقة بالرأي لا تقل أهمية عن المهارات الفنية." }
    }
  }
};
