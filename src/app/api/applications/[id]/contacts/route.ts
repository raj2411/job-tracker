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
  const { name, role, email, linkedinUrl, notes } = body

  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 })
  }

  const contact = await prisma.contact.create({
    data: {
      applicationId: id,
      name,
      role: role || null,
      email: email || null,
      linkedinUrl: linkedinUrl || null,
      notes: notes || null,
    },
  })

  return NextResponse.json(contact, { status: 201 })
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
  const { contactId } = body

  const contact = await prisma.contact.findUnique({ where: { id: contactId } })
  if (!contact) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const app = await prisma.application.findUnique({ where: { id: contact.applicationId } })
  if (!app || app.userId !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  await prisma.contact.delete({ where: { id: contactId } })
  return new NextResponse(null, { status: 204 })
}
