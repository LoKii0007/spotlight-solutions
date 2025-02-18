import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const columns = await prisma.columns.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      status: 200,
      message: "Columns fetched successfully",
      columns,
    });
  } catch (error: any) {
    console.error("Error in GET columns api : ", error.message);
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

    const columnId = req.url.split("/").pop();

    if (!columnId) {
      return NextResponse.json({ message: "Column ID is required" }, { status: 400 });
    }

    const deletedColumn = await prisma.columns.delete({
      where: {
        id: columnId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      status: 200,
      message: "Column deleted successfully",
      deletedColumn,
    });
  } catch (error: any) {
    console.error("Error in DELETE columns api : ", error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
