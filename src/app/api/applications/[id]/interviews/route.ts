import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { PrismaClient } from "@/generated/prisma"
import { PrismaNeon } from "@prisma/adapter-neon"

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const { id } = await params

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const app = await prisma.application.findUnique({ where: { id } })
  if (!app || app.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const body = await req.json()
  const { type, scheduledAt, notes } = body

  if (!type) {
    return NextResponse.json({ error: "type is required" }, { status: 400 })
  }

  const round = await prisma.interviewRound.create({
    data: {
      applicationId: id,
      type,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      notes: notes || null,
    },
  })

  return NextResponse.json(round, { status: 201 })
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

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const body = await req.json()
  const { roundId } = body

  const round = await prisma.interviewRound.findUnique({ where: { id: roundId } })
  if (!round) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const app = await prisma.application.findUnique({ where: { id: round.applicationId } })
  if (!app || app.userId !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  await prisma.interviewRound.delete({ where: { id: roundId } })
  return new NextResponse(null, { status: 204 })
}
