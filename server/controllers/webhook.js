import { Webhook } from "svix";
import User from "../models/User.js";

//manage clerk user in database
export const clerkWebhooks = async(req,res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        await whook.verify(JSON.stringify(req.body), {
            'svix-id' : req.headers['svix-id'],
            'svix-timestamp' : req.headers['svix-timestamp'],
            'svix-signature' : req.headers['svix-signature'],
        })
        const {data, type} = req.body
        switch (type) {
            case 'user.created':{
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email,
                    name: `${data.first_name} ${data.last_name}`.trim(),
                    imageUrl: data.image_url
                }
                await User.create(userData)
                res.json({})
                break
            }
                
            case 'user.updated': {
                 const userData = {
                    email: data.email_addresses[0].email,
                    name: `${data.first_name} ${data.last_name}`.trim(),
                    imageUrl: data.image_url
                }
                await User.findByIdAndUpdate(data.id, userData)
                res.json({})
                break
            }

            case 'user.deleted': {
                await User.findByIdAndDelete(data.id)
                res.json({})
                break
            }
        
            default:
                return res.json({});
        }
        console.log("FULL BODY:", body);
        console.log("TYPE:", type);
        console.log("DATA:", data);
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}