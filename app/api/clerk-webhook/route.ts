import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/app/lib/prisma";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Handle user.created event
  if (evt.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;

    try {
      await prisma.user.create({
        data: {
          id: id,
          email: email_addresses[0].email_address,
          name: `${first_name} ${last_name}`,
        },
      });
    } catch (error) {
      return new Response("Failed to add user", {
        status: 500,
      });
    }
  }

  // Handle user.deleted event
  if (evt.type === "user.deleted") {
    const { id } = evt.data;

    try {
      await prisma.user.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error("Error deleting user from database:", error);
      return new Response("Failed to delete user", {
        status: 500,
      });
    }
  }

  return new Response("Webhook processed successfully", { status: 200 });
}
