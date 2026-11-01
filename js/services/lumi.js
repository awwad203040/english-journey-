// English Journey - Lumi AI Tutor Service
// Dual Engine: Live API connector + Rich Offline Linguistic Rule-based Simulator

class LumiService {
  constructor() {
    this.history = [];
    this.apiClient = null;
    this.initClient();
  }

  async initClient() {
    try {
      if (typeof claude !== "undefined" && claude.use) {
        this.apiClient = await claude.use("sample");
      }
    } catch (e) {
      this.apiClient = null;
    }
  }

  async ask(userText) {
    const text = (userText || "").trim();
    if (!text) return { text: "", enPhrases: [] };

    // 1. If host API is available, try it first
    if (this.apiClient) {
      try {
        const sysPrompt = "أنت لومي 🤖، مدرب لغة إنجليزية ودود ومحفز للناطقين بالعربية. قدم إجابات واضحة ودقيقة (3 إلى 5 أسطر كحد أقصى) مع أمثلة عملية إنجليزية وترجمتها. إذا كتب المستخدم بالإنجليزية، قيّم جملته وصححها بلطف.";
        const messages = [
          ...this.history,
          { role: "user", content: (this.history.length === 0 ? sysPrompt + "\n\n" : "") + text }
        ];
        const res = await this.apiClient(messages, { modelTier: "default", cache: false });
        if (res && res.text) {
          this.history.push({ role: "user", content: text });
          this.history.push({ role: "assistant", content: res.text });
          const enPhrases = this.extractEnglishPhrases(res.text);
          return { text: res.text, enPhrases };
        }
      } catch (e) {
        console.warn("API request failed, falling back to local linguistic engine", e);
      }
    }

    // 2. High-quality offline intelligent linguistic engine
    await new Promise(r => setTimeout(r, 450)); // Natural typing delay
    const replyData = this.generateLocalResponse(text);
    this.history.push({ role: "user", content: text });
    this.history.push({ role: "assistant", content: replyData.text });
    return replyData;
  }

  extractEnglishPhrases(text) {
    if (!text) return [];
    // Match quoted English text or bullet points containing English
    const quotes = text.match(/"([^"]*[a-zA-Z]{3,}[^"]*)"/g) || [];
    const bullets = text.match(/•\s*([a-zA-Z][^.\n]+[.!?]?)/g) || [];
    const directEn = text.match(/^[A-Z][a-zA-Z\s,']+[.!?]?$/gm) || [];

    const found = [...quotes, ...bullets, ...directEn]
      .map(s => s.replace(/^[•"\s]+|["]+$/g, "").trim())
      .filter(s => s.length > 3 && /[a-zA-Z]/.test(s));

    return Array.from(new Set(found));
  }

  generateLocalResponse(query) {
    const q = query.trim().toLowerCase();

    // 1. Greetings & Introductions
    if (/^(hi|hello|hey|good morning|good evening|مرحبا|أهلا|اهلا|السلام عليكم|صباح الخير|مساء الخير|هلا)/i.test(q)) {
      const text = "أهلاً بك يا بطل! 👋 أنا لومي 🤖، رفيقك ومدربك في رحلة إتقان الإنجليزية.\nأنا هنا لمساعدتك في كل ما تحتاج:\n• شرح أي قاعدة إنجليزية ببساطة.\n• تصحيح كتابتك ونطقك.\n• صياغة الجمل لمواقف السفر والعمل اليومية.\nجرب أن تكتب لي جملة بالإنجليزية وسأصححها لك فوراً! 🚀";
      return { text, enPhrases: ["Hello! I am Lumi, your personal English tutor.", "Practice makes perfect!"] };
    }

    if (q.includes("من انت") || q.includes("من أنت") || q.includes("who are you") || q.includes("عرفني بنفسك")) {
      const text = "أنا لومي 🤖، المدرّب الذكي لتطبيق رحلتي للإنجليزية (English Journey).\nصُممت لأرافقك خطوة بخطوة من الصفر حتى الاحتراف وفق معايير CEFR الأوروبية.\nاسألني عن القواعد، المفردات، أو تدرب معي على المحادثة!";
      return { text, enPhrases: ["I am Lumi, your AI English coach.", "Nice to meet you!"] };
    }

    // 2. Error Correction Engine (Common Arab Learner Mistakes)
    if (q.includes("i am agree") || q.includes("i'm agree")) {
      const text = "ملاحظة ذكية يا صديقي! 💡\nفي الإنجليزية نقول:\n• I agree with you.\nولا نقول (I am agree)؛ لأن كلمة agree هي فعل في حد ذاتها ولا تحتاج verb to be.\nجرب قولها الآن!";
      return { text, enPhrases: ["I agree with you.", "I completely agree."] };
    }

    if (q.includes("goed") || q.includes("i go yesterday") || q.includes("yesterday i go")) {
      const text = "تصحيح مهم يا بطل: ⏳\nالفعل go من الأفعال الشاذة (غير المنتظمة)، وماضيه هو went وليس goed.\nالصياغة الصحيحة:\n• Yesterday, I went to the market.\n• I went there last week.";
      return { text, enPhrases: ["Yesterday, I went to the market.", "I went there last week."] };
    }

    if (q.includes("he have") || q.includes("she have") || q.includes("it have")) {
      const text = "تصحيح نحوي دقيق: 📌\nمع ضمائر المفرد الغائب (He, She, It) نستخدم has وليس have.\nالصواب أن نقول:\n• He has a new car.\n• She has a great idea.\nأما have فتأتي مع (I, You, We, They).";
      return { text, enPhrases: ["He has a new car.", "She has a great idea."] };
    }

    if (q.includes("she play ") || q.includes("he play ") || q.includes("he speak ") || q.includes("she like ")) {
      const text = "قاعدة المضارع البسيط الذهبية: ⏰\nعند التحدث عن المفرد (He / She / It) نضيف حرف (s) للفعل في المضارع:\n• He plays football every Friday.\n• She speaks English fluently.\nأنت في الطريق الصحيح للطلاقة! ✨";
      return { text, enPhrases: ["He plays football every Friday.", "She speaks English fluently."] };
    }

    if (q.includes("i have 20 years") || q.includes("i have 25 years") || q.includes("i have 30 years") || q.includes("have ... years")) {
      const text = "ملاحظة لغوية رائعة! 🎂\nفي الإنجليزية للتعبير عن العمر نستخدم فعل الكينونة (am) وليس الملكية (have):\n• I am 20 years old.\n• I am 25.\nجرب قول عمرك بالطريقة الصحيحة!";
      return { text, enPhrases: ["I am twenty years old.", "How old are you?"] };
    }

    if (q.includes("people is")) {
      const text = "انتبه يا بطل: 👥\nكلمة people تعني (ناس) وهي جمع دائم، لذا تأخذ are وليس is:\n• People are very friendly here.\n• The people were happy.";
      return { text, enPhrases: ["People are very friendly here."] };
    }

    if (q.includes("informations")) {
      const text = "قاعدة الأسماء غير المعدودة: 📋\nكلمة information اسم غير معدود (Uncountable)، فلا نضيف له s نهائياً:\n• I need some information, please.\n• This information is very useful.";
      return { text, enPhrases: ["I need some information, please.", "This information is very helpful."] };
    }

    if (q.includes("depend of")) {
      const text = "حرف الجر الصحيح: 🎯\nالفعل depend يأتي دائماً مع on وليس of:\n• It depends on the weather.\n• You can depend on me.";
      return { text, enPhrases: ["It depends on the weather.", "You can depend on me."] };
    }

    if (q.includes("she don't") || q.includes("he don't")) {
      const text = "ملاحظة نفي المفرد: 🚫\nمع (He, She, It) نستخدم doesn't للنفي وليس don't:\n• She doesn't like coffee.\n• He doesn't know the answer.";
      return { text, enPhrases: ["She doesn't like coffee.", "He doesn't know the answer."] };
    }

    if (q.includes("explain me")) {
      const text = "صياغة أنيقة: 🗣️\nفي الإنجليزية مع فعل explain نضيف حرف الجر to للشخص:\n• Could you explain this to me, please?\n• Please explain the lesson to the class.";
      return { text, enPhrases: ["Could you explain this to me, please?"] };
    }

    // 3. Situational Queries ("كيف أقول...", "ترجم لي...", "ماذا أقول في...")
    if (q.includes("شكرا") || q.includes("شكراً") || q.includes("thank")) {
      const text = "طرق رائعة للتعبير عن الشكر والامتنان:\n• Thank you very much! (شكراً جزيلاً)\n• I really appreciate your help! (أقدر مساعدتك حقاً)\n• That is very kind of you! (هذا لطف كبير منك)\nوالرد عليها:\n• You are welcome! (على الرحب والسعة)";
      return { text, enPhrases: ["Thank you very much!", "I really appreciate your help!", "You are very welcome!"] };
    }

    if (q.includes("اعتذار") || q.includes("اسف") || q.includes("آسف") || q.includes("sorry")) {
      const text = "طرق تقديم الاعتذار بأسلوب راقٍ:\n• I am so sorry for the delay. (أنا آسف جداً على التأخير)\n• Pardon me, I didn't catch that. (معذرة، لم أسمع جيداً)\n• Excuse me, could I pass? (عفواً، هل يمكنني المرور؟)";
      return { text, enPhrases: ["I am so sorry for the delay.", "Pardon me, I did not catch that.", "Excuse me, please."] };
    }

    if (q.includes("مساعدة") || q.includes("ساعدني") || q.includes("help")) {
      const text = "طرق طلب المساعدة بلباقة:\n• Could you please help me with this? (هل يمكنك مساعدتي من فضلك؟)\n• Can you give me a hand? (هل يمكنك إعانتي؟)\n• I need some assistance, please. (أحتاج إلى مساعدة من فضلك)";
      return { text, enPhrases: ["Could you please help me with this?", "Can you give me a hand?", "I need assistance, please."] };
    }

    if (q.includes("حساب") || q.includes("فاتورة") || q.includes("bill") || q.includes("check")) {
      const text = "في المطعم أو المقهى لطلب الحساب:\n• Can we have the bill, please? (البريطانية)\n• Could we get the check, please? (الأمريكية)\n• Do you accept credit cards? (هل تقبلون بطاقات الائتمان؟)";
      return { text, enPhrases: ["Can we have the bill, please?", "Could we get the check, please?", "Do you accept credit cards?"] };
    }

    if (q.includes("فندق") || q.includes("غرفة") || q.includes("حجز") || q.includes("hotel")) {
      const text = "جمل أساسية في الفندق:\n• I have a reservation under the name Ahmed. (لدي حجز باسم أحمد)\n• What time is check-out? (ما هو موعد تسجيل الخروج؟)\n• Could I have an extra towel, please? (هل يمكنني الحصول على منشفة إضافية؟)\n• Is breakfast included? (هل الإفطار مشمول؟)";
      return { text, enPhrases: ["I have a reservation under the name Ahmed.", "What time is check-out?", "Is breakfast included?"] };
    }

    if (q.includes("مطار") || q.includes("طيران") || q.includes("بوابة") || q.includes("airport")) {
      const text = "جمل هامة في المطار:\n• Where is gate number 12? (أين البوابة رقم 12؟)\n• Where can I find the baggage claim area? (أين منطقة استلام الأمتعة؟)\n• Here is my passport and boarding pass. (تفضل، هذا جواز سفري وبطاقة الصعود)";
      return { text, enPhrases: ["Where is gate number twelve?", "Where is the baggage claim area?", "Here is my passport and boarding pass."] };
    }

    if (q.includes("مطعم") || q.includes("اكل") || q.includes("طعام") || q.includes("قائمة") || q.includes("restaurant") || q.includes("menu")) {
      const text = "في المطعم للطلب والترشيح:\n• Could we see the menu, please? (هل يمكننا رؤية قائمة الطعام؟)\n• What do you recommend for dinner? (ماذا ترشح لنا للعشاء؟)\n• I would like the grilled chicken, please. (أود طلب الدجاج المشوي من فضلك)\n• Without onions, please. (بدون بصل من فضلك)";
      return { text, enPhrases: ["Could we see the menu, please?", "What do you recommend for dinner?", "I would like the grilled chicken, please."] };
    }

    if (q.includes("تاكسي") || q.includes("طريق") || q.includes("عنوان") || q.includes("taxi") || q.includes("اتجاه")) {
      const text = "في التاكسي والسؤال عن الطرق:\n• Please take me to this address. (من فضلك خذني إلى هذا العنوان)\n• How much will the fare be? (كم ستكون الأجرة تقريباً؟)\n• Excuse me, how do I get to the nearest station? (عفواً، كيف أصل لأقرب محطة؟)";
      return { text, enPhrases: ["Please take me to this address.", "How much will the fare be?", "How do I get to the nearest station?"] };
    }

    if (q.includes("تسوق") || q.includes("سعر") || q.includes("مقاس") || q.includes("شراء") || q.includes("shopping") || q.includes("price")) {
      const text = "جمل التسوق والشراء:\n• How much does this cost? (كم سعر هذا؟)\n• Do you have this in a medium size? (هل يتوفر هذا بمقاس متوسط؟)\n• Can I try this on, please? (هل يمكنني قياس هذا؟)\n• Is there any discount on this item? (هل هناك خصم على هذا المنتج؟)";
      return { text, enPhrases: ["How much does this cost?", "Do you have this in a medium size?", "Can I try this on, please?"] };
    }

    if (q.includes("طبيب") || q.includes("مستشفى") || q.includes("صيدلية") || q.includes("الم") || q.includes("ألم") || q.includes("doctor")) {
      const text = "في الحالات الطبية والصحية:\n• I need to see a doctor as soon as possible. (أحتاج لمقابلة طبيب في أسرع وقت)\n• I have a severe headache and fever. (أعاني من صداع شديد وحمى)\n• Where is the nearest 24-hour pharmacy? (أين أقرب صيدلية تعمل طوال اليوم؟)";
      return { text, enPhrases: ["I need to see a doctor as soon as possible.", "I have a severe headache and fever.", "Where is the nearest pharmacy?"] };
    }

    // 4. Grammar Explanations
    if (q.includes("مضارع بسيط") || q.includes("present simple")) {
      const text = "شرح المضارع البسيط (Present Simple) ⏰:\nنستخدمه للعادات اليومية، الروتين، والحقائق العامة.\n• مع (I, You, We, They): الفعل في المصدر: I drink coffee.\n• مع (He, She, It): نضيف (s/es) للفعل: He drinks coffee.\n• في السؤال والنفي: نستخدم do / does:\n- Do you work here?\n- She does not work here.";
      return { text, enPhrases: ["I drink coffee every morning.", "She works at a hospital.", "Do you work here?"] };
    }

    if (q.includes("ماضي بسيط") || q.includes("past simple") || q.includes("الماضي")) {
      const text = "شرح الماضي البسيط (Past Simple) ⏳:\nنستخدمه لحدث بدأ وانتهى في الماضي في وقت محدد.\n• أفعال منتظمة: نضيف (ed) مثل: played, visited, watched.\n• أفعال شاذة (غير منتظمة): يتغير شكلها: go → went, buy → bought, see → saw.\n• في النفي والسؤال نستخدم did والمصدر:\n- Did you see Ahmed yesterday?\n- I didn't see him.";
      return { text, enPhrases: ["I visited London last summer.", "We saw a great movie yesterday.", "Did you see Ahmed yesterday?"] };
    }

    if (q.includes("مضارع مستمر") || q.includes("present continuous")) {
      const text = "المضارع المستمر (Present Continuous) 🔄:\nيصف حدثاً يقع الآن في هذه اللحظة، أو خطة مستقبلية مؤكدة.\nالتكوين: am / is / are + verb + ing\n• I am studying English right now.\n• They are traveling tomorrow.";
      return { text, enPhrases: ["I am studying English right now.", "They are traveling tomorrow."] };
    }

    if (q.includes("مضارع تام") || q.includes("present perfect") || q.includes("have") || q.includes("has")) {
      const text = "المضارع التام (Present Perfect) 🔗:\nيربط الماضي بالحاضر (خبرات سابقة بدون وقت محدد، أو أحداث لها أثر حاضر).\nالتكوين: have / has + التصريف الثالث (P.P)\n• I have visited Paris three times. (خبرة سابقة)\n• She has just finished her homework. (حدث للتو)";
      return { text, enPhrases: ["I have visited Paris three times.", "She has just finished her homework."] };
    }

    if (q.includes("فرق بين a و an") || q.includes("a and an") || q.includes("ادوات التعريف") || q.includes("the")) {
      const text = "الفرق بين a و an بسهولة وبساطة 🍎:\n• نستخدم (a) قبل الأسماء المفردة المعدودة التي تبدأ بصوت ساكن:\n  a book, a car, a university (نطق صوت يو ساكن).\n• نستخدم (an) قبل الكلمات التي تبدأ بصوت علة (vowel sound: a, e, i, o, u):\n  an apple, an hour (حرف h صامت), an engineer.\nالهدف دائماً هو سهولة النطق وانسيابيته!";
      return { text, enPhrases: ["I bought a new book.", "She ate an apple.", "We will meet in an hour."] };
    }

    if (q.includes("حروف الجر") || q.includes("in on at") || q.includes("prepositions")) {
      const text = "مثلث حروف الجر الشهير (IN - ON - AT) 📐:\n• AT: للأوقات المحددة والنقاط الدقيقة: at 5 PM, at the door, at night.\n• ON: للأيام والتواريخ والأسطح: on Monday, on the table, on July 4th.\n• IN: للأشهر والسنوات والفترات والأماكن المغلقة: in June, in 2026, in Riyadh.";
      return { text, enPhrases: ["The meeting is at five o'clock.", "I will see you on Monday.", "We will travel in the summer."] };
    }

    if (q.includes("will") || q.includes("going to") || q.includes("مستقبل")) {
      const text = "الفرق بين Will و Going to في المستقبل 🚀:\n• Will: للقرارات السريعة اللحظية، والوعود: I will help you with this!\n• Going to: للخطط المسبقة والنوايا والأحداث المبنية على دليل حاضر: Look at those dark clouds, it is going to rain!";
      return { text, enPhrases: ["I will call you tonight.", "It is going to rain tomorrow."] };
    }

    if (q.includes("شرط") || q.includes("if conditional") || q.includes("قاعدة if")) {
      const text = "قواعد If الشرطية الأساسية 🌿:\n• الحالة الأولى (احتمال حقيقي): If + مضارع بسيط, will + المصدر:\n  If you study hard, you will succeed.\n• الحالة الثانية (تخيّل وافتراض): If + ماضي بسيط, would + المصدر:\n  If I had more time, I would travel the world.";
      return { text, enPhrases: ["If you study hard, you will succeed.", "If I had more time, I would travel the world."] };
    }

    if (q.includes("مجهول") || q.includes("passive")) {
      const text = "المبني للمجهول (Passive Voice) 🛡️:\nنستخدمه عندما يكون الحدث أو المفعول أهم من الفاعل.\nالتكوين: Verb to be + التصريف الثالث (P.P)\n• The room is cleaned every day. (تنظف الغرفة كل يوم)\n• The letter was sent yesterday. (أرسلت الرسالة بالأمس)";
      return { text, enPhrases: ["The room is cleaned every day.", "The letter was sent yesterday."] };
    }

    // 5. English Conversational Response (If user speaks English)
    if (/^[a-zA-Z\s,'.!?-]+$/.test(query) && query.split(/\s+/).length >= 2) {
      const text = `You are doing great! 🌟\nYour English sentence:\n"${query}"\n\nI understood you completely. Speaking and writing in English is the fastest route to fluency!\nTry saying:\n• Let's practice a real conversation together.\n• Tell me about your day!`;
      return { text, enPhrases: [query, "Let's practice a real conversation together.", "Tell me about your day!"] };
    }

    // 6. Advice & Study Habits
    if (q.includes("كيف اطور") || q.includes("كيف اتعلم") || q.includes("نصيحة") || q.includes("خطة") || q.includes("طريقة")) {
      const text = "خارطة الطريق الذهبية لإتقان الإنجليزية 🗺️:\n1. استمع يومياً لمدة 15 دقيقة (استخدم ميزة التحدث والاستماع هنا بالتطبيق).\n2. احفظ الجمل في سياقها وليس كلمات منفردة (جرب نافذة ماذا أقول الآن).\n3. عِش الموقف: تدرب على مواقف السفر والمطاعم بصوت مسموع.\n4. لا تخف من الخطأ؛ فالخطأ هو الدليل الوحيد على أنك تتعلم!";
      return { text, enPhrases: ["Listen to English every single day.", "Consistency is the key to success."] };
    }

    // 7. General Constructive Response
    const text = `سؤال جميل وتفكير رائع يا بطل! 👏\nللتدرب على هذا الأمر بشكل عملي، إليك هذه الجمل المفيدة:\n• Could you give me an example, please?\n• How do you pronounce this word?\n• I am learning English step by step.\nهل ترغب في أن نتدرّب على محادثة قصيرة أو شرح قاعدة معينة؟ 💬`;
    return {
      text,
      enPhrases: [
        "Could you give me an example, please?",
        "How do you pronounce this word?",
        "I am learning English step by step."
      ]
    };
  }

  async generateSituationalSentence(situationArabic, tone = "عادي وطبيعي") {
    const s = (situationArabic || "").toLowerCase();
    let en = "Excuse me, could you please help me?";
    let ar = "عفواً، هل يمكنك مساعدتي من فضلك؟";

    if (s.includes("فندق") || s.includes("غرفة") || s.includes("حجز")) {
      if (tone === "أسهل وأبسط") {
        en = "I want a room, please.";
        ar = "أريد غرفة من فضلك.";
      } else if (tone === "أكثر تهذيباً ورسمية") {
        en = "Good evening. I would like to inquire about booking a room for three nights, please.";
        ar = "مساء الخير. أود الاستفسار عن حجز غرفة لثلاث ليالٍ من فضلك.";
      } else if (tone === "أكثر طبيعية للناطقين الأصليين") {
        en = "Hi there, do you happen to have any vacancies for tonight?";
        ar = "مرحباً، هل يتوفر لديكم أي غرف شاغرة الليلة؟";
      } else {
        en = "Hello, do you have a single room available for tonight?";
        ar = "مرحباً، هل يتوفر لديكم غرفة مفردة لليلة؟";
      }
    } else if (s.includes("مطعم") || s.includes("طلب") || s.includes("طعام") || s.includes("اكل") || s.includes("فاتورة") || s.includes("حساب")) {
      if (s.includes("فاتورة") || s.includes("حساب")) {
        if (tone === "أسهل وأبسط") {
          en = "The bill, please.";
          ar = "الحساب من فضلك.";
        } else if (tone === "أكثر تهذيباً ورسمية") {
          en = "Could we kindly have the bill whenever you are ready, please?";
          ar = "هل تتفضل بإحضار الفاتورة متى ما كنت جاهزاً من فضلك؟";
        } else {
          en = "Could we get the check, please?";
          ar = "هل يمكننا الحصول على الحساب من فضلك؟";
        }
      } else {
        if (tone === "أسهل وأبسط") {
          en = "The menu, please.";
          ar = "قائمة الطعام من فضلك.";
        } else if (tone === "أكثر تهذيباً ورسمية") {
          en = "Could you please recommend your signature dish for dinner?";
          ar = "هل يمكن أن تنصحني بطبقكم المميز للعشاء من فضلك؟";
        } else if (tone === "أكثر طبيعية للناطقين الأصليين") {
          en = "What are the chef's specials for tonight?";
          ar = "ما هي الأطباق الخاصة للشيف الليلة؟";
        } else {
          en = "Excuse me, I am ready to order the grilled chicken, please.";
          ar = "عفواً، أنا جاهز لطلب الدجاج المشوي من فضلك.";
        }
      }
    } else if (s.includes("مطار") || s.includes("طيران") || s.includes("بوابة") || s.includes("حقيبة") || s.includes("أمتعة")) {
      if (tone === "أسهل وأبسط") {
        en = "Where is gate twelve?";
        ar = "أين البوابة رقم 12؟";
      } else if (tone === "أكثر تهذيباً ورسمية") {
        en = "Pardon me, could you kindly direct me to the baggage claim area?";
        ar = "عذراً، هل تتفضل بإرشادي إلى منطقة استلام الأمتعة؟";
      } else if (tone === "أكثر طبيعية للناطقين الأصليين") {
        en = "Which carousel is the flight from Dubai on?";
        ar = "على أي سير تدور أمتعة رحلة دبي؟";
      } else {
        en = "Excuse me, is this flight on time?";
        ar = "عفواً، هل هذه الرحلة في موعدها المحدد؟";
      }
    } else if (s.includes("مستشفى") || s.includes("طبيب") || s.includes("ألم") || s.includes("صداع") || s.includes("دواء") || s.includes("صيدلية")) {
      if (tone === "أسهل وأبسط") {
        en = "I need a doctor, please.";
        ar = "أحتاج إلى طبيب من فضلك.";
      } else if (tone === "أكثر تهذيباً ورسمية") {
        en = "I am experiencing severe dizziness and would like to see a physician immediately.";
        ar = "أعاني من دوار شديد وأود مقابلة طبيب على الفور.";
      } else {
        en = "I have a severe headache and fever. Could I see a doctor?";
        ar = "أعاني من صداع شديد وحمى. هل يمكنني مقابلة الطبيب؟";
      }
    } else if (s.includes("تاكسي") || s.includes("طريق") || s.includes("عنوان") || s.includes("محطة")) {
      if (tone === "أسهل وأبسط") {
        en = "To the city center, please.";
        ar = "إلى وسط المدينة من فضلك.";
      } else if (tone === "أكثر تهذيباً ورسمية") {
        en = "Could you please take me to the airport terminal, and turn on the meter?";
        ar = "هل يمكنك من فضلك أخذي لصالة المطار وتشغيل العداد؟";
      } else {
        en = "Please take me to the city center as soon as possible.";
        ar = "من فضلك خذني إلى وسط المدينة في أسرع وقت ممكن.";
      }
    } else if (s.includes("تسوق") || s.includes("سعر") || s.includes("مقاس") || s.includes("شراء") || s.includes("متجر")) {
      if (tone === "أسهل وأبسط") {
        en = "How much is this?";
        ar = "كم سعر هذا؟";
      } else if (tone === "أكثر تهذيباً ورسمية") {
        en = "Would you happen to have this shirt in a medium size, please?";
        ar = "هل يتوفر هذا القميص بمقاس متوسط لديكم من فضلك؟";
      } else {
        en = "Do you have this in a different color or size?";
        ar = "هل يتوفر هذا بلون أو مقاس آخر؟";
      }
    } else if (s.includes("قهوة") || s.includes("كافيه") || s.includes("شاي") || s.includes("سكر")) {
      en = "Can I get an iced latte with oat milk, please?";
      ar = "هل يمكنني طلب لاتيه مثلج بحليب الشوفان من فضلك؟";
    }

    // Try Claude API if available
    if (this.apiClient) {
      try {
        const prompt = `المستخدم في موقف: "${situationArabic}". المطلوب جملة واحدة بالإنجليزية تناسب هذا الموقف (الأسلوب المطلوب: ${tone}) مع ترجمتها العربية الدقيقة. أجب حصراً بهذا التنسيق بدون أي كلام إضافي:\nEN: <الجملة الإنجليزية>\nAR: <الترجمة العربية>`;
        const res = await this.apiClient([{ role: "user", content: prompt }], { modelTier: "default", cache: false });
        const mEn = res.text.match(/EN:\s*(.+)/);
        const mAr = res.text.match(/AR:\s*(.+)/);
        if (mEn && mAr) {
          return { en: mEn[1].trim(), ar: mAr[1].trim() };
        }
      } catch (e) {}
    }

    return { en, ar };
  }

  async evaluateChallenge(topic, text) {
    const words = (text || "").trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z']/g, ""))).size;

    let aiFeedback = "";
    if (this.apiClient) {
      try {
        const p = `أنت مدرب لغة إنجليزية. كتب المتعلم النص التالي خلال تحدي دقيقة واحدة عن موضوع "${topic}":\n"${text}"\nقيّم بإيجاز ومشجع في 3 أسطر بالعربية: الطلاقة، ملاحظة نحوية أو تصحيح، ونصيحة للتحسين.`;
        const res = await this.apiClient([{ role: "user", content: p }], { modelTier: "default", cache: false });
        aiFeedback = res.text || "";
      } catch (e) {}
    }

    if (!aiFeedback) {
      if (wordCount >= 25) {
        aiFeedback = "أداء استثنائي رائع! تدفق الكلمات لديك سريع ومبهر، وعدد المفردات يدل على ثراء لغوي واعد. واصل الكتابة السريعة يومياً لتثبيت الطلاقة! 🌟";
      } else if (wordCount >= 12) {
        aiFeedback = "بداية جيدة جداً! استطعت التعبير عن الفكرة بجمل مترابطة في وقت قصير. في المرة القادمة، جرب استخدام صفات إضافية مثل (great, interesting, beautiful). 👏";
      } else {
        aiFeedback = "محاولة شجاعة وبداية ممتازة! السرعة تأتي بالتكرار والممارسة؛ لا تتردد في كتابة ما يدور ببالك دون خوف من الأخطاء. 🚀";
      }
    }

    return {
      wordCount,
      uniqueWords,
      feedback: aiFeedback
    };
  }
}

const lumiService = new LumiService();
