import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { PrismaClient } from "@/generated/prisma"
import { PrismaNeon } from "@prisma/adapter-neon"

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL
})
const prisma = new PrismaClient({ adapter })

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { company, role, jobUrl, notes, salaryExpected, resumeUrl, coverLetterUrl } = body

  if (!company || !role) {
    return NextResponse.json({ error: "Company and role are required" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const application = await prisma.application.create({
    data: {
      userId: user.id,
      company,
      role,
      jobUrl: jobUrl || null,
      notes: notes || null,
      salaryExpected: salaryExpected ? Number(salaryExpected) : null,
      resumeUrl: resumeUrl || null,
      coverLetterUrl: coverLetterUrl || null,
    },
    include: { interviewRounds: true, contacts: true },
  })

  return NextResponse.json(application, { status: 201 })
}

export async function GET() {
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const applications = await prisma.application.findMany({
    where: { userId: user.id },
    orderBy: { appliedAt: "desc" },
    include: { interviewRounds: { orderBy: { scheduledAt: "asc" } }, contacts: true },
  })

  return NextResponse.json(applications)
}