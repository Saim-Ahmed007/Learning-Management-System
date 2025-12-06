import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    // 1. Raw body from Clerk
    const rawBody = req.body.toString("utf8");

    console.log("RAW BODY:", rawBody);

    // 2. Verify signature
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    await wh.verify(rawBody, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = JSON.parse(rawBody);

    console.log("EVENT TYPE:", type);
    console.log("EVENT DATA:", data);

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email,
          name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
          imageUrl: data.image_url,
        };

        console.log("CREATING USER:", userData);

        await User.create(userData);
        return res.json({ success: true });
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email,
          name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
          imageUrl: data.image_url,
        };

        console.log("UPDATING USER:", userData);

        await User.findByIdAndUpdate(data.id, userData);
        return res.json({ success: true });
      }

      case "user.deleted": {
        console.log("DELETING USER:", data.id);
        await User.findByIdAndDelete(data.id);
        return res.json({ success: true });
      }

      default:
        return res.json({});
    }
  } catch (err) {
    console.log("WEBHOOK ERROR:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};
