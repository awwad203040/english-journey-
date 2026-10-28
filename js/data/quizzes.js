// English Journey - Quizzes and Assessments Data Bank
// Multiple Choice, Word Ordering, and Level Placement Tests

const QUIZZES = {
  placement: [
    { q: "Choose the correct pronoun: ___ am a student.", options: ["He", "I", "She"], correct: 1, explain: "نستخدم I للتحدث عن النفس مع am." },
    { q: "Choose the correct verb: He ___ to school every day.", options: ["go", "goes", "going"], correct: 1, explain: "مع المفرد الغائب He نضيف es للفعل في المضارع البسيط." },
    { q: "Choose the correct past form: We ___ a movie last night.", options: ["watch", "watched", "watches"], correct: 1, explain: "للماضي البسيط مع الأفعال المنتظمة نضيف ed." },
    { q: "Comparison: This car is ___ than that one.", options: ["big", "bigger", "biggest"], correct: 1, explain: "للمقارنة بين شيئين نضيف er للصفة القصيرة متبوعة بـ than." },
    { q: "Advice: You ___ drink more water.", options: ["should", "must to", "can to"], correct: 0, explain: "should تُستخدم للنصيحة ويأتي بعدها المصدر مجرداً." },
    { q: "Experience: I have never ___ to London.", options: ["be", "was", "been"], correct: 2, explain: "في المضارع التام نستخدم التصريف الثالث (been)." }
  ],

  new_friend: [
    { q: "من الطالب الجديد في القصة؟", options: ["Ali", "Ahmed", "Sara"], correct: 1, explain: "أحمد هو الطالب الجديد كما ورد في بداية القصة." },
    { q: "كيف شعر أحمد في البداية؟", options: ["Excited", "Nervous", "Angry"], correct: 1, explain: "شعر أحمد بشيء من التوتر (nervous) لأنه طالب جديد في بيئة جديدة." },
    { q: "ماذا فعل الولد عندما رأى أحمد؟", options: ["He smiled at him", "He ignored him", "He left"], correct: 0, explain: "ابتسم له الولد ورحّب به بلطف." },
    { q: "ما اسم الولد الذي رحّب بأحمد؟", options: ["Omar", "Ali", "Khalid"], correct: 1, explain: "اسمه علي (Ali) كما عرّف بنفسه." },
    { q: "ماذا قال أحمد لعلي رداً على ترحيبه؟", options: ["Goodbye", "Thank you! Nice to meet you.", "I am busy"], correct: 1, explain: "شكره وقال له سعيد بلقائك Nice to meet you." }
  ],

  first_day_work: [
    { q: "ما اسم بطلة القصة في أول يوم عمل؟", options: ["Laila", "Sara", "Mona"], correct: 1, explain: "سارة هي الموظفة الجديدة." },
    { q: "ماذا عرض عليها المدير في البداية؟", options: ["جولة في المكتب أو مقابلة الفريق", "مغادرة العمل فوراً", "البدء باختبار صعب"], correct: 0, explain: "خيّرها بين جولة أو مقابلة الفريق أولاً." },
    { q: "كيف شعرت سارة بعد ترحيب زملائها بها؟", options: ["بالغضب", "بالوحدة", "بالترحيب والانتماء للفريق"], correct: 2, explain: "شعرت بالترحيب وأنها جزء من الفريق فوراً." },
    { q: "ماذا طُلب من سارة في الاجتماع الأول؟", options: ["رأيها في مشروع جديد", "تحضير القهوة", "تنظيف المكتب"], correct: 0, explain: "سُئلت عن رأيها في مشروع جديد." },
    { q: "ما الدرس المستفاد من قصة سارة؟", options: ["مشاركة الرأي بثقة أمر قيّم حتى للموظف الجديد", "الصمت الدائم أفضل", "عدم التحدث مع المدير"], correct: 0, explain: "مشاركة الأفكار تظهر الثقة والمبادرة الإيجابية." }
  ],

  present: [
    { q: "اختر الجملة الصحيحة:", options: ["He go to school.", "He goes to school.", "He going to school."], correct: 1, explain: "مع He/She/It نضيف s أو es للفعل: goes." },
    { q: "اختر الجملة الصحيحة:", options: ["She play tennis.", "She plays tennis.", "She playing tennis."], correct: 1, explain: "مع She نضيف s للفعل: plays." },
    { q: "اختر الجملة الصحيحة:", options: ["I goes to work.", "I go to work.", "I going to work."], correct: 1, explain: "مع الضمير I نستخدم الفعل بالمصدر بدون s: go." },
    { q: "أكمل: They ___ football every Friday.", options: ["plays", "play", "playing"], correct: 1, explain: "مع They (جمع) نستخدم الفعل بدون s: play." },
    { q: "اختر السؤال الصحيح:", options: ["Does he plays tennis?", "Does he play tennis?", "Do he play tennis?"], correct: 1, explain: "مع Does نرجع الفعل للمصدر بدون s: play." },
    { q: "اختر النفي الصحيح:", options: ["She don't like tea.", "She doesn't likes tea.", "She doesn't like tea."], correct: 2, explain: "مع She نستخدم doesn't متبوعة بالمصدر مجرداً." },
    { q: "اختر الجملة الصحيحة:", options: ["We studies English.", "We study English.", "We studying English."], correct: 1, explain: "مع We نستخدم المصدر study." },
    { q: "اختر الجملة الصحيحة:", options: ["The sun rise in the east.", "The sun rises in the east.", "The sun rising in the east."], correct: 1, explain: "The sun بمثابة المفرد It، فنضيف s: rises." },
    { q: "اختر السؤال الصحيح:", options: ["Do you likes coffee?", "Does you like coffee?", "Do you like coffee?"], correct: 2, explain: "مع You نستخدم Do + المصدر." },
    { q: "اختر الجملة الصحيحة:", options: ["My brother drive a car.", "My brother drives a car.", "My brother driving a car."], correct: 1, explain: "My brother = He، فنضيف s: drives." },
    { type: "order", qEn: "Do you go to school every day?", qAr: "هل تذهب إلى المدرسة كل يوم؟", aEn: "Yes, I go to school every day.", aAr: "نعم، أذهب إلى المدرسة كل يوم." },
    { type: "order", qEn: "Does she play football every day?", qAr: "هل تلعب كرة القدم كل يوم؟", aEn: "Yes, she plays football every day.", aAr: "نعم، تلعب كرة القدم كل يوم." },
    { type: "order", qEn: "Does he watch TV every night?", qAr: "هل يشاهد التلفاز كل ليلة؟", aEn: "Yes, he watches TV every night.", aAr: "نعم، يشاهد التلفاز كل ليلة." },
    { type: "order", qEn: "Do you study English on Sundays?", qAr: "هل تدرسون الإنجليزية أيام الأحد؟", aEn: "Yes, we study English on Sundays.", aAr: "نعم، ندرس الإنجليزية أيام الأحد." },
    { type: "order", qEn: "Do they live in Riyadh?", qAr: "هل يعيشون في الرياض؟", aEn: "Yes, they live in Riyadh.", aAr: "نعم، يعيشون في الرياض." }
  ],

  pronouns: [
    { q: "اختر الضمير الصحيح: ___ am a student.", options: ["He", "I", "She"], correct: 1, explain: "نستخدم I للتحدث عن النفس." },
    { q: "اختر الضمير الصحيح: ___ is a doctor. (عن رجل)", options: ["She", "He", "They"], correct: 1, explain: "نستخدم He للمذكر الغائب." },
    { q: "اختر الضمير الصحيح: ___ is a teacher. (عن امرأة)", options: ["He", "It", "She"], correct: 2, explain: "نستخدم She للمؤنث الغائب." },
    { q: "اختر الضمير الصحيح: ___ is a small cat.", options: ["It", "He", "You"], correct: 0, explain: "نستخدم It لغير العاقل والمفرد." },
    { q: "اختر الضمير الصحيح: ___ are happy. (أنت وأصدقاؤك)", options: ["We", "I", "He"], correct: 0, explain: "نستخدم We للمتكلمين (نحن)." },
    { q: "اختر الضمير الصحيح: ___ are at school. (علي وسارة)", options: ["It", "They", "She"], correct: 1, explain: "نستخدم They للجمع الغائب." },
    { q: "اختر الضمير المناسب لـ Ahmed and I:", options: ["They", "We", "You"], correct: 1, explain: "أحمد وأنا = نحن (We)." },
    { q: "اختر الضمير المناسب لـ the books:", options: ["It", "They", "She"], correct: 1, explain: "جمع غير العاقل يُشار إليه بـ They." },
    { type: "order", qEn: "Are you a student?", qAr: "هل أنت طالب؟", aEn: "Yes, I am a student.", aAr: "نعم، أنا طالب." },
    { type: "order", qEn: "Am I your friend?", qAr: "هل أنا صديقك؟", aEn: "Yes, you are my friend.", aAr: "نعم، أنت صديقي." }
  ],

  tobe: [
    { q: "I ___ tired.", options: ["is", "am", "are"], correct: 1, explain: "مع I نستخدم am دائماً." },
    { q: "You ___ smart.", options: ["am", "is", "are"], correct: 2, explain: "مع You نستخدم are." },
    { q: "He ___ tall.", options: ["is", "am", "are"], correct: 0, explain: "مع He نستخدم is." },
    { q: "She ___ beautiful.", options: ["are", "is", "am"], correct: 1, explain: "مع She نستخدم is." },
    { q: "It ___ cold today.", options: ["is", "are", "am"], correct: 0, explain: "مع It نستخدم is." },
    { q: "We ___ ready.", options: ["is", "am", "are"], correct: 2, explain: "مع We نستخدم are." },
    { q: "They ___ students.", options: ["is", "am", "are"], correct: 2, explain: "مع They نستخدم are." },
    { q: "اختر النفي الصحيح: I ___ hungry.", options: ["am not", "isn't", "aren't"], correct: 0, explain: "نفي am هو am not." },
    { type: "order", qEn: "How do you feel?", qAr: "كيف تشعر؟", aEn: "I am tired.", aAr: "أنا متعب." },
    { type: "order", qEn: "Are you ready?", qAr: "هل أنتم جاهزون؟", aEn: "Yes, we are ready.", aAr: "نعم، نحن جاهزون." }
  ],

  plural: [
    { q: "ما جمع كلمة book؟", options: ["books", "bookes", "bookies"], correct: 0, explain: "نضيف s فقط: books." },
    { q: "ما جمع كلمة child؟", options: ["childs", "children", "childes"], correct: 1, explain: "جمع شاذ: children." },
    { q: "ما جمع كلمة man؟", options: ["mans", "men", "manes"], correct: 1, explain: "جمع شاذ: men." },
    { q: "ما جمع كلمة woman؟", options: ["womans", "women", "womens"], correct: 1, explain: "جمع شاذ: women." },
    { q: "ما جمع كلمة box؟", options: ["boxs", "boxes", "boxies"], correct: 1, explain: "الكلمات المنتهية بـ x نضيف لها es: boxes." },
    { q: "ما جمع كلمة city؟", options: ["citys", "cities", "cityes"], correct: 1, explain: "تنتهي بـ y وقبلها ساكن فنحولها إلى ies: cities." },
    { type: "order", qEn: "How many apples do you have?", qAr: "كم تفاحة لديك؟", aEn: "I have two apples.", aAr: "لدي تفاحتان." },
    { type: "order", qEn: "How many cats are there?", qAr: "كم قطة يوجد؟", aEn: "There are three cats.", aAr: "يوجد ثلاث قطط." }
  ],

  articles: [
    { q: "I have ___ car.", options: ["a", "an", "the"], correct: 0, explain: "car تبدأ بصوت ساكن فنضع a." },
    { q: "She has ___ apple.", options: ["a", "an", "the"], correct: 1, explain: "apple تبدأ بصوت متحرك فنضع an." },
    { q: "He is ___ engineer.", options: ["a", "an", "the"], correct: 1, explain: "engineer تبدأ بصوت متحرك فنضع an." },
    { q: "___ sun is shining brightly.", options: ["A", "An", "The"], correct: 2, explain: "الشمس شيء فريد ومعروف فنستخدم The." },
    { q: "I need ___ umbrella.", options: ["a", "an", "the"], correct: 1, explain: "umbrella تبدأ بصوت علة فنضع an." },
    { type: "order", qEn: "Do you have a car?", qAr: "هل لديك سيارة؟", aEn: "Yes, I have a car.", aAr: "نعم، لدي سيارة." },
    { type: "order", qEn: "Does she have an apple?", qAr: "هل لديها تفاحة؟", aEn: "Yes, she has an apple.", aAr: "نعم، لديها تفاحة." }
  ],

  negatives_questions: [
    { q: "اختر النفي الصحيح: I ___ like coffee.", options: ["doesn't", "don't", "not"], correct: 1, explain: "مع I نستخدم don't." },
    { q: "اختر النفي الصحيح: She ___ eat meat.", options: ["don't", "doesn't", "not"], correct: 1, explain: "مع She نستخدم doesn't." },
    { q: "اختر السؤال الصحيح:", options: ["Does you speak English?", "Do you speak English?", "Do you speaks English?"], correct: 1, explain: "مع You نستخدم Do + المصدر." },
    { q: "اختر السؤال الصحيح:", options: ["Does he play football?", "Do he play football?", "Does he plays football?"], correct: 0, explain: "مع He نستخدم Does + المصدر." },
    { type: "order", qEn: "Do you like coffee?", qAr: "هل تحب القهوة؟", aEn: "No, I do not like coffee.", aAr: "لا، لا أحب القهوة." },
    { type: "order", qEn: "Does she eat meat?", qAr: "هل تأكل اللحم؟", aEn: "No, she does not eat meat.", aAr: "لا، هي لا تأكل اللحم." }
  ],

  prepositions: [
    { q: "The book is ___ the table.", options: ["in", "on", "under"], correct: 1, explain: "على سطح الطاولة نستخدم on." },
    { q: "The cat is ___ the chair.", options: ["under", "on", "in"], correct: 0, explain: "تحت الكرسي نستخدم under." },
    { q: "I live ___ Riyadh.", options: ["on", "at", "in"], correct: 2, explain: "للمدن والدول نستخدم in." },
    { q: "The keys are ___ my bag.", options: ["on", "in", "under"], correct: 1, explain: "داخل الحقيبة المغلقة نستخدم in." },
    { type: "order", qEn: "Where is the book?", qAr: "أين الكتاب؟", aEn: "The book is on the table.", aAr: "الكتاب على الطاولة." },
    { type: "order", qEn: "Where do you live?", qAr: "أين تعيش؟", aEn: "I live in Riyadh.", aAr: "أعيش في الرياض." }
  ],

  past_simple: [
    { q: "I ___ my grandmother yesterday.", options: ["visit", "visited", "visiting"], correct: 1, explain: "حدث في الماضي البسيط: نضيف ed." },
    { q: "He ___ to Jeddah last summer.", options: ["go", "goes", "went"], correct: 2, explain: "go فعل شاذ ماضيه went." },
    { q: "Did you ___ your homework?", options: ["finish", "finished", "finishes"], correct: 0, explain: "بعد Did في السؤال نرجع الفعل إلى المصدر: finish." },
    { q: "They ___ dinner at eight.", options: ["eat", "ate", "eats"], correct: 1, explain: "eat فعل شاذ ماضيه ate." },
    { type: "order", qEn: "Did you visit your grandmother?", qAr: "هل زرت جدتك؟", aEn: "Yes, I visited my grandmother yesterday.", aAr: "نعم، زرت جدتي أمس." },
    { type: "order", qEn: "Where did he go last summer?", qAr: "أين ذهب الصيف الماضي؟", aEn: "He went to Jeddah last summer.", aAr: "ذهب إلى جدة الصيف الماضي." }
  ],

  comparatives: [
    { q: "This car is ___ than that one.", options: ["big", "bigger", "biggest"], correct: 1, explain: "للمقارنة بين اثنين نضيف er: bigger." },
    { q: "She is ___ than her brother.", options: ["tall", "taller", "tallest"], correct: 1, explain: "للمقارنة نضيف er: taller." },
    { q: "This is the ___ city in the country.", options: ["big", "bigger", "biggest"], correct: 2, explain: "للتفضيل المطلق نستخدم the + صفة-est: the biggest." },
    { q: "This book is ___ interesting than that one.", options: ["more", "most", "much"], correct: 0, explain: "الصفات الطويلة في المقارنة تأخذ more." },
    { type: "order", qEn: "Which car is bigger?", qAr: "أي سيارة أكبر؟", aEn: "This car is bigger than that one.", aAr: "هذه السيارة أكبر من تلك." },
    { type: "order", qEn: "Who is taller, she or her brother?", qAr: "من أطول، هي أم أخوها؟", aEn: "She is taller than her brother.", aAr: "هي أطول من أخيها." }
  ],

  future: [
    { q: "I ___ call you later.", options: ["will", "am", "do"], correct: 0, explain: "للقرار الفوري نستخدم will." },
    { q: "We are ___ visit Makkah next month.", options: ["will", "going to", "go"], correct: 1, explain: "للخطط والترتيبات المسبقة نستخدم are going to." },
    { q: "She is going ___ study medicine.", options: ["to", "will", "for"], correct: 0, explain: "صيغة going to تتبع بـ to والمصدر." },
    { type: "order", qEn: "Will you call me later?", qAr: "هل ستتصل بي لاحقاً؟", aEn: "Yes, I will call you later.", aAr: "نعم، سأتصل بك لاحقاً." },
    { type: "order", qEn: "What are you going to do next month?", qAr: "ماذا ستفعلون الشهر القادم؟", aEn: "We are going to visit Makkah next month.", aAr: "سنزور مكة الشهر القادم." }
  ],

  present_perfect: [
    { q: "I ___ visited London twice.", options: ["have", "has", "had"], correct: 0, explain: "مع الضمير I نستخدم have." },
    { q: "She ___ finished her homework.", options: ["have", "has", "had"], correct: 1, explain: "مع المفرد She نستخدم has." },
    { q: "We have never ___ sushi.", options: ["eat", "ate", "eaten"], correct: 2, explain: "بعد have نستخدم التصريف الثالث (eaten)." },
    { q: "I have lived here ___ five years.", options: ["since", "for", "from"], correct: 1, explain: "مع المدة الزمنية غير المحددة ببداية نستخدم for." },
    { type: "order", qEn: "Have you ever visited London?", qAr: "هل زرت لندن من قبل؟", aEn: "Yes, I have visited London twice.", aAr: "نعم، زرت لندن مرتين." },
    { type: "order", qEn: "Has she finished her homework?", qAr: "هل أنهت واجبها؟", aEn: "Yes, she has finished her homework.", aAr: "نعم، أنهت واجبها." }
  ],

  modals: [
    { q: "I ___ swim very well.", options: ["can", "must", "should"], correct: 0, explain: "للقدرة والاستطاعة نستخدم can." },
    { q: "You ___ wear a seatbelt.", options: ["can", "must", "could"], correct: 1, explain: "للإلزام والقانون نستخدم must." },
    { q: "She ___ drink more water.", options: ["should", "must", "can"], correct: 0, explain: "للنصيحة نستخدم should." },
    { q: "He can ___ three languages.", options: ["speak", "speaks", "speaking"], correct: 0, explain: "بعد can يأتي الفعل بالمصدر بدون إضافات." },
    { type: "order", qEn: "Can you swim?", qAr: "هل تستطيع السباحة؟", aEn: "Yes, I can swim very well.", aAr: "نعم، أستطيع السباحة بشكل جيد جداً." },
    { type: "order", qEn: "Must I wear a seatbelt?", qAr: "هل يجب أن أرتدي حزام الأمان؟", aEn: "Yes, you must wear a seatbelt.", aAr: "نعم، يجب أن ترتدي حزام الأمان." }
  ],

  first_conditional: [
    { q: "If it rains, I ___ stay home.", options: ["will", "am", "do"], correct: 0, explain: "جواب الشرط في الحالة الأولى يأخذ will + المصدر." },
    { q: "If you study hard, you ___ pass the exam.", options: ["will", "are", "did"], correct: 0, explain: "جواب الشرط يأخذ will." },
    { q: "If she calls me, I ___ answer.", options: ["will", "am", "do"], correct: 0, explain: "جواب الشرط يأخذ will." },
    { type: "order", qEn: "What will you do if it rains?", qAr: "ماذا ستفعل إذا أمطرت؟", aEn: "If it rains, I will stay home.", aAr: "إذا أمطرت، سأبقى في المنزل." }
  ],

  passive: [
    { q: "Portuguese ___ spoken in Brazil.", options: ["is", "are", "was"], correct: 0, explain: "اللغة مفرد وهي حقيقة حالية: is spoken." },
    { q: "This house ___ built in 1990.", options: ["is", "was", "were"], correct: 1, explain: "حدث ماضٍ ومفرد: was built." },
    { q: "Cars ___ made in factories.", options: ["is", "are", "was"], correct: 1, explain: "السيارات جمع فنستخدم are made." },
    { type: "order", qEn: "Who built this house?", qAr: "من بنى هذا المنزل؟", aEn: "This house was built in 1990.", aAr: "بُني هذا المنزل عام 1990." }
  ],

  relative_clauses: [
    { q: "The teacher ___ helped me is kind.", options: ["which", "who", "where"], correct: 1, explain: "who للعاقل." },
    { q: "The book ___ is on the table is mine.", options: ["who", "which", "whose"], correct: 1, explain: "which لغير العاقل." },
    { q: "He is the man ___ car was stolen.", options: ["who", "which", "whose"], correct: 2, explain: "whose للملكية." },
    { type: "order", qEn: "Which teacher helped you?", qAr: "أي معلم ساعدك؟", aEn: "The teacher who helped me is very kind.", aAr: "المعلم الذي ساعدني لطيف جداً." }
  ],

  reported_speech: [
    { q: "She said that she ___ tired.", options: ["is", "was", "be"], correct: 1, explain: "نرجع بالزمن خطوة للماضي: was." },
    { q: "He told me that he ___ call later.", options: ["will", "would", "was"], correct: 1, explain: "will تتحول إلى would." },
    { q: "They said that they ___ finished the work.", options: ["have", "had", "has"], correct: 1, explain: "have تتحول إلى had." },
    { type: "order", qEn: "What did she say?", qAr: "ماذا قالت؟", aEn: "She said that she was tired.", aAr: "قالت إنها كانت متعبة." }
  ],

  second_conditional: [
    { q: "If I ___ the lottery, I would travel the world.", options: ["win", "won", "will win"], correct: 1, explain: "فعل الشرط في الحالة الثانية يكون في الماضي البسيط: won." },
    { q: "If I ___ the president, I would improve education.", options: ["am", "was", "were"], correct: 2, explain: "في الافتراضات غير الحقيقية نفضل were لجميع الضمائر." },
    { q: "If he knew the truth, he ___ be shocked.", options: ["will", "would", "can"], correct: 1, explain: "جواب الشرط في الحالة الثانية يأخذ would." },
    { type: "order", qEn: "What would you do if you won the lottery?", qAr: "ماذا ستفعل لو ربحت اليانصيب؟", aEn: "If I won the lottery, I would travel the world.", aAr: "لو ربحت اليانصيب، لسافرت حول العالم." }
  ],

  inversion: [
    { q: "___ have I seen such a beautiful place.", options: ["Never", "Not", "No"], correct: 0, explain: "Never في بداية الجملة تقلب ترتيب الفاعل والفعل." },
    { q: "___ does he complain about anything.", options: ["Rare", "Rarely", "Rarest"], correct: 1, explain: "Rarely ظرف نفي يبدأ به التوكيد." },
    { q: "Not only ___ she cry, but she also apologized.", options: ["did", "does", "do"], correct: 0, explain: "في الماضي نستخدم الفعل المساعد did." },
    { type: "order", qEn: "Have you ever seen such a beautiful place?", qAr: "هل رأيت مكاناً بهذا الجمال من قبل؟", aEn: "Never have I seen such a beautiful place.", aAr: "لم أرَ أبداً مكاناً بهذا الجمال." }
  ],

  advanced_connectors: [
    { q: "He was tired; ___, he still went to work.", options: ["however", "because", "so"], correct: 0, explain: "however تفيد التناقض والاستدراك." },
    { q: "She studied hard; ___, she passed the exam.", options: ["however", "therefore", "but"], correct: 1, explain: "therefore تفيد النتيجة والسببية." },
    { q: "The plan failed; ___, it cost a lot of money.", options: ["moreover", "so", "because"], correct: 0, explain: "moreover تفيد الإضافة والتعزيز." },
    { type: "order", qEn: "He was tired. Did he still go to work?", qAr: "كان متعباً. هل ذهب للعمل رغم ذلك؟", aEn: "He was tired; however, he still went to work.", aAr: "كان متعباً؛ ومع ذلك، ذهب للعمل." }
  ],

  emphasis: [
    { q: "It ___ Ali who broke the window.", options: ["was", "is being", "were"], correct: 0, explain: "تركيب التوكيد يبدأ بـ It was." },
    { q: "It was my phone ___ I lost yesterday.", options: ["who", "that", "which"], correct: 1, explain: "that تُستخدم في تركيب التوكيد للأشياء." },
    { q: "What I really need ___ more time.", options: ["is", "are", "be"], correct: 0, explain: "جملة What الفاعل مفرد فيأخذ is." },
    { type: "order", qEn: "Who broke the window?", qAr: "من كسر النافذة؟", aEn: "It was Ali who broke the window.", aAr: "علي هو من كسر النافذة." }
  ],

  mixed_conditionals: [
    { q: "If I hadn't stayed up late, I ___ tired now.", options: ["wouldn't be", "won't be", "wasn't"], correct: 0, explain: "النتيجة في الحاضر تأخذ wouldn't be." },
    { q: "If he had studied French, he ___ it well now.", options: ["would speak", "will speak", "spoke"], correct: 0, explain: "النتيجة الحاضرة تأخذ would + المصدر." },
    { q: "If we had brought a map, we ___ lost right now.", options: ["wouldn't be", "aren't", "won't be"], correct: 0, explain: "شرط ماضٍ مع نتيجة حاضرة." },
    { type: "order", qEn: "Why are you so tired now?", qAr: "لماذا أنت متعب جداً الآن؟", aEn: "If I hadn't stayed up late, I wouldn't be tired now.", aAr: "لو لم أسهر، لما كنت متعباً الآن." }
  ],

  // Lesson Quizzes
  greet: [
    { q: "What do you say to greet someone before noon?", options: ["Good evening", "Good morning", "Good night"], correct: 1, explain: "Good morning تُقال في الصباح الباكر وقبل الظهر." },
    { q: "What is the reply to 'How are you?'", options: ["I am fine, thank you", "My name is Sara", "See you later"], correct: 0, explain: "هذا هو الرد اللائق والشائع للسؤال عن الحال." },
    { q: "What do you say when you meet someone for the first time?", options: ["Nice to meet you", "Take care", "Welcome"], correct: 0, explain: "Nice to meet you تعني سعدت بلقائك." },
    { q: "What do you say before going to sleep?", options: ["Good morning", "Good night", "Goodbye"], correct: 1, explain: "Good night تُقال عند توديع الأهل أو النوم." },
    { q: "Which question asks about someone's name?", options: ["Where are you from?", "What is your name?", "How old are you?"], correct: 1, explain: "What is your name? تسأل عن الاسم تحديداً." },
    { q: "How do you reply when someone says 'Thank you'?", options: ["You are welcome", "Good morning", "See you later"], correct: 0, explain: "You are welcome تعني عفواً أو على الرحب والسعة." }
  ],

  family: [
    { q: "What do you call your father's brother?", options: ["Uncle", "Cousin", "Grandfather"], correct: 0, explain: "أخ الأب أو الأم هو Uncle (العم أو الخال)." },
    { q: "What do you call your mother's sister?", options: ["Aunt", "Sister", "Grandmother"], correct: 0, explain: "أخت الأم أو الأب هي Aunt (الخالة أو العمة)." },
    { q: "What do you call your father's father?", options: ["Grandfather", "Uncle", "Cousin"], correct: 0, explain: "والد الأب أو الأم هو Grandfather (الجد)." },
    { q: "What is the son of your uncle called?", options: ["Cousin", "Brother", "Nephew"], correct: 0, explain: "ابن العم أو الخال هو Cousin." }
  ],

  airport: [
    { q: "Where do you go to leave your big bags before the flight?", options: ["The gate", "The check-in desk", "The baggage claim"], correct: 1, explain: "check-in desk هو مكتب تسجيل الأمتعة." },
    { q: "Which seat is next to the window?", options: ["A window seat", "A middle seat", "An aisle seat"], correct: 0, explain: "window seat تعني مقعداً بجانب النافذة." },
    { q: "Where do you collect your bags after landing?", options: ["The check-in desk", "The baggage claim", "The gate"], correct: 1, explain: "baggage claim تعني استلام الحقائب والأمتعة." },
    { q: "'The flight is delayed' means:", options: ["الرحلة مبكرة", "الرحلة متأخرة", "الرحلة ملغاة"], correct: 1, explain: "delayed تعني متأخرة عن موعدها المحدد." }
  ],

  hotel: [
    { q: "How do you say you already booked a room?", options: ["I have a hotel", "I have a room key", "I have a reservation"], correct: 2, explain: "reservation تعني حجزاً مؤكداً مسبقاً." },
    { q: "What is 'check-out'?", options: ["الوصول للفندق", "المغادرة من الفندق", "حجز الغرفة"], correct: 1, explain: "check-out تعني تسجيل المغادرة ودفع الفاتورة." },
    { q: "A room for one person is called:", options: ["a double room", "a single room", "a suite"], correct: 1, explain: "single room تعني غرفة مفردة لشخص واحد." }
  ],

  restaurant: [
    { q: "A menu shows:", options: ["the list of food and drinks", "the bill only", "the table number only"], correct: 0, explain: "menu هي قائمة الطعام والأسعار." },
    { q: "Are you ready to order? — Yes, I ___ the grilled chicken.", options: ["am like", "would liking", "would like"], correct: 2, explain: "would like تعني أود (طلب مهذب)." },
    { q: "How do you ask for the bill politely?", options: ["Money now!", "Where is food?", "Can we have the bill, please?"], correct: 2, explain: "Can we have the bill, please? هي العبارة المهذبة لطلب الفاتورة." }
  ]
};
