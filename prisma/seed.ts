import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Create admin user with bcrypt-hashed password
  const hashedPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@xosa.uz' },
    update: {},
    create: {
      email: 'admin@xosa.uz',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
    },
  })
  console.log('Created admin user:', admin.email)

  // Create categories
  const categories = [
    { slug: 'ceramics', names: { en: 'Ceramics', ru: 'Керамика', uz: 'Kulolchilik' } },
    { slug: 'textiles', names: { en: 'Textiles', ru: 'Текстиль', uz: 'To\'qimachilik' } },
    { slug: 'woodwork', names: { en: 'Woodwork', ru: 'Резьба по дереву', uz: 'Yog\'och o\'ymakorligi' } },
    { slug: 'metalwork', names: { en: 'Metalwork', ru: 'Металлообработка', uz: 'Metallga ishlov berish' } },
    { slug: 'paintings', names: { en: 'Paintings', ru: 'Живопись', uz: 'Rassomchilik' } },
    { slug: 'jewelry', names: { en: 'Jewelry', ru: 'Ювелирные изделия', uz: 'Zargarlik buyumlari' } },
    { slug: 'manuscripts', names: { en: 'Manuscripts', ru: 'Рукописи', uz: 'Qo\'lyozmalar' } },
    { slug: 'furniture', names: { en: 'Furniture', ru: 'Мебель', uz: 'Mebel' } },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        slug: cat.slug,
        translations: {
          create: [
            { locale: 'en', name: cat.names.en },
            { locale: 'ru', name: cat.names.ru },
            { locale: 'uz', name: cat.names.uz },
          ],
        },
      },
    })
  }
  console.log('Created categories')

  // Create halls
  const halls = [
    { slug: 'main-hall', number: 1, names: { en: 'Main Hall', ru: 'Главный зал', uz: 'Asosiy zal' }, desc: { en: 'The grand entrance hall', ru: 'Парадный зал', uz: 'Tantanali kirish zali' } },
    { slug: 'white-hall', number: 2, names: { en: 'White Hall', ru: 'Белый зал', uz: 'Oq zal' }, desc: { en: 'The White Hall with European-style interiors', ru: 'Белый зал с европейским интерьером', uz: 'Yevropa uslubidagi oq zal' } },
    { slug: 'reception-hall', number: 3, names: { en: 'Reception Hall', ru: 'Приёмный зал', uz: 'Qabul zali' }, desc: { en: 'Official reception and ceremony hall', ru: 'Зал для официальных приёмов', uz: 'Rasmiy qabul va marosimlar zali' } },
    { slug: 'harem', number: 4, names: { en: 'Harem Building', ru: 'Гарем', uz: 'Haram binosi' }, desc: { en: 'The private quarters', ru: 'Личные покои', uz: 'Shaxsiy xonalar' } },
    { slug: 'garden-pavilion', number: 5, names: { en: 'Garden Pavilion', ru: 'Садовый павильон', uz: 'Bog\' ayvoni' }, desc: { en: 'Open-air pavilion in the gardens', ru: 'Открытый павильон в саду', uz: 'Bog\'dagi ochiq ayvan' } },
  ]

  for (const hall of halls) {
    await prisma.hall.upsert({
      where: { slug: hall.slug },
      update: {},
      create: {
        slug: hall.slug,
        number: hall.number,
        translations: {
          create: [
            { locale: 'en', name: hall.names.en, description: hall.desc.en },
            { locale: 'ru', name: hall.names.ru, description: hall.desc.ru },
            { locale: 'uz', name: hall.names.uz, description: hall.desc.uz },
          ],
        },
      },
    })
  }
  console.log('Created halls')

  // Create site settings for each locale
  const siteSettings = [
    {
      locale: 'en',
      siteName: 'Sitorai Mohi Xosa',
      siteDescription: 'The Palace of Moon-like Stars — Summer residence of the last Emir of Bukhara',
      heroTitle: 'Sitorai Mohi Xosa',
      heroSubtitle: 'The Palace of Moon-like Stars',
      aboutText: 'Sitorai Mohi Xosa is a palace of the Bukharan emirs, located about 4 km north of Bukhara. Built in the late 19th and early 20th centuries, it served as the summer residence of the last emir of Bukhara, Alim Khan. The palace complex combines Eastern and European architectural styles, reflecting the cultural exchanges of the era.',
    },
    {
      locale: 'ru',
      siteName: 'Ситораи Мохи Хоса',
      siteDescription: 'Дворец Луноподобных Звёзд — Летняя резиденция последнего эмира Бухары',
      heroTitle: 'Ситораи Мохи Хоса',
      heroSubtitle: 'Дворец Луноподобных Звёзд',
      aboutText: 'Ситораи Мохи Хоса — дворец бухарских эмиров, расположенный примерно в 4 км к северу от Бухары. Построенный в конце XIX — начале XX века, он служил летней резиденцией последнего эмира Бухары Алим-хана. Дворцовый комплекс сочетает восточный и европейский архитектурные стили, отражая культурный обмен эпохи.',
    },
    {
      locale: 'uz',
      siteName: 'Sitorai Mohi Xosa',
      siteDescription: 'Oysimon Yulduzlar Saroyi — Buxoroning so\'nggi amirining yozgi qarorgohi',
      heroTitle: 'Sitorai Mohi Xosa',
      heroSubtitle: 'Oysimon Yulduzlar Saroyi',
      aboutText: 'Sitorai Mohi Xosa — Buxoro amirlarining saroyi bo\'lib, Buxorodan shimolda taxminan 4 km masofada joylashgan. XIX asr oxiri — XX asr boshlarida qurilgan bo\'lib, Buxoroning so\'nggi amiri Olimxonning yozgi qarorgohi sifatida xizmat qilgan. Saroy majmuasi sharq va yevropa me\'morchilik uslublarini uyg\'unlashtirgan.',
    },
  ]

  for (const settings of siteSettings) {
    await prisma.siteSettings.upsert({
      where: { locale: settings.locale },
      update: {},
      create: settings,
    })
  }
  console.log('Created site settings')

  // Create visitor info for each locale
  const visitorInfos = [
    {
      locale: 'en',
      hours: 'Monday - Sunday: 9:00 AM - 5:00 PM\nClosed on Tuesdays',
      ticketPrices: 'Adults: 25,000 UZS\nStudents: 10,000 UZS\nForeign visitors: 50,000 UZS\nChildren under 7: Free',
      address: 'Sitorai Mohi Xosa, Bukhara, Uzbekistan',
      phone: '+998 65 221 00 00',
      email: 'info@xosa.uz',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3067.8!2d64.4!3d39.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDQ4JzAwLjAiTiA2NMKwMjQnMDAuMCJF!5e0!3m2!1sen!2s!4v1',
    },
    {
      locale: 'ru',
      hours: 'Понедельник - Воскресенье: 9:00 - 17:00\nВторник — выходной',
      ticketPrices: 'Взрослые: 25 000 сум\nСтуденты: 10 000 сум\nИностранные туристы: 50 000 сум\nДети до 7 лет: бесплатно',
      address: 'Ситораи Мохи Хоса, Бухара, Узбекистан',
      phone: '+998 65 221 00 00',
      email: 'info@xosa.uz',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3067.8!2d64.4!3d39.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDQ4JzAwLjAiTiA2NMKwMjQnMDAuMCJF!5e0!3m2!1sru!2s!4v1',
    },
    {
      locale: 'uz',
      hours: 'Dushanba - Yakshanba: 9:00 - 17:00\nSeshanba — dam olish kuni',
      ticketPrices: 'Kattalar: 25 000 so\'m\nTalabalar: 10 000 so\'m\nXorijiy mehmonlar: 50 000 so\'m\n7 yoshgacha bolalar: bepul',
      address: 'Sitorai Mohi Xosa, Buxoro, O\'zbekiston',
      phone: '+998 65 221 00 00',
      email: 'info@xosa.uz',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3067.8!2d64.4!3d39.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDQ4JzAwLjAiTiA2NMKwMjQnMDAuMCJF!5e0!3m2!1suz!2s!4v1',
    },
  ]

  for (const info of visitorInfos) {
    await prisma.visitorInfo.upsert({
      where: { locale: info.locale },
      update: {},
      create: info,
    })
  }
  console.log('Created visitor info')

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
