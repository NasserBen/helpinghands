import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { helperId } = body;

    if (!helperId) {
      return NextResponse.json(
        { error: "Helper ID is required" },
        { status: 400 }
      );
    }

    // Update the task to assign the helper
    const updatedTask = await prisma.task.update({
      where: {
        id: parseInt(id),
      },
      data: {
        helperID: parseInt(helperId), // Note: using helperID to match schema
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
      message: "Task accepted successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error accepting task:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to accept task" },
      { status: 500 }
    );
  }
}
