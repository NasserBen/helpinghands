import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    
    const requiredFields = ['phoneNumber', 'password'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return Response.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }
    
    const user = await prisma.user.findUnique({
      where: { phoneNumber: body.phoneNumber }
    });
    
    if (!user) {
      return Response.json({ error: 'Invalid phone number or password' }, { status: 401 });
    }
    
    if (user.password !== body.password) {
      return Response.json({ error: 'Invalid phone number or password' }, { status: 401 });
    }
    
    const { password, ...userWithoutPassword } = user;
    
    return Response.json({
      message: 'Sign in successful',
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.log(error);
    return Response.json({ error: 'Invalid data or database error' }, { status: 400 });
  }
}