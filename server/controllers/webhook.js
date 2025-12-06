import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verify signature using raw buffer
    const evt = whook.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = evt;

    if (type === "user.created") {
      await User.create({
        _id: data.id,
        email: data.email_addresses[0].email,
        name: `${data.first_name} ${data.last_name}`.trim(),
        imageUrl: data.image_url,
      });
      return res.json({ success: true });
    }

    if (type === "user.updated") {
      await User.findByIdAndUpdate(
        data.id,
        {
          email: data.email_addresses[0].email,
          name: `${data.first_name} ${data.last_name}`.trim(),
          imageUrl: data.image_url,
        }
      );
      return res.json({ success: true });
    }

    if (type === "user.deleted") {
      await User.findByIdAndDelete(data.id);
      return res.json({ success: true });
    }

    return res.json({});
  } catch (error) {
    console.error("WEBHOOK ERROR:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};
