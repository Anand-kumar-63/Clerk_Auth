import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import client from "@/lib/Prisma";
import { CarTaxiFront } from "lucide-react";
import { todo } from "node:test";
const ITEMS_PER_PAGE = 10;

async function isAdmin(userId: string) {
  const user = (await clerkClient()).users.getUser(userId);
  return (await user).publicMetadata.role === "admin";
}
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId || !(await isAdmin(userId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // new url consturctor creates an object that stores the pathname ,
  // request type , hostname , searchparams : {"r1":"", "r2":""}
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const page = parseInt(searchParams.get("page") || "1");
  try {
    let user;
    if (email) {
      user = await client.user.findUnique({
        where: { email },
        include: {
          todos: {
            orderBy: { CreatedAt: "desc" },
            take: ITEMS_PER_PAGE,
            skip: (page - 1) * ITEMS_PER_PAGE,
          },
        },
      });
    }
    const totalItems = email
      ? await client.todo.count({ where: { User: { email } } })
      : 0;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    return NextResponse.json({ user, totalPages, currentPage: page });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function PUT(req: NextRequest) {
  const { userId } = await auth();
  if (!userId || !(await isAdmin(userId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { email, isSubscribed, todoId, todoCompleted, todoTitle } =
      await req.json();

    // updating the todo
    if (todoId !== "undefined" && todoCompleted !== "undefined") {
      const updatetodo = await client.todo.update({
        where: { id: todoId },
        data: {
          isCompleted: todoCompleted,
        },
      });
      return NextResponse.json(updatetodo, { status: 200 });
    }
    else if(isSubscribed !== "undefined"){
      await client.user.update({
        where: { email },
        data: {
          isSubscribed,
          subscriptionEnds: isSubscribed
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            : null,
        },
      });}
     // 
    else if(todoId) {
      await client.todo.update({
        where: { id: todoId },
        data: {
          isCompleted: todoCompleted !== undefined ? todoCompleted : undefined,
          title: todoTitle || undefined,
        },
      });
    }
    return NextResponse.json({ message: "Update successful" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId || !(await isAdmin(userId))) {
    return NextResponse.json("unauthorised User", { status: 401 });
  }
  try {
    const { todoId } = await req.json();
    if (!todoId) {
      return NextResponse.json("todoId is required", { status: 401 });
    }
    const todo = await client.todo.delete({
      where: {
        id: userId,
      },
    });

    return NextResponse.json("Todo deleted successfully", { status: 200 });
  } catch (error) {
    return NextResponse.json("Internal Server Error", { status: 401 });
  }
}
