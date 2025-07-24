import type { Handler } from "@netlify/functions";
import { Webhook } from "svix";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const handler: Handler = async (event) => {
  const secret = process.env.CLERK_WEBHOOK_SECRET!;
  const wh = new Webhook(secret);

  let payload: any;
  try {
    const body = event.body!;
    const svixId = event.headers["svix-id"]!;
    const svixTimestamp = event.headers["svix-timestamp"]!;
    const svixSignature = event.headers["svix-signature"]!;

    payload = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return {
      statusCode: 400,
      body: "Invalid webhook",
    };
  }

  const { id, type, data } = payload;

  const { error } = await supabase.from("clerk_webhooks").insert({
    event_id: id,
    event_type: type,
    event_data: data,
  });

  if (error) {
    console.error("Supabase insert error:", error);
    return {
      statusCode: 500,
      body: "Error saving to Supabase",
    };
  }

  return {
    statusCode: 200,
    body: "OK",
  };
};

export { handler };
