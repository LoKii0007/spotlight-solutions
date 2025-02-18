import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks = await prisma.tasks.findMany({
      where: {
        userId: session.user.id,
      },
    });
    return NextResponse.json({ status: 200, tasks });
  } catch (error: any) {
    console.error("Error in GET tasks api : ", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = req.url.split("/").pop();
    const body = await req.json();

    const updatedTask = await prisma.tasks.update({
      where: {
        id: id,
        userId: session.user.id,
      },
      data: {
        ...body
      },
    });

    if (!updatedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ status: 200, task: updatedTask });
  } catch (error: any) {
    console.error("Error in PUT tasks api : ", error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = req.url.split("/").pop();

    const deletedTask = await prisma.tasks.delete({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!deletedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: 200,
      message: "Task deleted successfully",
    });
  } catch (error: any) {
    console.error("Error in DELETE tasks api : ", error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}