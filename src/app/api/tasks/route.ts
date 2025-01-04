import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'


const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId')
  const date = searchParams.get('date')
  const projectId = searchParams.get('projectId')
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

    let whereClause: Prisma.TaskWhereInput = { userId: userId }

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

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { userId, ...taskData } = body
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const task = await prisma.task.create({
    data: {
      ...body,
      userId: userId,
    },
  })
  return NextResponse.json(task)
}