import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
      const session= await getServerSession(authOptions)
      if(!session || !session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const boardId = req.url.split("/").pop();
  
      if(!boardId) {
        return NextResponse.json({ error: "Board ID is required" }, { status: 400 });
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
    } catch (error) {
      console.error("Error in GET columns api : ", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }