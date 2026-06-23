"use client";

import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

type Locale = "en" | "ru" | "uz";
type Tri<T> = { en: T; ru: T; uz: T };

type Era = {
  year: string;
  ruler?: string;
  headline: Tri<string>;
  body: Tri<string>;
};

const TITLE: Tri<string> = {
  en: "A century of one palace",
  ru: "Век одного дворца",
  uz: "Bir saroyning bir asri",
};

const SUBTITLE: Tri<string> = {
  en: "From the first stones laid for an Emir to a state-protected museum",
  ru: "От первых камней эмирской усадьбы до государственного музея-заповедника",
  uz: "Amir uchun qoʻyilgan birinchi toshlardan davlat muhofazasidagi muzey-qoʻriqxonagacha",
};

const BACK: Tri<string> = {
  en: "Back to the palace",
  ru: "Назад ко дворцу",
  uz: "Saroyga qaytish",
};

const SOURCE_NOTE: Tri<string> = {
  en: "Source: master’s dissertation by Sh.K. Roziqulova on the museification of Sitorai Mohi Xossa (XX–XXI cc.), National Institute of Painting and Design named after K. Behzod, Tashkent, 2026.",
  ru: "Источник: магистерская диссертация Розикуловой Ш.К. о процессах музеефикации Ситораи Мохи Хосса (XX–XXI вв.), Национальный институт живописи и дизайна имени К. Бехзода, Ташкент, 2026.",
  uz: "Manba: Roʻziqulova Sh.K. magistrlik dissertatsiyasi — Sitorai Mohi Xossa muzeylashtirish jarayonlari (XX–XXI asrlar), K. Behzod nomidagi Milliy rassomlik va dizayn instituti, Toshkent, 2026.",
};

const ERAS: Era[] = [
  {
    year: "1826–1860",
    ruler: "Nasrulla-khan",
    headline: {
      en: "First stones",
      ru: "Первые камни",
      uz: "Dastlabki toshlar",
    },
    body: {
      en: "Under Amir Nasrulla-khan the site north of Bukhara is chosen and the engineering basis of a future palace is laid down. The country keeps internal stability while its foreign policy slides towards Russia — and Bukharan rulers begin to make their wealth visible through buildings.",
      ru: "При амире Насрулла-хане выбран участок к северу от Бухары и заложены инженерные основы будущего дворца. Страна сохраняет внутреннюю стабильность, но во внешней политике начинается сближение с Россией — и бухарские правители всё чаще делают своё могущество видимым через здания.",
      uz: "Amir Nasrulloxon davrida Buxoroning shimolida hudud tanlanadi va boʻlajak saroyning muhandislik asoslari qoʻyiladi. Mamlakat ichki barqarorlikni saqlab turadi, biroq tashqi siyosatda Rossiya bilan munosabatlar yaqinlashadi — buxoro hukmdorlari oʻz qudratini binolar orqali namoyon qila boshlaydi.",
    },
  },
  {
    year: "1860–1885",
    ruler: "Muzaffar-khan",
    headline: {
      en: "The project drawn",
      ru: "Проект на бумаге",
      uz: "Loyiha qog‘ozga tushadi",
    },
    body: {
      en: "Under Amir Muzaffar-khan the project of the future palace is drawn up by master architect Ostonqul Hafizov — one of the gifted builders of his generation who tries to braid Eastern tradition with European modernity. Earlier masters — usta Hoji Hafiz and usta Nasrulloboy — work the initial designs of the gardens and courtyards. Construction is not yet complete, but the palace’s shape on paper is already set.",
      ru: "При амире Музаффар-хане проект будущего дворца разрабатывает архитектор Усто Остонкул Хафизов — один из самых одарённых мастеров своего поколения, пытающийся соединить восточную традицию с европейской современностью. Ранее усто Хаджи Хафиз и усто Насруллобой работают над начальными проектами садов и двориков. Строительство ещё не завершено, но облик дворца на бумаге уже задан.",
      uz: "Amir Muzaffarxon davrida boʻlajak saroyning loyihasi meʼmor Usto Ostonqul Hafizov tomonidan tuziladi — sharqona an'ana bilan yevropacha zamonaviylikni birlashtirishga uringan oʻz davrining isteʼdodli ustalaridan biri. Bundan oldin usto Hoji Hafiz va usto Nasrulloboy bogʻ va hovlilarning dastlabki loyihalari ustida ishlaydi. Qurilish hali tugamagan, ammo saroyning qogʻozdagi qiyofasi belgilangan.",
    },
  },
  {
    year: "1885–1910",
    ruler: "Abdulahad Bahodir-khan",
    headline: {
      en: "The palace takes form",
      ru: "Дворец обретает форму",
      uz: "Saroy oʻz qiyofasini topadi",
    },
    body: {
      en: "Amir Abdulahad Bahodir-khan turns the modest residence into a full complex. The main buildings, ayvans, rose gardens and courtyards rise; the two marble lions at the entrance — carved from Nurata stone — are commissioned by local masters. European volume meets Bukharan ornament, and the place is given its name: Sitorai Mohi Xosa — “the palace of a star resembling the moon”.",
      ru: "Амир Абдулахад Бахадур-хан превращает скромную резиденцию в полноценный комплекс. Возводятся основные здания, айваны, розарии и дворики; у входа местные мастера высекают двух мраморных львов из нуратского камня. Европейская объёмность встречается с бухарским орнаментом — и место получает имя: Ситораи Мохи Хоса, «дворец звезды, подобной луне».",
      uz: "Amir Abdulahad Bahodirxon oddiy qarorgohni toʻliq majmuaga aylantiradi. Asosiy binolar, ayvonlar, gulzorlar va hovlilar qad rostlaydi; kiraverishdagi ikkita marmar sher — Nurota toshidan — mahalliy ustalar tomonidan yoʻniladi. Yevropacha hajm Buxoro naqshlari bilan birlashadi va joy oʻz nomini oladi: Sitorai Mohi Xosa — «oyga oʻxshash yulduz saroyi».",
    },
  },
  {
    year: "1912–1914",
    ruler: "Sayyid Olim-khan",
    headline: {
      en: "The White Hall",
      ru: "Белый зал",
      uz: "Oq Zal",
    },
    body: {
      en: "Two years of carving by Usto Shirin Muradov and thirty masters. Mirror set into ganch multiplies a single candle into forty reflections. Outside in the Banquet Hall, Bukharan carvers Abdulla G‘afurov and Qori Cho‘bin work the figured ceiling; German fireplaces are installed, a Russian cabinet with Venetian glass arrives. Master architect Mirzo Ustomiddin Sarkor signs off on the whole structure.",
      ru: "Два года резьбы Усто Ширина Мурадова и тридцати мастеров. Зеркало в ганчевой решётке умножает одну свечу в сорок отражений. В Банкетном зале бухарские резчики Абдулла Гафуров и Кари Чубин работают фигурный потолок; устанавливают немецкие печи, прибывает российский шкаф с венецианским стеклом. Под общим руководством мастера-архитектора Мирзо Устомиддина Саркора.",
      uz: "Usto Shirin Murodov va oʻttiz ustaning ikki yillik oʻyma ishi. Ganchga oʻrnatilgan oyna bir shamning yorugʻini qirq aksga koʻpaytiradi. Ziyofat zalida buxorolik oʻymakorlar Abdulla Gʻafurov va Qori Choʻbin figurali shiftni ishlaydi; nemis pechlari oʻrnatiladi, Venetsiya shishali rus javoni keladi. Hammasiga me'mor Mirzo Ustomiddin Sarkor rahbarlik qiladi.",
    },
  },
  {
    year: "1917",
    headline: {
      en: "The last reception",
      ru: "Последний приём",
      uz: "Soʻnggi qabul",
    },
    body: {
      en: "Six hundred candles, no electric light. The Emir’s photographer Sergei Prokudin-Gorsky says afterwards he has never seen a room so full of light from so few sources. Three years later the emirate is gone.",
      ru: "Шестьсот свечей, без электрического света. Фотограф эмира Сергей Прокудин-Горский потом скажет, что никогда не видел комнаты, в которой столько света исходило бы из такого малого числа источников. Через три года эмират прекратит существование.",
      uz: "Olti yuz sham, elektr yoʻq. Amirning fotografi Sergey Prokudin-Gorskiy keyin: «Men hech qachon shuncha oz manbadan shuncha yorugʻ boʻlgan xonani koʻrmaganman», deydi. Uch yildan keyin amirlik tamom boʻladi.",
    },
  },
  {
    year: "1920",
    headline: {
      en: "The emirate ends — the palace is looted",
      ru: "Конец эмирата — дворец разграблен",
      uz: "Amirlik tugaydi — saroy talab ketadi",
    },
    body: {
      en: "On 2 September 1920 the rule of Sayyid Olim-khan formally ends. Red Army troops take the palace; ornamental trees and the rose gardens are trampled, the gateway portal is shot at and the architectural ornaments damaged in dozens of places. To stop the looting, Fayzulla Xoʻjayev — head of the Bukhara People’s Republic — turns the building into the official government residence, and the first Congress of the Republic is held in its halls that October. Usto Shirin Muradov refuses to flee with the Emir to Afghanistan and stays.",
      ru: "2 сентября 1920 года формально завершается правление Саида Олим-хана. Красная армия занимает дворец; декоративные деревья и розарии вытоптаны, портал ворот расстрелян, архитектурные узоры повреждены в десятках мест. Чтобы остановить мародёрство, Файзулла Ходжаев — глава Бухарской Народной Республики — превращает здание в официальную резиденцию правительства, и в октябре того же года в его залах проводят первый Курултай Республики. Усто Ширин Мурадов отказывается бежать с эмиром в Афганистан и остаётся.",
      uz: "1920-yil 2-sentyabrda Sayyid Olimxonning hukmronligi rasman tugaydi. Qizil qo‘shin saroyni egallaydi; bezakli daraxtlar va gulzorlar oyoq tagiga bosiladi, darvozaning peshtog‘i o‘qqa tutilib, me'moriy bezaklar o‘nlab joyda shikastlanadi. Talonchilikni to‘xtatish uchun Buxoro Xalq Respublikasi rahbari Fayzulla Xo‘jayev binoni rasmiy hukumat qarorgohiga aylantiradi, va o‘sha yilning oktyabrida uning zallarida Respublika birinchi qurultoyi o‘tkaziladi. Usto Shirin Murodov amir bilan Afg‘onistonga qochishni rad etib, o‘z yurtida qoladi.",
    },
  },
  {
    year: "1922",
    headline: {
      en: "Bukhara’s first museum",
      ru: "Первый бухарский музей",
      uz: "Buxoroning birinchi muzeyi",
    },
    body: {
      en: "On 8 November 1922 the city’s first official museum opens in the former Russo-Chinese bank building — Bukhara State Museum. The proposal at the opening: name it after Qori Yoʻldosh. Five rooms, a theatre, a library and a club share the building.",
      ru: "8 ноября 1922 года в здании бывшего Русско-Китайского банка открывается первый официальный музей города — Бухарский государственный музей. На церемонии открытия звучит предложение: назвать его именем Кари Юлдоша. Пять залов, театр, библиотека и клуб делят здание.",
      uz: "1922-yil 8-noyabrda sobiq Rus-Xitoy banki binosida shahar birinchi rasmiy muzeyi — Buxoro davlat muzeyi ochiladi. Ochilish marosimida muzeyni Qori Yoʻldosh nomi bilan atash taklif qilinadi. Besh xona, teatr, kutubxona va klub bir binoda joylashadi.",
    },
  },
  {
    year: "1923",
    headline: {
      en: "The fire of autumn 1923",
      ru: "Пожар осени 1923 года",
      uz: "1923-yil kuzgi yong‘in",
    },
    body: {
      en: "After the government moves back to the city centre the palace is left empty. In autumn 1923 peasants carelessly burning hay set fire to some of the buildings — it takes five hours for the villagers to put it out. The episode lays bare the absence of any fire-safety arrangement or legal protection. The Bukhara Central Executive Committee is forced to issue an emergency directive.",
      ru: "После того как правительство возвращается в центр города, дворец оставляют пустым. Осенью 1923 года крестьяне неосторожно жгут солому и подпаливают часть построек — пять часов сельчане тушат пожар. Эпизод обнажает полное отсутствие пожарной охраны и правовой защиты. Бухарский Центральный исполнительный комитет вынужден издать срочное предписание.",
      uz: "Hukumat shahar markaziga qaytib o‘rnashgach, saroy bo‘sh qoladi. 1923-yil kuzida dehqonlar somon yoqayotib ehtiyotsizlik bilan binolarning bir qismiga o‘t qo‘yib yuboradi — qishloq aholisi besh soat davomida o‘chiradi. Hodisa yong‘in xavfsizligi va huquqiy muhofazaning batamom yo‘qligini ochib tashlaydi. Buxoro Markaziy ijroiya qo‘mitasi shoshilinch yo‘riqnoma chiqarishga majbur bo‘ladi.",
    },
  },
  {
    year: "1927",
    headline: {
      en: "First branch museum opens",
      ru: "Открыт первый филиал-музей",
      uz: "Birinchi filial-muzey ochiladi",
    },
    body: {
      en: "On the initiative of Muso Saidjonov (Minister of Education), Abdurauf Fitrat and Abdulvohid Burhonov, the «Sredazkomstaris» committee opens the first branch museum here — «Life of the Last Emirs’ Dynasty». Display cases show jewellery, gold-thread embroidery, pottery and coppersmith work. Funds and qualified curators are scarce, but the foundation of professional museum work in Bukhara is laid.",
      ru: "По инициативе Мусо Саиджанова (нарком просвещения), Абдурауфа Фитрата и Абдулвохида Бурханова комитет «Среазкомстарис» открывает здесь первый филиал-музей — «Жизнь последней эмирской династии». В витринах — ювелирные изделия, зардузи, керамика, медная посуда. Денег и квалифицированных хранителей не хватает, но фундамент профессиональной музейной работы в Бухаре заложен.",
      uz: "Muso Saidjonov (Maorif noziri), Abdurauf Fitrat va Abdulvohid Burhonov tashabbusi bilan «Sredazkomstaris» qo‘mitasi shu yerda birinchi filial-muzeyni — «So‘nggi amirlar sulolasining turmushi» — ochadi. Vitrinalarda zargarlik, zardo‘zlik, kulolchilik, misgarlik buyumlari. Mablag‘ va malakali kadr yetishmaydi, ammo Buxoroda professional muzey ishining poydevori qo‘yiladi.",
    },
  },
  {
    year: "1931",
    headline: {
      en: "The palace becomes a museum",
      ru: "Дворец становится музеем",
      uz: "Saroy muzeyga aylanadi",
    },
    body: {
      en: "Sitorai Mohi Xosa begins life as a museum. The garden is partially turned into a sanatorium. The household goods, jewellery and ethnographic objects of the Emir’s court — those that survived inventory — go on display for a public visiting where their owners once banqueted.",
      ru: "Ситораи Мохи Хоса начинает работать как музей. Часть бога превращают в санаторий. Утварь, ювелирные изделия и этнографические предметы эмирского двора — те, что пережили инвентаризацию, — выставляют для публики там, где когда-то пировали их владельцы.",
      uz: "Sitorai Mohi Xosa muzey sifatida faoliyat boshlaydi. Bogʻning bir qismi sanatoriyga aylantiriladi. Amir saroyining roʻzgʻor buyumlari, zargarlik va etnografik ashyolar — roʻyxatdan oʻtganlari — egalari ziyofat qilgan joylarda omma uchun namoyish etiladi.",
    },
  },
  {
    year: "1937",
    headline: {
      en: "Vinogradov’s drawings",
      ru: "Чертежи Виноградова",
      uz: "Vinogradov chizmalari",
    },
    body: {
      en: "Architect-restorer Vinogradov, an academician, draws the palace sheet by sheet — walls of two and one storeys, the deep niches and ayvans, the carved ceilings. His blueprints become the reference document for every restoration that follows.",
      ru: "Архитектор-реставратор академик Виноградов чертит дворец лист за листом — стены в два и один этаж, глубокие ниши и айваны, резные потолки. Его чертежи станут эталонным документом для каждой последующей реставрации.",
      uz: "Akademik me'mor-restavrator Vinogradov saroyni varaq-varaq qilib chizadi — ikki va bir qavatli devorlar, chuqur tokchalar va ayvonlar, oʻyilgan shiftlar. Uning chizmalari bundan keyingi har bir restavratsiya uchun mezon hujjat boʻladi.",
    },
  },
  {
    year: "1954",
    headline: {
      en: "Rest house — and the loss of the gardens",
      ru: "Дом отдыха — и потеря парка",
      uz: "Dam olish uyi — bog‘ning yo‘qotilishi",
    },
    body: {
      en: "By government resolution, parts of the palace and most of the garden are handed over to a workers’ rest house. Native trees are cut down and replaced with Russian decorative species; palace rooms — harem, kanizakxona, even Xonai Xasht — are converted into kitchens and dormitories. Unprofessional reconstruction permanently alters the architecture. Only ministerial intervention saves 9 halls (565 m²) for the Folk Decorative Art Museum.",
      ru: "Постановлением правительства часть дворца и большая часть бога передаются в ведение дома отдыха для трудящихся. Местные деревья срубают, на их место сажают русские декоративные породы; покои дворца — гарем, кaнизакхана, даже Хонаи Хашт — превращают в кухни и общежития. Непрофессиональная реконструкция необратимо меняет архитектуру. Только вмешательство министерства спасает 9 залов (565 м²) для Музея народного прикладного искусства.",
      uz: "Hukumat qarori bilan saroyning bir qismi va bog‘ning katta qismi ishchilar dam olish uyi ixtiyoriga topshiriladi. Mahalliy daraxtlar kesilib, rus bezakli daraxtlari ekiladi; saroy xonalari — harem, kanizakxona, hatto Xonai Xasht — oshxona va yotoqxonaga aylantiriladi. Nomutaxassis qayta qurish me'morchilikni qaytarib bo‘lmas darajada o‘zgartiradi. Faqat vazirlik aralashuvi 9 ta zalni (565 m²) Xalq amaliy bezak san'ati muzeyi uchun saqlab qoladi.",
    },
  },
  {
    year: "1977",
    headline: {
      en: "The metals are counted",
      ru: "Металлы пересчитаны",
      uz: "Metallar sanab chiqildi",
    },
    body: {
      en: "On 1 December 1977 every piece of precious metal in the Bukhara museum holdings is weighed. The inventory reports: 1 162.85 g of gold, 249 522.5 g of silver, 359 diamonds, 272 carats of brilliants, 40 emeralds and 35 corals. The number on paper is at last equal to the number in the cases — a long-overdue accounting of what survived the Emirate, the Soviet redistribution and four decades of museum care.",
      ru: "1 декабря 1977 года в фондах Бухарского музея взвешен каждый предмет драгоценного металла. Опись фиксирует: золото — 1 162,85 г, серебро — 249 522,5 г, алмазы — 359 шт., бриллианты — 272 карата, изумруды — 40 шт., кораллы — 35 шт. Число на бумаге наконец совпадает с числом в витринах — давно откладывавшаяся ревизия того, что пережило эмират, советский передел и четыре десятилетия музейной опеки.",
      uz: "1977-yil 1-dekabrida Buxoro muzeyi fondidagi har bir qimmatbaho metall buyumi tarozida tortib chiqiladi. Roʻyxat: oltin — 1 162,85 g, kumush — 249 522,5 g, olmos — 359 dona, brilliant — 272 karat, zumrad — 40, marjon — 35. Qogʻozdagi raqam nihoyat vitrinadagi raqamga teng boʻladi — amirlikdan, sovet qayta taqsimotidan va muzeyning toʻrt oʻn yillik gʻamxoʻrligidan keyin qolgan narsalarning kechikkan reviziyasi.",
    },
  },
  {
    year: "1983",
    headline: {
      en: "Museum-reserve status",
      ru: "Статус музея-заповедника",
      uz: "Muzey-qoʻriqxona maqomi",
    },
    body: {
      en: "By resolution of the Council of Ministers of the Uzbek SSR (16 May 1983, No. 308), the museum becomes the Bukhara State Historical-Architectural Museum-Reserve. More than a thousand cultural monuments and 603 state-protected objects fall under its care.",
      ru: "Постановлением Совета Министров Узбекской ССР от 16 мая 1983 года № 308 музей получает наименование «Бухарский государственный историко-архитектурный музей-заповедник». В его ведение переходят более тысячи памятников культуры и 603 объекта государственной охраны.",
      uz: "Oʻzbekiston SSR Vazirlar Kengashining 1983-yil 16-maydagi 308-sonli qarori bilan muzey «Buxoro davlat tarixiy-meʼmorchilik muzey-qoʻriqxonasi» nomini oladi. Uning tarkibiga 1000 dan ortiq madaniy yodgorlik va 603 ta davlat muhofazasidagi obyekt kiritiladi.",
    },
  },
  {
    year: "1985",
    ruler: "R. V. Almeyev",
    headline: {
      en: "The pieces return",
      ru: "Возврат предметов",
      uz: "Buyumlar qaytadi",
    },
    body: {
      en: "R. V. Almeyev is appointed director of the Bukhara museum. Under him many of the objects that the Soviet authorities had quietly transferred to other regional collections are returned to Bukhara. New branches open, several monuments themselves are turned into museums, and ethnographic field expeditions are organised in Romitan, Peshku, Shafirkan, Qiziltepa, Vobkent and Gijduvon.",
      ru: "Директором Бухарского музея назначается Р.В. Альмеев. При нём в Бухару возвращаются многие предметы, которые в советское время были тихо переданы в другие областные собрания. Открываются новые филиалы, несколько памятников сами становятся музеями, организуются этнографические экспедиции в Ромитан, Пешку, Шафиркан, Кызылтепа, Вобкент и Гиждуван.",
      uz: "Buxoro muzeyiga direktor etib R.V. Almeyev tayinlanadi. Uning rahbarligida sovet hokimiyati davrida boshqa viloyat toʻplamlariga jimgina koʻchirilgan koʻplab buyumlar Buxoroga qaytariladi. Yangi filiallar ochiladi, bir nechta yodgorliklarning oʻzi muzeyga aylantiriladi, Romitan, Peshku, Shofirkon, Qiziltepa, Vobkent va Gʻijduvonga etnografik ekspeditsiyalar uyushtiriladi.",
    },
  },
  {
    year: "2017",
    headline: {
      en: "A new chapter",
      ru: "Новая глава",
      uz: "Yangi sahifa",
    },
    body: {
      en: "President Mirziyoyev’s visit in March 2017 sets in motion a programme to expand Bukhara’s tourism potential and to restore the Ark citadel to its original form. By Resolution No. 975, the body becomes the “Bukhara State Museum-Reserve”. On 11 December the Cabinet of Ministers approves the 2017–2027 programme to upgrade state museums. Today the reserve’s collection holds more than 150 000 objects across 16 branches and 2 permanent exhibitions.",
      ru: "Визит президента Мирзиёева в марте 2017 года запускает программу расширения туристического потенциала Бухары и восстановления цитадели Арк в её первоначальном виде. Постановлением Кабмина № 975 структура переименовывается в «Бухарский государственный музей-заповедник». 11 декабря Кабмин утверждает программу модернизации государственных музеев на 2017–2027 годы. Сегодня в собрании заповедника — более 150 000 экспонатов в 16 филиалах и двух постоянных экспозициях.",
      uz: "Prezident Mirziyoyevning 2017-yil mart oyidagi tashrifi Buxoro turizm salohiyatini kengaytirish va Ark qo‘rg‘onini asl ko‘rinishida tiklash dasturini boshlab beradi. Vazirlar Mahkamasining 975-sonli qarori bilan tashkilot «Buxoro davlat muzey-qo‘riqxonasi» nomini oladi. 11-dekabrda Vazirlar Mahkamasi 2017–2027-yillar uchun davlat muzeylarini takomillashtirish dasturini tasdiqlaydi. Bugungi kunda qo‘riqxona saqlovida 16 ta filial va 2 doimiy ekspozitsiyada 150 mingdan ortiq eksponat bor.",
    },
  },
  {
    year: "2019–2020",
    headline: {
      en: "Restoration begun — and halted",
      ru: "Реставрация начата — и остановлена",
      uz: "Restavratsiya boshlanadi — va to‘xtatiladi",
    },
    body: {
      en: "Restoration work begins on the reception hall, the guest rooms, the kanizakxona and the Xonai Xasht pavilion. Non-specialist craftsmen are brought in: ancient tiles and patterns on the staircases and ayvans are damaged, the original windows replaced with low-quality wood. The late mayor of Bukhara Karim Kamolov, together with the Regional Cultural Heritage Department, demands a halt. After warnings, formal letters and a report to the prosecutor’s office, construction is finally stopped in March 2020. The case becomes the textbook example in Uzbekistan of why heritage restoration needs scientific oversight.",
      ru: "Начинаются реставрационные работы — приёмные, гостевые комнаты, канизакхана и павильон Хонаи Хашт. Привлекают неспециалистов: древние изразцы и узоры на лестницах и айванах повреждают, оригинальные окна заменяют на дешёвое дерево. Покойный мэр Бухары Карим Камолов вместе с областным управлением культурного наследия требует остановить. После предупреждений, писем и обращения в прокуратуру стройка наконец остановлена в марте 2020 года. Случай становится для Узбекистана хрестоматийным примером того, почему реставрация наследия требует научного надзора.",
      uz: "Qabulxona, mehmonxona, kanizakxona va Xonai Xasht pavilonida restavratsiya boshlanadi. Nomutaxassis ustalar jalb qilinadi: zinapoyalar va ayvonlardagi qadimiy koshin va naqshlar shikastlanadi, asl derazalar arzon yog‘ochga almashtiriladi. Buxoroning marhum hokimi Karim Kamolov viloyat Madaniy meros departamenti bilan birgalikda to‘xtatishni talab qiladi. Ogohlantirish xatlari, prokuraturaga ma'lumotnoma — va nihoyat 2020-yil mart oyida ishlar to‘xtatiladi. Bu voqea O‘zbekistonda meros restavratsiyasi nima uchun ilmiy nazorat talab qilishini ko‘rsatadigan darslik holatiga aylanadi.",
    },
  },
  {
    year: "Today",
    headline: {
      en: "A working museum",
      ru: "Работающий музей",
      uz: "Ishlovchi muzey",
    },
    body: {
      en: "Sitorai Mohi Xossa now operates as the Folk Decorative Art Museum. Reconstructed rooms with mannequins and video panels bring the period of the emirate back interactively. Research-grounded expositions tie every object to its provenance, function and historical context. The lineage of P. A. Goncharova and L. I. Rempel — the 1930s curators who first put attribution and catalogue on a scientific footing — runs through it still.",
      ru: "Сегодня Ситораи Мохи Хосса работает как Музей народного прикладного искусства. Реконструированные комнаты с манекенами и видео-панелями интерактивно возвращают эпоху эмирата. Исследовательски обоснованные экспозиции связывают каждый предмет с его провенансом, функцией и историческим контекстом. Преемственность от П.А. Гончаровой и Л.И. Ремпеля — кураторов 1930-х, впервые поставивших атрибуцию и каталог на научную основу, — продолжается.",
      uz: "Bugungi kunda Sitorai Mohi Xossa Xalq amaliy bezak san‘ati muzeyi sifatida faoliyat ko‘rsatmoqda. Manekenlar va video-panellar bilan qayta tiklangan xonalar amirlik davrini interaktiv tarzda qaytaradi. Tadqiqotga asoslangan ekspozitsiyalar har bir buyumni uning provenans, funksiya va tarixiy konteksti bilan bog‘laydi. 1930-yillarda atributsiya va katalogni birinchi marta ilmiy asosga qo‘ygan P.A. Goncharova va L.I. Rempelning ishini bugun ham davom ettiradi.",
    },
  },
];

export function HistoryView() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const LANGS: Array<"uz" | "ru" | "en"> = ["uz", "ru", "en"];

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, var(--mid) 0%, var(--mid2) 100%)",
        color: "#F3ECDD",
        paddingTop: 56,
        paddingBottom: 96,
      }}
    >
      {/* twinkle stars sprinkle */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {[
          { left: "8%", top: "6%", size: 2, delay: ".2s" },
          { left: "84%", top: "10%", size: 3, delay: "1.1s" },
          { left: "12%", top: "30%", size: 2, delay: ".7s" },
          { left: "90%", top: "55%", size: 2, delay: "1.8s" },
          { left: "62%", top: "80%", size: 3, delay: ".4s" },
        ].map((st, i) => (
          <span
            key={i}
            className="wtwk"
            style={{
              position: "absolute",
              left: st.left,
              top: st.top,
              width: st.size,
              height: st.size,
              borderRadius: "50%",
              background: "#f4e9cf",
              animationDelay: st.delay,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "relative",
          maxWidth: 920,
          margin: "0 auto",
          padding: "0 32px",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 40,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: "rgba(247,238,222,.7)",
              textDecoration: "none",
            }}
          >
            ‹ {BACK[locale]}
          </Link>
          <div
            style={{
              display: "inline-flex",
              gap: 4,
              padding: "4px 6px",
              borderRadius: 24,
              border: "1px solid rgba(216,185,120,.28)",
              background: "rgba(255,255,255,.04)",
            }}
          >
            {LANGS.map((L) => {
              const active = L === locale;
              return (
                <button
                  key={L}
                  onClick={() => router.replace(pathname, { locale: L })}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 20,
                    border: 0,
                    background: active ? "#D8B978" : "transparent",
                    color: active ? "#221E17" : "rgba(247,238,222,.78)",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 11,
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {L}
                </button>
              );
            })}
          </div>
        </div>

        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: 72 }}>
          <div
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 12,
              letterSpacing: ".24em",
              textTransform: "uppercase",
              color: "rgba(216,185,120,.85)",
              marginBottom: 18,
            }}
          >
            1826 — 2026
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display), serif",
              fontWeight: 500,
              fontSize: "clamp(40px, 6vw, 72px)",
              lineHeight: 1.04,
              color: "#FBF5E8",
              margin: 0,
              letterSpacing: ".01em",
            }}
          >
            {TITLE[locale]}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-display), serif",
              fontStyle: "italic",
              fontSize: "clamp(16px, 1.7vw, 20px)",
              color: "#d8c79c",
              marginTop: 22,
              maxWidth: 640,
              marginInline: "auto",
            }}
          >
            {SUBTITLE[locale]}
          </p>
        </header>

        {/* Timeline */}
        <div
          style={{
            position: "relative",
            paddingLeft: 32,
            borderLeft: "1px solid rgba(216,185,120,.22)",
          }}
        >
          {ERAS.map((era, i) => (
            <article
              key={era.year}
              style={{
                position: "relative",
                paddingBottom: i === ERAS.length - 1 ? 0 : 56,
              }}
            >
              {/* dot */}
              <span
                style={{
                  position: "absolute",
                  left: -41,
                  top: 8,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 30% 30%, #D8B978, #8a6520 70%)",
                  boxShadow:
                    "0 0 0 4px rgba(14,22,48,1), 0 0 18px rgba(216,185,120,.45)",
                }}
              />

              {/* year + ruler */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
                <div
                  style={{
                    fontFamily: "var(--font-display), serif",
                    fontWeight: 500,
                    fontSize: 30,
                    color: "#FBF5E8",
                    letterSpacing: ".01em",
                  }}
                >
                  {era.year}
                </div>
                {era.ruler && (
                  <span
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 11,
                      letterSpacing: ".18em",
                      textTransform: "uppercase",
                      color: "rgba(216,185,120,.75)",
                    }}
                  >
                    {era.ruler}
                  </span>
                )}
              </div>

              <h2
                style={{
                  fontFamily: "var(--font-display), serif",
                  fontWeight: 500,
                  fontSize: 24,
                  color: "#F3ECDD",
                  marginTop: 6,
                  marginBottom: 14,
                }}
              >
                {era.headline[locale]}
              </h2>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.78,
                  color: "#b9bccb",
                  maxWidth: 640,
                  margin: 0,
                  textWrap: "pretty",
                }}
              >
                {era.body[locale]}
              </p>
            </article>
          ))}
        </div>

        {/* Source colophon */}
        <p
          style={{
            marginTop: 80,
            paddingTop: 28,
            borderTop: "1px solid rgba(216,185,120,.16)",
            fontSize: 12,
            lineHeight: 1.7,
            color: "#8c90a6",
            fontStyle: "italic",
            maxWidth: 640,
            marginInline: "auto",
            textAlign: "center",
          }}
        >
          {SOURCE_NOTE[locale]}
        </p>
      </div>
    </div>
  );
}
