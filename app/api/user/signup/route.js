import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    
    const requiredFields = ['name', 'phoneNumber', 'password'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return Response.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }
    
    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber: body.phoneNumber }
    });
    
    if (existingUser) {
      return Response.json({ error: 'User with this phone number already exists' }, { status: 409 });
    }
    
    const newUser = await prisma.user.create({
      data: {
        name: body.name,
        phoneNumber: body.phoneNumber,
        password: body.password
      }
    });
    
    const { password, ...userWithoutPassword } = newUser;
    
    return Response.json({
      message: 'User created successfully',
      user: userWithoutPassword
    }, { status: 201 });
    
  } catch (error) {
    return Response.json({ error: 'Invalid data or database error' }, { status: 400 });
  }
}