import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getUserFromToken } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const user = await getUserFromToken(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
  })
  return NextResponse.json(projects)
}

export async function POST(request: NextRequest) {
  const user = await getUserFromToken(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const project = await prisma.project.create({
    data: {
      ...body,
      userId: user.id,
    },
  })
  return NextResponse.json(project)
}

