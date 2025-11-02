import { NextResponse, NextRequest } from "next/server";
import { clerkClient, getAuth, auth } from "@clerk/nextjs/server";
import client from "@/lib/Prisma";
import { messageInRaw } from "svix";
import { abortOnSynchronousPlatformIOAccess } from "next/dist/server/app-render/dynamic-rendering";
import { use } from "react";
import { CarTaxiFront } from "lucide-react";

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

interface CreateTodoRequestBody {
  title: string;
  subject:string; 
  id:string
}
export async function POST(req: NextRequest) {
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
  try {
    // checking if the user exists or not
    const existinguser = await client.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        todos: true,
      },
    });
    if (!existinguser) {
      return NextResponse.json(
        {
          Error: "User doesnt exist",
        },
        { status: 401 }
      );
    }

    if (existinguser.isSubscribed == false && existinguser.todos.length >= 3) {
      return NextResponse.json(
        {
          error:
            "Free users can only create upto three todos , Take subscription to create more",
        },
        { status: 401 }
      );
    }
    // type casting the object as {title:string , subject:string}
    const todobody = (await req.json()) as CreateTodoRequestBody
    const {title , subject} = todobody;
    const newtodo = await client.todo.create({
      data:{
        userId:userId,
        title:title,
        subject:subject
      } 
    })
    return NextResponse.json({
      newtodo:newtodo
    },{
      status:200
    })

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        Error: error,
      },
      {
        status: 401,
      }
    );
  }
  return 
}
