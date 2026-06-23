import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { SurveyFormClient } from "./client"

export default async function SurveyPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params

  const survey = await prisma.survey.findUnique({
    where: { id, active: true },
    include: {
      translations: { where: { locale } },
      questions: {
        orderBy: { order: "asc" },
        include: {
          translations: { where: { locale } },
          options: {
            orderBy: { order: "asc" },
            include: {
              translations: { where: { locale } },
            },
          },
        },
      },
    },
  })

  if (!survey) notFound()

  const serialized = JSON.parse(JSON.stringify(survey))

  return <SurveyFormClient survey={serialized} locale={locale} surveyId={id} />
}
