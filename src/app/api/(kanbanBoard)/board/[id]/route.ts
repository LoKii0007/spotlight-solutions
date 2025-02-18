import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const boardId = req.url.split("/").pop();
    const { title, description } = await req.json();

    const updatedBoard = await prisma.board.update({
      where: {
        id: boardId,
        userId: session.user.id,
      },
      data: {
        title,
        description,
      },
    });

    return NextResponse.json({
      status: 200,
      message: "Board updated successfully",
      updatedBoard,
    });
  } catch (error: any) {
    console.error("Error in PUT board api : ", error.message);
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
      return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
    }

    const boardId = req.url.split("/").pop();

    if (!boardId) {
      return NextResponse.json({ message: "Board ID is required", success: false }, { status: 400 });
    }

    const deletedColumns = await prisma.columns.deleteMany({
      where: {
        boardId: boardId,
        userId: session.user.id,
      },
    });
    
    const deletedTasks = await prisma.tasks.deleteMany({
      where: {
        boardId: boardId,
        userId: session.user.id,
      },
    });

    const deletedBoard = await prisma.board.delete({
      where: {
        id: boardId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      message: "Board deleted successfully",
      deletedBoard,
    },{status: 200});
  } catch (error: any) {
    console.error("Error in DELETE board api : ", error.message);
    return NextResponse.json(
        { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
