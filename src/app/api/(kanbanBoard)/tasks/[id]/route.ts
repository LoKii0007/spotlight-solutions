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

    const id = req.url.split("/").pop();
    const tasks = await prisma.tasks.findMany({
      where: {
        boardId: id,
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