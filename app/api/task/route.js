import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const taskId = url.searchParams.get('id');
    
    if (taskId) {
      // Get specific task by ID
      const task = await prisma.task.findUnique({
        where: { id: parseInt(taskId) },
        include: { 
          creator: true,
          helper: true 
        }
      });
      
      if (!task) {
        return Response.json({ error: 'Task not found' }, { status: 404 });
      }
      return Response.json(task);
    }
    
    const tasks = await prisma.task.findMany({
      include: { 
        creator: true,
        helper: true 
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return Response.json(tasks);
  } catch (error) {
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

