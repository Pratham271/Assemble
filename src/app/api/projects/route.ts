import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const projects = await prisma.project.findMany()
  return NextResponse.json(projects)
}

export async function POST(request: Request) {
  const body = await request.json()
  const project = await prisma.project.create({
    data: body,
  })
  return NextResponse.json(project)
}

