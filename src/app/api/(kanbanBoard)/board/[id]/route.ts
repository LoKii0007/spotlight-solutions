import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
  } catch (error) {
    console.error("Error in PUT board api : ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const boardId = req.url.split("/").pop();

    const deletedBoard = await prisma.board.delete({
      where: {
        id: boardId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      status: 200,
      message: "Board deleted successfully",
      deletedBoard,
    });
  } catch (error) {
    console.error("Error in DELETE board api : ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
