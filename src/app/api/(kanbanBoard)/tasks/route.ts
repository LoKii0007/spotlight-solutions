import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
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


export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, description, boardId, status, priority } = await req.json();

        if (!title || !description || !boardId || !status || !priority) {   
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const task = await prisma.tasks.create({
            data: {
                title, 
                description,
                status,
                priority,
                boardId,
                userId: session.user.id,
            }
        })
        
        return NextResponse.json({ status: 201, task });
    } catch (error: any) {
        console.error("Error in POST tasks api : ", error.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, title, description, status, priority, boardId } = await req.json();

        if (!id || !title || !description || !status || !priority) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const updatedTask = await prisma.tasks.update({
            where :{
                id: id,
                userId: session.user.id,
            },
            data: {
                title,
                description,
                status,
                priority
            }            
        })

        if (!updatedTask) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        return NextResponse.json({ status: 200, task: updatedTask });
    } catch (error: any) {
        console.error("Error in PUT tasks api : ", error.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await req.json();

        const deletedTask = await prisma.tasks.delete({
            where: {
                id: id,
                userId: session.user.id,
            },
        }); 

        if (!deletedTask) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        return NextResponse.json({ status: 200, message: "Task deleted successfully" });    
    } catch (error: any) {
        console.error("Error in DELETE tasks api : ", error.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
