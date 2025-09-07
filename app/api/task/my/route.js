import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const role = url.searchParams.get("role");

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    let tasks;

    if (role === "helper") {
      // Get tasks where user is the helper
      tasks = await prisma.task.findMany({
        where: {
          helperID: parseInt(userId),
        },
        include: {
          creator: {
            select: {
              name: true,
              phoneNumber: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      // Format for helper dashboard
      tasks = tasks.map((task) => ({
        ...task,
        price: `$${task.price}`, // Format price as string
        timeEstimate: `${task.estimatedDuration} min`, // Format time estimate
        customerName: task.creator?.name || "Unknown",
        customerPhone: task.creator?.phoneNumber || "N/A",
      }));
    } else {
      // Get tasks created by user (role === "creator" or default)
      tasks = await prisma.task.findMany({
        where: {
          creatorId: parseInt(userId),
        },
        include: {
          helper: {
            select: {
              name: true,
              phoneNumber: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      // Format for requester dashboard
      tasks = tasks.map((task) => ({
        ...task,
        issue: task.title,
        price: `$${task.price}`, // Format price as string
        timeEstimate: `${task.estimatedDuration} min`, // Format time estimate
        helper: task.helper
          ? {
              name: task.helper.name,
              phone: task.helper.phoneNumber,
            }
          : null,
      }));
    }

    return Response.json(tasks);
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const taskId = url.searchParams.get("id");

    if (!taskId) {
      return Response.json({ error: "Task ID is required" }, { status: 400 });
    }

    const deletedTask = await prisma.task.delete({
      where: { id: parseInt(taskId) },
    });

    return Response.json({
      message: "Task deleted successfully",
      deletedTask,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }
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

    const newTask = await prisma.task.create({
      data: {
        title: body.title,
        creatorId: body.creatorId,
        helperID: body.helperID,
        category: body.category,
        imageUrl: body.imageUrl,
        price: body.price,
        description: body.description,
        address: body.address,
        completed: body.completed || false,
        estimatedDuration: body.estimatedDuration,
      },
      include: {
        creator: true,
        helper: true,
      },
    });

    return Response.json(newTask, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: "Invalid data or database error" },
      { status: 400 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return Response.json({ error: "Task ID is required" }, { status: 400 });
    }

    const updatedTask = await prisma.task.update({
      where: { id: body.id },
      data: {
        title: body.title,
        creatorId: body.creatorId,
        helperID: body.helperID,
        category: body.category,
        imageUrl: body.imageUrl,
        price: body.price,
        description: body.description,
        address: body.address,
        completed: body.completed,
        estimatedDuration: body.estimatedDuration,
      },
      include: {
        creator: true,
        helper: true,
      },
    });

    return Response.json(updatedTask);
  } catch (error) {
    if (error.code === "P2025") {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }
    return Response.json(
      { error: "Invalid data or database error" },
      { status: 400 }
    );
  }
}
