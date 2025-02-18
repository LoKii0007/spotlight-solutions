import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET(req: Request) {
  try {
    const session= await getServerSession(authOptions)
    if(!session || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { boardId } = await req.json();

    if(!boardId) {
      return NextResponse.json({ message: "Board ID is required" }, { status: 400 });
    }

    const columns = await prisma.columns.findMany({
      where: {
        boardId,
      },
    });

    return NextResponse.json({
      status: 200,
      message: "Columns fetched successfully",
      columns,
    });
  } catch (error: any) {
    console.error("Error in GET columns api : ", error.message);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session= await getServerSession(authOptions)
    if(!session || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { boardId, title } = await req.json();    

    if(!boardId || !title) {
      return NextResponse.json({ message: "Board ID and title are required" }, { status: 400 });
    }

    const column = await prisma.columns.create({
      data: {
        title,
        boardId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      status: 200,
      message: "Column created successfully",
      column,
    });
  } catch (error: any) {
    console.error("Error in POST columns api : ", error.message);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session= await getServerSession(authOptions)
    if(!session || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id, title } = await req.json();

    const updatedColumn = await prisma.columns.update({
      where: {
        id,
        boardId: session.user.id,
      },
      data: {
        title,
      },
    });

    return NextResponse.json({
      status: 200,
      message: "Column updated successfully",
      updatedColumn,
    });
  } catch (error: any) {
    console.error("Error in PUT columns api : ", error.message);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session= await getServerSession(authOptions)
    if(!session || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    const deletedColumn = await prisma.columns.delete({
      where: {
        id,
        boardId: session.user.id,
      },
    });
    
    return NextResponse.json({
      status: 200,
      message: "Column deleted successfully",
      deletedColumn,
    });
  } catch (error: any) {
    console.error("Error in DELETE columns api : ", error.message);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}