import { getAuth, clerkClient } from "@clerk/nextjs/server";
import client from "@/lib/Prisma";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// To update the user Subscription
export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorised user" }, { status: 401 });
  }
  try {
    const user = await client.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { error: "User doesnot exist" },
        { status: 401 }
      );
    }
    const subscriptionend = new Date();
    subscriptionend.setMonth(subscriptionend.getMonth() + 1);
    const updateduser = await client.user.update({
      where: {
        id: userId,
      },
      data: {
        isSubscribed: true,
        subscriptionEnds: subscriptionend,
      },
    });
    console.log(updateduser);
    return NextResponse.json(
      {
        message: "subcription updated",
        subscriptionends: user.subscriptionEnds,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json({ Error: error }, { status: 403 });
  }
}

// To update the user subscription and end if the date is exceeded
export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorised user" }, { status: 401 });
  }
  try {
    const ExistingUser = await client.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        isSubscribed: true,
        subscriptionEnds: true,
      },
    });
    if (!ExistingUser) {
      return NextResponse.json("user not exist", { status: 401 });
    }
    const subscription = new Date();

    if (
      ExistingUser.isSubscribed == true &&
      ExistingUser.subscriptionEnds! < subscription
    ) {
      const updateuserSubscription = await client.user.update({
        where: {
          id: userId,
        },
        data: {
          isSubscribed: false,
          subscriptionEnds: null,
        },
      });
      return NextResponse.json(
        {
          isSubsribed:false,
          SubscriptionEnds: null,
        },
        {
          status: 200,
        }
      );
    }
    return NextResponse.json({
      isSubscribed:ExistingUser.isSubscribed,
      SubscriptionEnds:ExistingUser.subscriptionEnds,
    })
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 402 });
  }
}
