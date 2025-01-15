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

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  console.log("body: ",body)
  const task = await prisma.project.update({
    where: { id: params.id },
    data: {
      name: body.name
    },
  });
  return NextResponse.json(task);
}
