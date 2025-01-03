import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const task = await prisma.task.update({
    where: { id: params.id },
    data: body,
  });
  return NextResponse.json(task);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const task = await prisma.task.delete({
    where: { id: params.id },
  });
  return NextResponse.json(task);
}
