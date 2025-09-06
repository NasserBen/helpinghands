import { tasks } from './constant.js';
import { PrismaClient, Prisma } from '@prisma/client';

// GET - Retrieve all tasks or a specific task
export async function GET(request) {
  const url = new URL(request.url);
  const taskId = url.searchParams.get('id');
  
  if (taskId) {
    // Get specific task by ID
    const task = tasks.find(t => t.id === parseInt(taskId));
    if (!task) {
      return Response.json({ error: 'Task not found' }, { status: 404 });
    }
    return Response.json(task);
  }
  
  // Get all tasks
  return Response.json(tasks);
}

// POST - Create a new task


// PUT - Update an existing task
export async function PUT(request) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return Response.json({ error: 'Task ID is required' }, { status: 400 });
    }
    
    // Find task index
    const taskIndex = tasks.findIndex(t => t.id === body.id);
    if (taskIndex === -1) {
      return Response.json({ error: 'Task not found' }, { status: 404 });
    }
    
    // Update task
    const updatedTask = {
      ...tasks[taskIndex],
      ...body,
      id: body.id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    tasks[taskIndex] = updatedTask;
    
    return Response.json(updatedTask);
  } catch (error) {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}

