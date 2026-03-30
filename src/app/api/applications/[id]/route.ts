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
  const { status } = body

  const existingApp = await prisma.application.findUnique({
    where: { id }
  })

  if (!existingApp || existingApp.userId !== user.id) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 })
  }

  const application = await prisma.application.update({
    where: { id },
    data: { status }
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
