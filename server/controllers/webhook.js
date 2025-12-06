import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const body = req.body.toString("utf8");

    await wh.verify(body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = JSON.parse(body);

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email,
          name: `${data.first_name} ${data.last_name}`.trim(),
          imageUrl: data.image_url,
        };

        await User.create(userData);
        return res.json({ success: true });
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email,
          name: `${data.first_name} ${data.last_name}`.trim(),
          imageUrl: data.image_url,
        };

        await User.findByIdAndUpdate(data.id, userData);
        return res.json({ success: true });
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        return res.json({ success: true });
      }

      default:
        return res.json({});
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};
