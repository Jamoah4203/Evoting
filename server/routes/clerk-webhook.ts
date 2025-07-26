import { RequestHandler } from "express";
import { Webhook } from "svix";
import { getSupabaseAdmin } from "../lib/supabase";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || "placeholder-secret";

export const handleClerkWebhook: RequestHandler = async (req, res) => {
  try {
    if (!process.env.CLERK_WEBHOOK_SECRET) {
      return res.status(500).json({ error: "Webhook secret not configured" });
    }

    const headers = req.headers;
    const payload = req.body;

    // Verify the webhook signature
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    let evt;

    try {
      evt = wh.verify(JSON.stringify(payload), {
        "svix-id": headers["svix-id"] as string,
        "svix-timestamp": headers["svix-timestamp"] as string,
        "svix-signature": headers["svix-signature"] as string,
      });
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return res.status(400).json({ error: "Invalid signature" });
    }

    const { type, data } = evt;

    switch (type) {
      case "user.created":
        await handleUserCreated(data);
        break;
      
      case "user.updated":
        await handleUserUpdated(data);
        break;
      
      case "user.deleted":
        await handleUserDeleted(data);
        break;
      
      default:
        console.log(`Unhandled webhook event type: ${type}`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

async function handleUserCreated(data: any) {
  try {
    const {
      id,
      email_addresses,
      first_name,
      last_name,
      created_at,
    } = data;

    const primaryEmail = email_addresses?.find((email: any) => email.id === data.primary_email_address_id);
    
    if (!primaryEmail) {
      console.error("No primary email found for user:", id);
      return;
    }

    // Generate a voter ID (you can customize this logic)
    const voterIdPrefix = "V";
    const timestamp = Date.now().toString().slice(-6);
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    const voterId = `${voterIdPrefix}${timestamp}${randomSuffix}`;

    const { error } = await getSupabaseAdmin()
      .from("users")
      .insert({
        id,
        email: primaryEmail.email_address,
        voter_id: voterId,
        first_name: first_name || "",
        last_name: last_name || "",
        role: "voter", // Default role is voter
        is_verified: true, // Clerk handles verification
        created_at: created_at,
        updated_at: created_at,
      });

    if (error) {
      console.error("Error creating user in Supabase:", error);
    } else {
      console.log(`User created in Supabase: ${id} (${primaryEmail.email_address})`);
    }
  } catch (error) {
    console.error("Error in handleUserCreated:", error);
  }
}

async function handleUserUpdated(data: any) {
  try {
    const {
      id,
      email_addresses,
      first_name,
      last_name,
    } = data;

    const primaryEmail = email_addresses?.find((email: any) => email.id === data.primary_email_address_id);
    
    if (!primaryEmail) {
      console.error("No primary email found for user:", id);
      return;
    }

    const { error } = await getSupabaseAdmin()
      .from("users")
      .update({
        email: primaryEmail.email_address,
        first_name: first_name || "",
        last_name: last_name || "",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating user in Supabase:", error);
    } else {
      console.log(`User updated in Supabase: ${id}`);
    }
  } catch (error) {
    console.error("Error in handleUserUpdated:", error);
  }
}

async function handleUserDeleted(data: any) {
  try {
    const { id } = data;

    const { error } = await getSupabaseAdmin()
      .from("users")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting user from Supabase:", error);
    } else {
      console.log(`User deleted from Supabase: ${id}`);
    }
  } catch (error) {
    console.error("Error in handleUserDeleted:", error);
  }
}
