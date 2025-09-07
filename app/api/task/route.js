import { PrismaClient } from "@prisma/client";
import { geocodeAddress } from "../../../lib/geocoding.js";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const taskId = url.searchParams.get("id");

    if (taskId) {
      // Get specific task by ID
      const task = await prisma.task.findUnique({
        where: { id: parseInt(taskId) },
        include: {
          creator: true,
          helper: true,
        },
      });

      if (!task) {
        return Response.json({ error: "Task not found" }, { status: 404 });
      }
      return Response.json(task);
    }

    const tasks = await prisma.task.findMany({
      include: {
        creator: true,
        helper: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Format tasks for frontend consumption
    const formattedTasks = tasks.map((task) => ({
      ...task,
      title: task.title,
      price: `$${task.price}`, // Format price as string with $ symbol
      timeEstimate: `${task.estimatedDuration} min`, // Format time estimate
      urgency: "medium", // Default urgency - could be calculated based on task age or other factors
      location: {
        lat: task.latitude || 37.7749 + (Math.random() - 0.5) * 0.1, // Use real coordinates or fallback
        lng: task.longitude || -122.4194 + (Math.random() - 0.5) * 0.1,
      },
    }));

    return Response.json(formattedTasks);
  } catch (error) {
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const requiredFields = [
      "title",
      "creatorId",
      "category",
      "price",
      "description",
      "address",
      "estimatedDuration",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return Response.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Geocode the address to get coordinates
    console.log("Geocoding address:", body.address);
    const coordinates = await geocodeAddress(body.address);
    console.log("Geocoded coordinates:", coordinates);

    const newTask = await prisma.task.create({
      data: {
        title: body.title,
        creatorId: parseInt(body.creatorId),
        category: body.category,
        imageUrl: body.imageUrl,
        price: parseFloat(body.price.replace("$", "")), // Convert price string to float
        description: body.description,
        address: body.address,
        latitude: coordinates?.lat || null,
        longitude: coordinates?.lng || null,
        completed: false,
        estimatedDuration: parseInt(body.estimatedDuration.split(" ")[0]) || 30, // Extract number from time estimate
      },
      include: {
        creator: true,
        helper: true,
      },
    });

    return Response.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return Response.json({ error: "Failed to create task" }, { status: 500 });
  }
}
