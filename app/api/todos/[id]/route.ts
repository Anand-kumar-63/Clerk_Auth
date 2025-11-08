import { NextResponse, NextRequest } from "next/server";
import { Client } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import client from "@/lib/Prisma";
import { AppPortalAccessInSerializer } from "svix/dist/models/appPortalAccessIn";

export async function PUT(
   req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json("Unauthorised user", {
      status: 401,
    });
  }
  try {
    const { completed } = await req.json();
    const todoid = params.id;

    // findunique todo
    const todo = await client.todo.findUnique({
      where: {
        id: todoid,
      },
    });
    if (!todo) {
      return NextResponse.json("Todo not found", {
        status: 401,
      });
    }
    if (userId != todo.userId) {
      return NextResponse.json("Not authorised", { status: 401 });
    }

    const updatedtodo = await client.todo.update({
      where: {
        id: todoid,
      },
      data: {
        isCompleted: completed,
      },
    });
    
    return NextResponse.json("todo updated successdfully", { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        Error: "Internal server Error",
      },
      {
        status: 401,
      }
    );
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  const todoid = params.id;
  if (!userId) {
    return NextResponse.json("Unauthorised User", { status: 401 });
  }
  try {
    const existingtodo = await client.todo.findUnique({
      where: {
        id: todoid,
      },
    });
    if (!existingtodo) {
      return NextResponse.json("Todo not found", {
        status: 401,
      });
    }
    if (userId != existingtodo.userId) {
      return NextResponse.json("Not authorised", { status: 401 });
    }
    const deletetodo = await client.todo.delete({
      where: { id: todoid },
    });
    return NextResponse.json("Todo deleted successfully", { status: 201 });
  } catch (error) {
    return NextResponse.json("Internal server Error", {
      status: 401,
    });
  }
}
