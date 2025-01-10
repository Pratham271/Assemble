import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: Request, { params }: { params: { id: string } }) {

    const deletedTasks = await prisma.task.deleteMany({
      where: {
        projectId: params.id
      }
    })
    const deletedProject = await prisma.project.delete({
      where: { id: params.id },
    });
    return NextResponse.json(deletedProject);
  }
