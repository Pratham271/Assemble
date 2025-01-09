import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const task = await prisma.project.delete({
      where: { id: params.id },
    });
    return NextResponse.json(task);
  }
