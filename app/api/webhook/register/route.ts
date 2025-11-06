import { headers } from "next/headers";
import { messageInRaw, Svix, Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import client from "@/lib/Prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error(
      "please add webhook from clerk dashboard to .env and env.local"
    );
  }

  // you have to extract out three properties from the header that is comming along with webhook response
  const webhookpayheader = headers();

  // These were all sent from the server
  // const headers = {
  // "svix-id": "msg_p5jXN8AQM9LWM0D4loKWxJek",
  // "svix-timestamp": "1614265330",
  // "svix-signature": "v1,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=",
  // };
  // const payload = '{"test": 2432232314}';
  // sivx_timestamp and svix_id and svix_signature to verify the webhook later

  const svix_timestamp = (await webhookpayheader).get("svix-timestamp");
  const svix_id = (await webhookpayheader).get("svix-id");
  const svix_signature = (await webhookpayheader).get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers",{
      status: 400,
    });}

  // now ectract the payload that contains all the data , metadata
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // now make an instance of the webhook
  const wh = new Webhook(webhookSecret);
  let evt: WebhookEvent;

  // you have to verify the webhook that the payload is not altered and it is from authenticated services like svix
  try {
    //Throws on error, returns the verified content on success
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (error) {
    console.log("error verifying the webhook", error);
    return NextResponse.json(
      {message: "error occured",},
      { status: 401,});}

  // now evt got the data about the user
  const { id } = evt.data;
  // to check the type of the event
  const eventType = evt.type;
  console.log(`webhooks with a Id of ${id} and type of ${eventType}`);
  console.log(`webhook body : ${body}`);
  
  if (eventType == "user.created") {
    try {
      const { email_addresses, primary_email_address_id } = evt.data;
      // emails addresses array[] of mutiple userid
      console.log(evt.data);
      const primary_email = email_addresses.find(
        (email) => email.id === primary_email_address_id
      );
      console.log("primary_email", primary_email);
      console.log("Email Addresss", primary_email?.email_address);
      if (!primary_email) {
        console.error("No primary email found");
        return new Response("No primary email found", { status: 401 });
      }

      // new user creation
      const newuser = await client.user.create({
        data:{
          username:"",
          id: evt.data.id,
          email: primary_email.email_address,
          isSubscribed: false,
        },
      });
      console.log("new user created", newuser);
    } catch (error) {
      console.log("Error in Creating a user in database:", error);
      return NextResponse.json(
        { message: "error in creating the user" },
        { status: 402 }
      );
    }
  }
  return NextResponse.json(
    {
      Message: "webhook recieved Successfully",
    },
    {
      status: 200,
    }
  );
}
