import { NextResponse } from "next/server"
import { PrismaClient } from "@/generated/prisma"
import { PrismaNeon } from "@prisma/adapter-neon"
import bcrypt from "bcryptjs"

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL
})
const prisma = new PrismaClient({ adapter })

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, password, phone, location } = body

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email and password are required" },
      { status: 400 }
    )
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    )
  }

  // Check if user already exists
  const existing = await prisma.user.findUnique({
    where: { email }
  })

  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 400 }
    )
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12)

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone: phone || null,
      location: location || null,
    }
  })

  return NextResponse.json(
    { id: user.id, email: user.email, name: user.name },
    { status: 201 }
  )
}