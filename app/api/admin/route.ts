import { NextResponse, NextRequest } from "next/server";
import { clerkClient, getAuth, auth } from "@clerk/nextjs/server";
import client from "@/lib/Prisma";
import { messageInRaw } from "svix";

// to check weather the user with is admin or not
const isadmin = async (userId: string) => {
  const user = (await clerkClient()).users.getUser(userId);
  return ((await user).publicMetadata.role = "admin");
};

export async function GET(req: NextRequest) {
  const item_per_page = 10;
  // getauth object gives you access to the userobject that is currently loggedin
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json(
      {
        message: "unauthorised user",
      },
      {
        status: 401,
      }
    );
  }

  // you have to be admin to fetch the todos
  if (!(await isadmin(userId))) {
    return NextResponse.json({ message: "Forbidden" }, { status: 401 });
  }

  // The URL() constructor returns a newly created URL object representing the URL defined by the parameters.
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const page = parseInt(searchParams.get("page") || "1");
  try {
    const currentuser = await client.user.findUnique({
      where: {
        email: email || "",
      },
      include: {
        todos: {
          orderBy: { CreatedAt: "desc" },
          take: item_per_page,
          skip: (page - 1) * item_per_page,
        },
      },
    });
    if (!currentuser) {
      return NextResponse.json({
        user: "null",
        totalpages: "0",
        currentpage: "1",
      });
    }

    const totaltodos = await client.todo.count({
      where: {
        id: currentuser.id,
      },
    });
    const totalpages = Math.ceil(totaltodos / item_per_page);
    return NextResponse.json({
      user: currentuser,
      totalpages: totalpages,
      currentpage: page,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server errror",
      },
      {
        status: 401,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  // current active user's userId
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      {
        message: "unauthorised user",
      },
      {
        status: 401,
      }
    );
  }

  // check for the admin
  if (!isadmin(userId)) {
    return NextResponse.json(
      {
        message: "Forbidden",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const { todoId, todocompleted, email, isSubscribed } = await req.json();

    if (todoId !== undefined && todocompleted !== undefined) {
      // update the todo
      const updatedtodo = await client.todo.update({
        where: { id: todoId },
        data: {
          isCompleted: todocompleted,
        },
      });
      return NextResponse.json(updatedtodo);
    } else if (isSubscribed !== undefined) {
      const updateduser = await client.user.update({
        where: { email: email },
        data: {
          isSubscribed,
          subscriptionEnds: isSubscribed
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            : null,
        },
      });
      return NextResponse.json({
        updateduser,
      });
    }
    return NextResponse.json(
      {
        message: "iinvalid request",
      },
      {
        status: 401,
      }
    );
  } catch (erorr) {
    return NextResponse.json(
      {
        message: "Internal server Error",
      },
      {
        status: 401,
      }
    );
  }
}

export async function DELETE(req: NextRequest) {
   const { userId } = getAuth(req);

   if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   }

  if (!(await isadmin(userId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { todoId } = await req.json();

    await client.todo.delete({
      where: { id: todoId },
    });

    return NextResponse.json({ message: "Todo deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}