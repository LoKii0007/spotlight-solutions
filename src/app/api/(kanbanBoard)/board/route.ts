import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const boards = await prisma.board.findMany({
      where: {
        userId: session.user.id,
      },
    });

    const columns = await prisma.columns.findMany({
      where: {
        userId: session.user.id,
      },
    });
    
    const tasks = await prisma.tasks.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({ boards, columns, tasks }, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET board api : ", error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, description } = await req.json();
    if(!title || !description) {
      return NextResponse.json({ message: "Title and description are required" }, { status: 400 });
    }

    const board = await prisma.board.create({
      data: {
        title,
        description,
        userId: session.user.id,
      },
    });

    const columns = await prisma.columns.createMany({
      data: [
        {
          title: "To Do",
          boardId: board.id,
          userId: session.user.id,
        },
        {
          title: "In Progress",
          boardId: board.id,
          userId: session.user.id,
        },
        {
          title: "Done",
          boardId: board.id,
          userId: session.user.id,
        },
      ],
    });

    return NextResponse.json({
      status: 200,
      message: "Board created successfully",
      board,
      columns,
    });
  } catch (error: any) {
    console.error("Error in POST board api : ", error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}