import { db } from "@/lib/db";
import { verifyWebhook } from "@clerk/backend/webhooks";

export async function POST(request: Request) {
  try {
    const evt = await verifyWebhook(request);

    // Access the event data
    const { id } = evt.data;
    const eventType = evt.type;
    
    // Handle specific event types
    if (eventType === "user.created") {
        await db.user.create({
            data:{
                externalUserId:id!,
                username:evt.data.username??"",
                imageUrl:evt.data.image_url??"",
                stream:{
                  create:{
                    name:`${evt.data.username}'s stream`
                  }
                }
            }
        })
    }

    if(eventType==='user.updated'){
      const currentUser=await db.user.findUnique({
        where:{
          externalUserId:id!
        }
      });

      if(!currentUser){
        return new Response("User not found",{status:404});
      }

      await db.user.update({
        where:{
          externalUserId:id!,
        },
        data:{
          username:evt.data.username??"",
          imageUrl:evt.data.image_url??""
        }
      })
    }

    if(eventType==='user.deleted'){
      await db.user.delete({
        where:{
          externalUserId:id!
        }
      });
    }

    return new Response("Success", { status: 200 });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Webhook verification failed", { status: 400 });
  }
}