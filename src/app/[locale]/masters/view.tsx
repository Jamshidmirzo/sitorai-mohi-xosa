"use client";

import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

type Locale = "en" | "ru" | "en" | "ru" | "uz";
type Tri<T> = { en: T; ru: T; uz: T };

type Master = {
  name: string;
  years?: string;
  role: Tri<string>;
  bio: Tri<string>;
};

const HEAD: Tri<string> = {
  en: "Hands that built the palace",
  ru: "Руки, построившие дворец",
  uz: "Saroyni qurgan qoʻllar",
};

const SUB: Tri<string> = {
  en: "Architects, carvers, painters and curators — the people whose work the palace still carries.",
  ru: "Архитекторы, резчики, живописцы и хранители — люди, чьё дело дворец несёт в себе до сих пор.",
  uz: "Meʼmorlar, oʻymakorlar, naqqoshlar va qoʻriqchilar — saroy hanuz koʻrsatib turgan ishning egalari.",
};

const BACK: Tri<string> = {
  en: "Back to the palace",
  ru: "Назад ко дворцу",
  uz: "Saroyga qaytish",
};

const SOURCE: Tri<string> = {
  en: "Source: master’s dissertation by Sh.K. Roziqulova, K. Behzod NRDI, Tashkent, 2026.",
  ru: "Источник: магистерская диссертация Розикуловой Ш.К., НИЖиД им. К. Бехзода, Ташкент, 2026.",
  uz: "Manba: Roʻziqulova Sh.K. magistrlik dissertatsiyasi, K. Behzod NRDI, Toshkent, 2026.",
};

const ARCHITECTS_TITLE: Tri<string> = {
  en: "Architects",
  ru: "Архитекторы",
  uz: "Meʼmorlar",
};
const MASTERS_TITLE: Tri<string> = {
  en: "Masters of decoration",
  ru: "Мастера украшения",
  uz: "Bezak ustalari",
};
const CURATORS_TITLE: Tri<string> = {
  en: "Museum directors and researchers",
  ru: "Директора и исследователи музея",
  uz: "Muzey direktorlari va tadqiqotchilar",
};

const ARCHITECTS: Master[] = [
  {
    name: "Mirzo Ustomiddin Sarkor",
    role: { en: "Chief architect of the palace", ru: "Главный архитектор дворца", uz: "Saroyning bosh meʼmori" },
    bio: {
      en: "Oversaw the construction of the whole Sitorai Mohi Xosa under Amir Sayyid Olim-khan, including the Banquet Hall, the Chess Room and the throne hall. His name signs the structural decisions visible in every doorway.",
      ru: "Руководил всем строительством Ситораи Мохи Хоса при амире Саиде Олим-хане — Банкетный, Шахматный и тронный залы. Его имя стоит за инженерными решениями, видимыми в каждом дверном проёме.",
      uz: "Amir Sayyid Olimxon davrida butun Sitorai Mohi Xosa qurilishiga rahbarlik qilgan — Ziyofat zali, Shaxmat zali va taxt xonasi. Har bir eshik chorrahasida koʻrinadigan muhandislik qarorlari uning nomi bilan bogʻliq.",
    },
  },
  {
    name: "Usto Ostonqul Hafizov",
    role: { en: "Designer of the palace project under Muzaffar-khan", ru: "Автор проекта дворца при Музаффар-хане", uz: "Muzaffarxon davrida saroy loyihasi muallifi" },
    bio: {
      en: "Drew up the project of the palace during 1860–1885. Tried to braid Eastern tradition with European modernity — a hybrid the building still wears in every cornice and ayvan.",
      ru: "Разработал проект дворца в 1860–1885 годах. Сплетал восточную традицию с европейской современностью — гибрид, который здание носит до сих пор в каждом карнизе и айване.",
      uz: "1860–1885-yillarda saroy loyihasini tuzgan. Sharqona anʼana bilan yevropacha zamonaviylikni birlashtirishga uringan — bino bu duragayni har bir karniz va ayvonida tashib yuradi.",
    },
  },
  {
    name: "Usto Hoji Hafiz",
    role: { en: "Designer of early phases", ru: "Автор ранних проектов", uz: "Boshlangʻich loyihalar muallifi" },
    bio: {
      en: "Worked the initial designs of the gardens and courtyards before the main palace took shape. The geometry of the rose garden and the outer hovli still follows his proportions.",
      ru: "Работал над начальными проектами садов и двориков ещё до того, как сложилось основное здание дворца. Геометрия розария и внешнего хавли до сих пор следует его пропорциям.",
      uz: "Asosiy saroy shakllangunga qadar bogʻ va hovlilarning dastlabki loyihalari ustida ishlagan. Gulzor va tashqi hovlining geometriyasi hanuz uning nisbatlarini saqlaydi.",
    },
  },
  {
    name: "Vinogradov",
    years: "1937",
    role: { en: "Architect-restorer, drew the palace sheet by sheet", ru: "Архитектор-реставратор, расчертил дворец лист за листом", uz: "Meʼmor-restavrator, saroyni varaq-varaq chizgan" },
    bio: {
      en: "An academician of architecture. In 1937 he documented every wall, niche and ceiling of the palace — single-storey and double-storey walls, the deep ayvans, the carved ganch above and the parquet below. His blueprints became the reference document for every restoration that followed.",
      ru: "Академик архитектуры. В 1937 году он зафиксировал каждую стену, нишу и потолок дворца — одно- и двухэтажные стены, глубокие айваны, резной ганч сверху и паркет снизу. Его чертежи стали эталоном для каждой последующей реставрации.",
      uz: "Meʼmorchilik akademigi. 1937-yilda saroyning har bir devori, tokchasi va shiftini hujjatlashtirgan — bir va ikki qavatli devorlar, chuqur ayvonlar, yuqorida oʻyilgan ganch va pastdagi parket. Uning chizmalari bundan keyingi har bir restavratsiya uchun mezon hujjati boʻlgan.",
    },
  },
];

const MASTERS: Master[] = [
  {
    name: "Usto Shirin Muradov",
    role: { en: "Master of the White Hall", ru: "Мастер Белого зала", uz: "Oq Zal ustasi" },
    bio: {
      en: "Carved the White Hall in two years (1912–1914) with thirty assistants — ganch laid over mirror so that one candle multiplied to forty reflections. He was once imprisoned for blasphemy under Abdulahad-Khan, sent to military service in Karmana, then pardoned to decorate the throne room. After 1920 he refused to flee to Afghanistan with Sayyid Olim-Khan. In 1946–48 he built the Bukhara Hall of the Navoi Theatre in Tashkent — a State Prize.",
      ru: "За два года (1912–1914) с тридцатью помощниками сделал Белый зал — ганч поверх зеркала так, чтобы одна свеча превращалась в сорок отражений. При Абдулахад-хане его обвиняли в кощунстве и сажали в зиндан, потом отправили в Карманский гарнизон, и только оттуда вернули — отделать тронный зал. После 1920 года отказался бежать с Саидом Олим-ханом в Афганистан. В 1946–48 годах построил Бухарский зал в театре имени Навои в Ташкенте — Государственная премия.",
      uz: "Oʻttiz yordamchi bilan ikki yil ichida (1912–1914) Oq Zalni ishlagan — ganch oyna ustiga shunday qoʻyilganki, bir sham qirq aksga boʻlinardi. Abdulahadxon davrida shakkoklikda ayblanib zindonband qilingan, soʻng Karmana sarbozligiga jo'natilgan, va u yerdan qaytarilib taxt zalini bezashga olib kelingan. 1920-yildan keyin Sayyid Olimxon bilan Afgʻonistonga qochib ketishni rad etgan. 1946–48-yillarda Toshkentdagi Navoiy teatrida Buxoro zalini qurib, Davlat mukofotiga sazovor boʻlgan.",
    },
  },
  {
    name: "Hasanjon Umarov",
    role: { en: "Painter of the Waiting Hall", ru: "Расписной мастер Зала ожидания", uz: "Kutish zali naqqoshi" },
    bio: {
      en: "Filled the Waiting Hall with painted vases in every size, from floor-to-ceiling pieces to small alcove blooms. Made his own pigments from egg yolk, camel milk, apricot-tree resin, plant dye and gold dust, and sealed them under a pistachio-and-almond varnish that has held the colour for over a century.",
      ru: "Заполнил Зал ожидания расписанными вазами всех размеров — от четырёхметровых до маленьких ниш. Сам готовил пигменты на основе яичного желтка, верблюжьего молока, абрикосовой смолы, растительных красителей и золотой пудры, и запечатывал лаком из фисташки и миндаля, который держит цвет уже больше века.",
      uz: "Kutish zalini turli oʻlchamdagi guldonlar bilan toʻldirgan — toʻrt metrlikdan tortib kichik tokchadagi gullarga qadar. Bo‘yoqlarni o‘zi tuxum sarig‘i, tuya suti, o‘rik yelimi, o‘simlik bo‘yog‘i va oltin chang bilan tayyorlagan; ularni pista va bodom lokida muhrlagan, bu lok yuz yildan beri rangni tutib turibdi.",
    },
  },
  {
    name: "Abdulla G‘afurov",
    role: { en: "Wood carver of the Banquet Hall", ru: "Резчик по дереву Банкетного зала", uz: "Ziyofat zali yog‘och o‘ymakori" },
    bio: {
      en: "With Qori Cho‘bin produced the figured ceiling and the wall panels of the Banquet Hall in the «guldor jimjimador» style — densely floral carving that runs through the palace like a signature.",
      ru: "Вместе с Кари Чубином сделал фигурный потолок и стенные панели Банкетного зала в стиле «гулдор-джимджимадор» — плотная цветочная резьба, идущая сквозь дворец как подпись.",
      uz: "Qori Cho‘bin bilan birgalikda Ziyofat zalining figurali shifti va devor panellarini «guldor jimjimador» uslubida — saroy bo‘ylab imzodek o‘tadigan zich gulli o‘ymakorlik bilan ishlagan.",
    },
  },
  {
    name: "Qori Cho‘bin",
    role: { en: "Wood carver of the Banquet Hall (with G‘afurov)", ru: "Резчик Банкетного зала (вместе с Гафуровым)", uz: "Ziyofat zali o‘ymakori (G‘afurov bilan)" },
    bio: {
      en: "G‘afurov’s partner on the ceiling carving. Their dense floral grammar repeats in the doors and panels of the Mirzo-xona and the corridor to the Bathroom.",
      ru: "Партнёр Гафурова по резьбе потолка. Их плотная цветочная «грамматика» повторяется в дверях и панелях Мирзо-хоны и в коридоре к ванной.",
      uz: "Shift o‘ymasida G‘afurovning sherigi. Ularning zich gulli «grammatikasi» Mirzo-xona eshik va panellarida, hammomga olib boruvchi dahlizda takrorlanadi.",
    },
  },
  {
    name: "Abdurahim Turdi",
    years: "1913",
    role: { en: "Sculptor of the marble lions", ru: "Скульптор мраморных львов", uz: "Marmar sherlar haykaltaroshi" },
    bio: {
      en: "A sangtarosh (stone-master) from the Nurota workshops. Carved the two marble lions at the entrance in 1913 — each from a single block of Nurata marble. The lions, symbols of justice and power across the Bukharan emirate, still face every visitor.",
      ru: "Сангтараш (каменотёс) из мастерских Нураты. В 1913 году высек двух мраморных львов у входа — каждого из цельной глыбы нуратского мрамора. Львы как символы справедливости и власти всего Бухарского эмирата по сей день встречают каждого гостя.",
      uz: "Nurota ustaxonalaridan sangtarosh. 1913-yilda kiraverishdagi ikki marmar sherni — har birini Nurota marmarining yagona bloki dan — yo‘nib chiqargan. Buxoro amirligi bo‘ylab adolat va qudrat ramzi bo‘lgan sherlar bugun ham har bir mehmonni qarshilaydi.",
    },
  },
];

const CURATORS: Master[] = [
  {
    name: "Fayzulla Xoʻjayev",
    years: "1920",
    role: {
      en: "Saved the palace from looting",
      ru: "Спас дворец от мародёрства",
      uz: "Saroyni talondan saqlab qoldi",
    },
    bio: {
      en: "Head of the Bukhara People’s Republic. After the Red Army takes the palace in September 1920 and the gardens are trampled, the gateway portal shot at, Fayzulla Xoʻjayev makes the palace the official government residence — a single bureaucratic stroke that stops the mass looting and saves the building for what becomes its museum decade.",
      ru: "Глава Бухарской Народной Республики. После того как Красная армия в сентябре 1920 года занимает дворец и портал ворот расстрелян, а сады вытоптаны, Файзулла Ходжаев превращает дворец в официальную резиденцию правительства — одним административным росчерком останавливает мародёрство и сохраняет здание до его «музейного десятилетия».",
      uz: "Buxoro Xalq Respublikasi rahbari. 1920-yil sentyabrda qizil qoʻshin saroyni egallab, darvozaning peshtogʻi oʻqqa tutilgach va bogʻlar oyoq ostiga bosilgach, Fayzulla Xoʻjayev saroyni rasmiy hukumat qarorgohiga aylantiradi — bir maʼmuriy qaror bilan ommaviy talonchilikni toʻxtatadi va binoni keyingi muzey oʻn yili uchun saqlab qoladi.",
    },
  },
  {
    name: "Muso Saidjonov",
    years: "1920s",
    role: {
      en: "Founder of professional museum work in Bukhara",
      ru: "Основатель профессиональной музейной работы в Бухаре",
      uz: "Buxoroda professional muzey ishining asoschisi",
    },
    bio: {
      en: "Minister of Education and Secretary of the Bukhara Central Executive Committee. With Abdurauf Fitrat and Abdulvohid Burhonov he sets up the first systematic inventory of Bukharan monuments — including a photo archive — and pushes through the «Sredazkomstaris» committee’s proposal to open a museum here. His memoranda to the Uzbek government argue the palace should become «something like Peterhof or Tsarskoe Selo». The 1927 branch museum that follows is his idea made law.",
      ru: "Нарком просвещения и секретарь Бухарского Центрального исполнительного комитета. Вместе с Абдурауфом Фитратом и Абдулвохидом Бурхановым организует первую систематическую опись бухарских памятников — с фотоархивом — и проводит через комитет «Среазкомстарис» идею открыть здесь музей. В записках в правительство Узбекистана доказывает, что дворец должен стать «чем-то вроде Петергофа или Царского Села». Филиал-музей 1927 года — его замысел, ставший постановлением.",
      uz: "Maorif noziri va Buxoro Markaziy ijroiya qoʻmitasining mas'ul kotibi. Abdurauf Fitrat va Abdulvohid Burhonov bilan birga Buxoro yodgorliklarining birinchi tizimli roʻyxatini — fotoarxiv bilan birga — tashkil qiladi va «Sredazkomstaris» qoʻmitasi orqali bu yerda muzey ochish gʻoyasini oʻtkazadi. Oʻzbekiston hukumatiga yozgan maʼlumotnomalarida saroy «Peterhof yoki Tsarskoe Selo singari» boʻlishi kerakligini isbotlaydi. 1927-yilgi filial-muzey — uning gʻoyasi qonunga aylangani.",
    },
  },
  {
    name: "Abdurauf Fitrat",
    years: "1920s",
    role: {
      en: "Writer and reformer; infrastructure for the palace road",
      ru: "Писатель и реформатор; инфраструктура к дворцу",
      uz: "Yozuvchi va isloh tarafdori; saroy yoʻli infratuzilmasi",
    },
    bio: {
      en: "One of the founding intellectuals of modern Uzbek literature. Worked with Saidjonov on the monuments inventory; his particular contribution to the palace was the repair of the road that led to it from Bukhara — without which curators, scholars and the first visitors could not have reached the building in the 1920s.",
      ru: "Один из основоположников современной узбекской литературы. Работал с Саиджановым над описью памятников; его личный вклад в дворец — ремонт дороги, ведущей сюда из Бухары, без которой кураторы, исследователи и первые посетители не добрались бы до здания в 1920-е.",
      uz: "Zamonaviy oʻzbek adabiyotining asoschilaridan biri. Saidjonov bilan yodgorliklar roʻyxati ustida ishlagan; saroyga uning shaxsiy hissasi — bu yerga Buxoroyalashtirigan yoʻlning ta'mirlanishi: usiz kuratorlar, tadqiqotchilar va birinchi tashrif buyuruvchilar 1920-yillarda binoga yetib kelolmas edi.",
    },
  },
  {
    name: "Karim Kamolov",
    years: "2020",
    role: {
      en: "Mayor of Bukhara who stopped a botched restoration",
      ru: "Мэр Бухары, остановивший неудачную реставрацию",
      uz: "Yomon restavratsiyani to‘xtatgan Buxoro hokimi",
    },
    bio: {
      en: "Late mayor of Bukhara. In 2019–2020 a contractor without restoration expertise damages ancient tiles and patterns on the staircases and ayvans and replaces the original windows with cheap wood. Kamolov, together with the Regional Cultural Heritage Department, demands a halt. After warnings, formal letters and a referral to the prosecutor’s office, the works are finally stopped in March 2020. The case becomes a textbook example in Uzbekistan of why heritage restoration needs scientific oversight.",
      ru: "Покойный мэр Бухары. В 2019–2020 годах подрядчик без реставрационной квалификации повреждает древние изразцы и узоры на лестницах и айванах и заменяет оригинальные окна на дешёвое дерево. Камолов вместе с областным управлением культурного наследия требует остановить. После предупреждений, писем и обращения в прокуратуру стройка наконец остановлена в марте 2020 года. Случай стал хрестоматийным для Узбекистана примером того, почему реставрация наследия требует научного надзора.",
      uz: "Buxoroning marhum hokimi. 2019–2020-yillarda restavratsiya tajribasi yo‘q pudratchi zinapoyalar va ayvonlardagi qadimiy koshin va naqshlarni shikastlaydi, asl derazalarni arzon yog‘ochga almashtiradi. Kamolov viloyat Madaniy meros departamenti bilan birgalikda to‘xtatishni talab qiladi. Ogohlantirish xatlari, prokuraturaga ma'lumotnoma — va 2020-yil mart oyida ishlar nihoyat to‘xtatiladi. Bu voqea O‘zbekistonda meros restavratsiyasi nima uchun ilmiy nazorat talab qilishini ko‘rsatuvchi darslik holatga aylanadi.",
    },
  },
  {
    name: "P. A. Goncharova",
    years: "1930s",
    role: {
      en: "Co-author of the modern museum’s scientific programme",
      ru: "Соавтор научной программы современного музея",
      uz: "Zamonaviy muzey ilmiy dasturining hammuallifi",
    },
    bio: {
      en: "A graduate of the Eastern Languages Institute at the Central Asian State University, Goncharova arrived in Bukhara in the early 1930s and, with the art historian L. I. Rempel, carried out the first systematic ethnographic and curatorial fieldwork at the palace. Their proposals turned the museum from a display of confiscated objects into an academic institution — and led directly to the 1937–38 «Chinese Porcelain» exhibition that became the country’s first scientifically catalogued ethnographic display.",
      ru: "Выпускница Института восточных языков при Среднеазиатском государственном университете. В начале 1930-х Гончарова приехала в Бухару и вместе с искусствоведом Л.И. Ремпелем провела первое систематическое этнографическое и кураторское полевое исследование во дворце. Их рекомендации превратили музей из показа конфискованных предметов в академическое учреждение — и привели напрямую к экспозиции «Китайский фарфор» 1937–38 годов, первой в стране выставке с научным каталогом.",
      uz: "O‘rta Osiyo davlat universiteti qoshidagi Sharq tillari instituti bitiruvchisi. 1930-yillarning boshida Goncharova Buxoroga keldi va san‘atshunos L.I. Rempel bilan birgalikda saroyda birinchi tizimli etnografik va kuratorlik dala ishini olib bordi. Ularning tavsiyalari muzeyni musodara qilingan buyumlar namoyishidan akademik muassasaga aylantirdi — va 1937–38-yillardagi «Xitoy chinnisi» ko‘rgazmasiga olib keldi, bu mamlakatdagi birinchi ilmiy katalog bilan ekspozitsiya bo‘ldi.",
    },
  },
  {
    name: "L. I. Rempel",
    years: "1930s",
    role: {
      en: "Art historian; co-designer of the first scientific exhibition",
      ru: "Искусствовед; соавтор первой научной экспозиции",
      uz: "San‘atshunos; birinchi ilmiy ekspozitsiyaning hammualifi",
    },
    bio: {
      en: "Co-worker of Goncharova on the museum’s 1930s research programme. Rempel’s art-historical lens — provenance, attribution, decorative grammar — turned the palace inventory into a curatorial scheme that European ethnographic museums of the period would recognise. The 320-piece Chinese Porcelain catalogue prepared by the Uzbek Republican Art Museum was the visible result of his method.",
      ru: "Сотрудник Гончаровой по научной программе музея 1930-х. Искусствоведческий подход Ремпеля — провенанс, атрибуция, декоративная грамматика — превратил инвентарь дворца в кураторскую схему, узнаваемую европейскими этнографическими музеями той эпохи. Каталог «Китайский фарфор» на 320 предметов, подготовленный Республиканским художественным музеем Узбекистана, — видимый результат его метода.",
      uz: "Goncharova bilan muzeyning 1930-yillardagi ilmiy dasturidagi hamkasbi. Rempelning san‘atshunoslik nuqtai nazari — provenans, atributsiya, dekorativ grammatika — saroy ro‘yxatini o‘sha davr yevropa etnografik muzeylariga taniqli bo‘lgan kuratorlik sxemasiga aylantirdi. O‘zbekiston Respublikasi Badiiy muzeyi tayyorlagan 320 buyumdan iborat «Xitoy chinnisi» katalogi uning metodining ko‘rinarli natijasidir.",
    },
  },
  {
    name: "P. E. Kornilov",
    years: "1930s",
    role: { en: "Director, Bukhara Local-History Museum", ru: "Директор, Бухарский краеведческий музей", uz: "Direktor, Buxoro o‘lkashunoslik muzeyi" },
    bio: {
      en: "An expert in local-history museum work. Under his leadership in the 1930s the Bukhara museum became a centre of regional academic life — collections were systematised, scientifically catalogued, and put on public display for the first time. The model of museum work in Bukhara today still runs on the foundations he laid.",
      ru: "Специалист по краеведению. Под его руководством в 1930-е годы Бухарский музей стал центром региональной академической жизни — собрания были систематизированы, научно описаны и впервые выставлены на широкое обозрение. Модель музейной работы в Бухаре сегодня по-прежнему стоит на заложенных им основаниях.",
      uz: "O‘lkashunoslik mutaxassisi. 1930-yillarda uning rahbarligida Buxoro muzeyi mintaqaviy akademik hayotning markaziga aylangan — to‘plamlar tizimlashtirilgan, ilmiy ro‘yxatga olingan va birinchi marta keng jamoatchilikka taqdim etilgan. Buxoroda muzey ishining bugungi modeli hanuz u qo‘ygan poydevorga tayanadi.",
    },
  },
  {
    name: "R. V. Almeyev",
    years: "1985 →",
    role: { en: "Director, Bukhara State Museum-Reserve", ru: "Директор, Бухарский государственный музей-заповедник", uz: "Direktor, Buxoro davlat muzey-qo‘riqxonasi" },
    bio: {
      en: "On his appointment in 1985 many objects that the Soviet authorities had quietly transferred to other regional collections were brought back to Bukhara. Under him new branches opened, several monuments themselves became museums, and ethnographic field expeditions reached Romitan, Peshku, Shafirkan, Qiziltepa, Vobkent and Gijduvon to enrich the holdings.",
      ru: "В 1985 году с его назначением в Бухару возвращаются многие предметы, тихо переданные в советское время в другие областные собрания. Открываются новые филиалы, несколько памятников сами становятся музеями, организуются этнографические экспедиции в Ромитан, Пешку, Шафиркан, Кызылтепа, Вобкент, Гиждуван — для пополнения фонда.",
      uz: "1985-yilda uning tayinlanishi bilan sovet hokimiyati davrida boshqa viloyat to‘plamlariga ko‘chirilgan ko‘plab buyumlar Buxoroga qaytarildi. Yangi filiallar ochildi, ayrim yodgorliklarning o‘zi muzeyga aylandi, Romitan, Peshku, Shofirkon, Qiziltepa, Vobkent va G‘ijduvonga etnografik ekspeditsiyalar uyushtirildi — fondni boyitish uchun.",
    },
  },
  {
    name: "Sh. K. Ro‘ziqulova",
    years: "2026",
    role: { en: "Researcher of the museification process", ru: "Исследователь процессов музеефикации", uz: "Muzeylashtirish jarayonlari tadqiqotchisi" },
    bio: {
      en: "Author of the master’s dissertation «Processes of museification of Sitorai Mohi Xossa (XX–XXI cc.)» (K. Behzod National Institute of Painting and Design, 2026). This site’s halls, biographies and timeline are drawn directly from her work — names, dates, attributions and pigment recipes that would otherwise live only in the archive.",
      ru: "Автор магистерской диссертации «Процессы музеефикации Ситораи Мохи Хосса (XX–XXI вв.)» (Национальный институт живописи и дизайна им. К. Бехзода, 2026). Залы, биографии и хронология этого сайта взяты напрямую из её работы — имена, даты, атрибуции и рецепты пигментов, которые иначе остались бы только в архиве.",
      uz: "«Sitorai Mohi Xossa muzeylashtirish jarayonlari (XX–XXI asrlar)» magistrlik dissertatsiyasi muallifi (K. Behzod nomidagi Milliy rassomlik va dizayn instituti, 2026). Bu saytdagi zallar, biografiyalar va xronologiya bevosita uning ishidan olingan — bo‘lmasa, faqat arxivda qoladigan ismlar, sanalar, atributsiyalar va bo‘yoq retseptlari.",
    },
  },
];

function Section({
  title,
  locale,
  items,
}: {
  title: string;
  locale: Locale;
  items: Master[];
}) {
  return (
    <section style={{ marginBottom: 64 }}>
      <h2
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 12,
          letterSpacing: ".24em",
          textTransform: "uppercase",
          color: "rgba(216,185,120,.75)",
          marginBottom: 28,
          paddingBottom: 12,
          borderBottom: "1px solid rgba(216,185,120,.18)",
        }}
      >
        {title}
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 36 }}>
        {items.map((m) => (
          <article key={m.name} style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 28, alignItems: "start" }}>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display), serif",
                  fontWeight: 500,
                  fontSize: 22,
                  lineHeight: 1.18,
                  color: "#FBF5E8",
                }}
              >
                {m.name}
              </div>
              {m.years && (
                <div
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 10,
                    letterSpacing: ".18em",
                    color: "rgba(216,185,120,.6)",
                    marginTop: 6,
                  }}
                >
                  {m.years}
                </div>
              )}
              <div
                style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: 13,
                  fontStyle: "italic",
                  color: "#d8c79c",
                  marginTop: 10,
                  lineHeight: 1.4,
                }}
              >
                {m.role[locale as "en" | "ru" | "uz"]}
              </div>
            </div>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.78,
                color: "#b9bccb",
                margin: 0,
                textWrap: "pretty",
                maxWidth: 640,
              }}
            >
              {m.bio[locale as "en" | "ru" | "uz"]}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function MastersView() {
  const locale = useLocale() as "en" | "ru" | "uz";
  const router = useRouter();
  const pathname = usePathname();
  const LANGS: Array<"uz" | "ru" | "en"> = ["uz", "ru", "en"];

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "linear-gradient(180deg, var(--mid) 0%, var(--mid2) 100%)",
        color: "#F3ECDD",
        paddingTop: 56,
        paddingBottom: 96,
      }}
    >
      <div
        style={{
          position: "relative",
          maxWidth: 980,
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

        <header style={{ textAlign: "center", marginBottom: 64 }}>
          <h1
            style={{
              fontFamily: "var(--font-display), serif",
              fontWeight: 500,
              fontSize: "clamp(36px, 5vw, 60px)",
              lineHeight: 1.06,
              color: "#FBF5E8",
              margin: 0,
            }}
          >
            {HEAD[locale]}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-display), serif",
              fontStyle: "italic",
              fontSize: 18,
              color: "#d8c79c",
              marginTop: 18,
              maxWidth: 640,
              marginInline: "auto",
              lineHeight: 1.5,
            }}
          >
            {SUB[locale]}
          </p>
        </header>

        <Section title={ARCHITECTS_TITLE[locale]} locale={locale} items={ARCHITECTS} />
        <Section title={MASTERS_TITLE[locale]} locale={locale} items={MASTERS} />
        <Section title={CURATORS_TITLE[locale]} locale={locale} items={CURATORS} />

        <p
          style={{
            marginTop: 56,
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
          {SOURCE[locale]}
        </p>
      </div>
    </div>
  );
}
