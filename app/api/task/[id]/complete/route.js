import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  try {
    const { id } = params;

    // Update the task to mark as completed
    const updatedTask = await prisma.task.update({
      where: {
        id: parseInt(id),
      },
      data: {
        completed: true,
      },
      include: {
        creator: {
          select: {
            name: true,
            phoneNumber: true,
          },
        },
        helper: {
          select: {
            name: true,
            phoneNumber: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Task completed successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error completing task:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to complete task" },
      { status: 500 }
    );
  }
}
