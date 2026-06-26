import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import fs from "fs"
import path from "path"
import "dotenv/config"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })
const CONTENT = path.join(process.cwd(), "content")

async function main() {
  fs.mkdirSync(CONTENT, { recursive: true })

  // Exhibits with all translations, images, category, hall
  const exhibits = await prisma.exhibit.findMany({
    orderBy: { order: "asc" },
    include: {
      translations: true,
      images: { orderBy: { order: "asc" } },
      category: { include: { translations: true } },
      hall: { include: { translations: true } },
    },
  })
  write("exhibits.json", exhibits)
  console.log(`exhibits: ${exhibits.length}`)

  // Categories
  const categories = await prisma.category.findMany({
    include: { translations: true },
  })
  write("categories.json", categories)
  console.log(`categories: ${categories.length}`)

  // Halls
  const halls = await prisma.hall.findMany({
    include: { translations: true },
  })
  write("halls.json", halls)
  console.log(`halls: ${halls.length}`)

  // Gallery images
  const gallery = await prisma.galleryImage.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  })
  write("gallery.json", gallery)
  console.log(`gallery: ${gallery.length}`)

  // Posts (published only)
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { translations: true },
  })
  write("posts.json", posts)
  console.log(`posts: ${posts.length}`)

  // Visitor info (all locales)
  const visitorInfo = await prisma.visitorInfo.findMany()
  write("visitor-info.json", visitorInfo)
  console.log(`visitorInfo: ${visitorInfo.length}`)

  // Site settings (all locales)
  const siteSettings = await prisma.siteSettings.findMany()
  write("site-settings.json", siteSettings)
  console.log(`siteSettings: ${siteSettings.length}`)

  // Quiz questions with translations (for landing narrative)
  const quizQuestions = await prisma.quizQuestion.findMany({
    orderBy: [{ exhibitId: "asc" }, { order: "asc" }],
    include: { translations: true },
  })
  write("quiz-questions.json", quizQuestions)
  console.log(`quizQuestions: ${quizQuestions.length}`)

  await prisma.$disconnect()
  console.log("Done — content/ written.")
}

function write(name: string, data: unknown) {
  fs.writeFileSync(path.join(CONTENT, name), JSON.stringify(data, null, 2))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
