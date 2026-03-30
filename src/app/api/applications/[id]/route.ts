import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { PrismaClient } from "@/generated/prisma"
import { PrismaNeon } from "@prisma/adapter-neon"

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL || ""
})
const prisma = new PrismaClient({ adapter })

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const { id } = await params

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const body = await req.json()
  const { status, notes, jobUrl, salaryExpected, salaryOffered, resumeUrl, coverLetterUrl } = body

  const existingApp = await prisma.application.findUnique({
    where: { id }
  })

  if (!existingApp || existingApp.userId !== user.id) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 })
  }

  const data: Record<string, unknown> = {}
  if (status !== undefined) data.status = status
  if (notes !== undefined) data.notes = notes
  if (jobUrl !== undefined) data.jobUrl = jobUrl
  if (salaryExpected !== undefined) data.salaryExpected = salaryExpected ? Number(salaryExpected) : null
  if (salaryOffered !== undefined) data.salaryOffered = salaryOffered ? Number(salaryOffered) : null
  if (resumeUrl !== undefined) data.resumeUrl = resumeUrl
  if (coverLetterUrl !== undefined) data.coverLetterUrl = coverLetterUrl

  const application = await prisma.application.update({
    where: { id },
    data,
  })

  return NextResponse.json(application)
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const { id } = await params

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const existingApp = await prisma.application.findUnique({
    where: { id }
  })

  if (!existingApp || existingApp.userId !== user.id) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 })
  }

  await prisma.application.delete({
    where: { id }
  })

  return new NextResponse(null, { status: 204 })
}
