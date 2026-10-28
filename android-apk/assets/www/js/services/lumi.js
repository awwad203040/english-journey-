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
    if (!text) return "";

    // 1. If host API is available, try it first
    if (this.apiClient) {
      try {
        const sysPrompt = "أنت لومي 🤖، مدرب لغة إنجليزية ودود ومشجع للناطقين بالعربية. قدم إجابات دقيقة ومختصرة (3 إلى 4 أسطر كحد أقصى) مع أمثلة عملية إنجليزية وترجمتها. إذا أخطأ المستخدم في الإنجليزية، صحح له بلطف واشرح القاعدة ببساطة.";
        const messages = [
          ...this.history,
          { role: "user", content: (this.history.length === 0 ? sysPrompt + "\n\n" : "") + text }
        ];
        const res = await this.apiClient(messages, { modelTier: "default", cache: false });
        if (res && res.text) {
          this.history.push({ role: "user", content: text });
          this.history.push({ role: "assistant", content: res.text });
          return res.text;
        }
      } catch (e) {
        console.warn("API request failed, falling back to local linguistic engine", e);
      }
    }

    // 2. High-quality offline intelligent simulation
    await new Promise(r => setTimeout(r, 600)); // natural typing delay
    const reply = this.generateLocalResponse(text);
    this.history.push({ role: "user", content: text });
    this.history.push({ role: "assistant", content: reply });
    return reply;
  }

  generateLocalResponse(query) {
    const q = query.toLowerCase();

    // Greeting
    if (/^(hi|hello|hey|مرحبا|أهلا|اهلا|السلام عليكم|صباح الخير|مساء الخير)/i.test(q)) {
      return "أهلاً بك يا بطل! 👋 أنا لومي 🤖، رفيقك في رحلة إتقان الإنجليزية. اكتب لي أي جملة بالإنجليزي وسأصححها لك، أو اسألني عن أي قاعدة أو موقف سفر!";
    }

    // How to say X in English
    if (q.includes("كيف أقول") || q.includes("كيف اقول") || q.includes("ترجم لي") || q.includes("ما ترجمة")) {
      if (q.includes("شكرا") || q.includes("شكراً")) return "تقدر تقول:\n• Thank you very much!\n• I really appreciate it!\nكلاهما أسلوب راقٍ وجميل ✨";
      if (q.includes("مساعدة") || q.includes("ساعدني")) return "تقدر تقول:\n• Could you help me, please?\n• Can you give me a hand?\nالأولى أكثر رسمية وأدباً 🤝";
      if (q.includes("حساب") || q.includes("فاتورة")) return "في المطعم أو المتجر:\n• Can I have the bill, please?\n• Could we get the check, please?\nتفضل واستخدمها مباشرة 💳";
      if (q.includes("فندق") || q.includes("غرفة")) return "عند الحجز:\n• I would like to book a room for two nights, please.\n• Do you have any available rooms? 🏨";
      return "للتعبير عن هذا الموقف بدقة:\n\"Excuse me, could you please help me with this?\"\nأخبرني بتفاصيل الموقف وسأعطيك أدق صياغة طبيعية! 💡";
    }

    // Grammar questions
    if (q.includes("مضارع بسيط") || q.includes("present simple")) {
      return "المضارع البسيط نستخدمه للعادات والحقائق اليومية ⏰\n• مع الجمع و I: نضع الفعل كما هو: (I play, They work).\n• مع المفرد (He, She, It): نضيف s للفعل: (He plays, She works).\nمثال: She drinks coffee every morning. ☕";
    }
    if (q.includes("ماضي") || q.includes("past simple")) {
      return "الماضي البسيط للأحداث التي انتهت ⏳\n• منتظم: نضيف ed مثل: visited, played.\n• غير منتظم: يتغير الفعل مثل: go → went, see → saw.\nمثال: Yesterday, I visited my family. 🏡";
    }
    if (q.includes("فرق بين a و an") || q.includes("a and an") || q.includes("ادوات التعريف")) {
      return "القاعدة سهلة جداً: 🍎\n• a قبل الكلمات التي تبدأ بحرف ساكن: a car, a book, a boy.\n• an قبل الكلمات التي تبدأ بصوت علة (a, e, i, o, u): an apple, an egg, an umbrella.\nالهدف هو سهولة النطق وانسيابيته!";
    }
    if (q.includes("have") || q.includes("has") || q.includes("مضارع تام")) {
      return "المضارع التام (have/has + التصريف الثالث) يربط الماضي بالحاضر 🔗\n• I have visited London twice (خبرة سابقة بدون تحديد زمن).\n• He has just arrived (حدث للتو).\nI/You/We/They تأخذ have، و He/She/It تأخذ has!";
    }

    // Sentence correction detection
    if (q.includes("goed") || q.includes("i go yesterday") || q.includes("he have") || q.includes("she play ")) {
      let fix = "";
      if (q.includes("goed")) fix = "انتبه يا بطل: الفعل go شاذ وماضيه هو went وليس goed.";
      else if (q.includes("he have")) fix = "مع المفرد الغائب He نستخدم has وليس have: He has a car.";
      else if (q.includes("i go yesterday")) fix = "بما أنك قلت yesterday (أمس) فيجب تحويل الفعل للماضي: I went yesterday.";
      else fix = "مع He/She/It نضيف s في المضارع: She plays tennis.";
      return `ملاحظة ذكية يا صديقي! 💡\n${fix}\nجرب كتابة الجملة مرة أخرى بعد التصحيح لنثبتها سوياً!`;
    }

    // Default constructive response
    return `فكرة ممتازة وتفكير رائع! 👏\nنصيحتي لك اليوم: ركّز على استخدام الجملة في محادثة يومية بصوت مسموع، فالنطق المتكرر يصنع الطلاقة الحقيقية.\nهل تود أن نتدرب على محادثة قصيرة حول هذا الموضوع؟ 💬`;
  }

  async generateSituationalSentence(situationArabic, tone = "normal") {
    // Generates sentence for "ماذا أقول الآن؟"
    const s = situationArabic.toLowerCase();
    let en = "Excuse me, could you please help me?";
    let ar = "عفواً، هل يمكنك مساعدتي من فضلك؟";

    if (s.includes("فندق") || s.includes("غرفة") || s.includes("حجز")) {
      if (tone === "أسهل وأبسط") {
        en = "I want a room, please.";
        ar = "أريد غرفة من فضلك.";
      } else if (tone === "أكثر تهذيباً ورسمية") {
        en = "Good evening. I would like to inquire about booking a room for three nights, please.";
        ar = "مساء الخير. أود الاستفسار عن حجز غرفة لثلاث ليالٍ من فضلك.";
      } else {
        en = "Hello, do you have a single room available for tonight?";
        ar = "مرحباً، هل يتوفر لديكم غرفة مفردة لليلة؟";
      }
    } else if (s.includes("مطعم") || s.includes("طلب") || s.includes("طعام") || s.includes("اكل")) {
      if (tone === "أسهل وأبسط") {
        en = "The menu, please.";
        ar = "قائمة الطعام من فضلك.";
      } else if (tone === "أكثر تهذيباً ورسمية") {
        en = "Could you please recommend your signature dish for dinner?";
        ar = "هل يمكن أن تنصحني بطبقكم المميز للعشاء من فضلك؟";
      } else {
        en = "Excuse me, I am ready to order the grilled chicken, please.";
        ar = "عفواً، أنا جاهز لطلب الدجاج المشوي من فضلك.";
      }
    } else if (s.includes("مطار") || s.includes("طيران") || s.includes("بوابة") || s.includes("حقيبة")) {
      if (tone === "أسهل وأبسط") {
        en = "Where is gate twelve?";
        ar = "أين البوابة رقم 12؟";
      } else if (tone === "أكثر تهذيباً ورسمية") {
        en = "Pardon me, could you kindly direct me to the baggage claim area?";
        ar = "عذراً، هل تتفضل بإرشادي إلى منطقة استلام الأمتعة؟";
      } else {
        en = "Excuse me, is this flight on time?";
        ar = "عفواً، هل هذه الرحلة في موعدها المحدد؟";
      }
    } else if (s.includes("مستشفى") || s.includes("طبيب") || s.includes("ألم") || s.includes("صداع")) {
      en = "I have a severe headache and fever. Could I see a doctor?";
      ar = "أعاني من صداع شديد وحمى. هل يمكنني مقابلة الطبيب؟";
    } else if (s.includes("تاكسي") || s.includes("طريق") || s.includes("عنوان")) {
      en = "Please take me to the city center as soon as possible.";
      ar = "من فضلك خذني إلى وسط المدينة في أسرع وقت ممكن.";
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
