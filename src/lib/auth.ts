import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } })
    return user
  } catch (error) {
    console.log(error)
    return null
  }
}

