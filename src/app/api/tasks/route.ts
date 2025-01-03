import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const projectId = searchParams.get('projectId')

  let whereClause: any = {}

  if (date) {
    const startDate = new Date(date)
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 1)

    whereClause.dueDate = {
      gte: startDate,
      lt: endDate,
    }
  }

  if (projectId) {
    whereClause.projectId = projectId
  }

  const tasks = await prisma.task.findMany({
    where: whereClause,
    include: { project: true },
  })

  return NextResponse.json(tasks)
}

export async function POST(request: Request) {
  const body = await request.json()
  const task = await prisma.task.create({
    data: body,
  })
  return NextResponse.json(task)
}

