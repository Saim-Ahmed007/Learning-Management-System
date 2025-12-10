import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

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

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

export const stripeWebhooks = async(request,response) => {
  const sig = request.headers['stripe-signature'];
  let event;
  try {
    event = Stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  }
  catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }
   switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId
      })
      const {purchaseId} = session.data[0].metadata
      const purchaseData = await Purchase.findById(purchaseId)
      const userData = await User.findById(purchaseData.user)
      const courseData = await Course.findById(purchaseData.courseId.toString())
      courseData.enrolledStudents.push(userData)
      await courseData.save()
      userData.enrolledStudents.push(courseData._id)
      await userData.save()
      purchaseData.status = 'completed'
      await purchaseData.save()
      break;
    }
    case 'payment_intent.payment_failed':{
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId
      })
      const {purchaseId} = session.data[0].metadata
      const purchaseData = await Purchase.findById(purchaseId)
      purchaseData.status = 'failed'
      await purchaseData.save()
      break;
    }
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
   response.json({received: true});
}
