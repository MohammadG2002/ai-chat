export const runtime = "nodejs";

import { Webhook } from "svix";
import connectDB from "@/config/db";
import User from "@/models/user";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

interface ClerkUserData {
  id: string;
  first_name: string;
  last_name: string;
  email_addresses: { email_address: string }[];
  image_url: string;
}

interface ClerkWebhookEvent {
  data: ClerkUserData;
  type: string;
}

export async function POST(req: Request) {
  console.log("Received Clerk webhook POST");
  // initialize webhook verifier using the key from .env (SVIX_KEY)
  const wh = new Webhook(process.env.SVIX_KEY!);

  const headerPayload = await headers();
  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id") as string,
    "svix-timestamp": headerPayload.get("svix-timestamp") as string,
    "svix-signature": headerPayload.get("svix-signature") as string,
  };

  // Get the raw body
  const payload = await req.text();
  let data: ClerkUserData;
  let type: string;

  try {
    ({ data, type } = wh.verify(payload, svixHeaders) as ClerkWebhookEvent);
  } catch (err) {
    console.error("Svix webhook verification failed:", err);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 },
    );
  }

  const userData = {
    _id: data.id,
    name: `${data.first_name} ${data.last_name}`,
    email: data.email_addresses[0]?.email_address || "",
    image: data.image_url,
  };

  console.log("Webhook event type", type, "userData", userData);

  try {
    const db = await connectDB();
    console.log("MongoDB connected", !!db);
  } catch (dbErr) {
    console.error("Failed to connect to MongoDB", dbErr);
    return NextResponse.json(
      { error: "DB connection failure" },
      { status: 500 },
    );
  }

  try {
    switch (type) {
      case "user.created":
        console.log("Creating user", userData._id);
        const created = await User.create(userData);
        console.log("Created record:", created);
        break;
      case "user.updated":
        console.log("Updating user", userData._id);
        await User.findByIdAndUpdate(data.id, userData);
        break;
      case "user.deleted":
        console.log("Deleting user", userData._id);
        await User.findByIdAndDelete(data.id);
        break;
      default:
        console.warn("Unhandled webhook type", type);
        break;
    }
  } catch (e) {
    console.error("Database operation failed for type", type, e);
    return NextResponse.json({ error: "DB operation failed" }, { status: 500 });
  }

  return NextResponse.json({ message: "Webhook received" });
}
