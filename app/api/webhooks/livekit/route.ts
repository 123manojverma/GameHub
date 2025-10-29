import { headers } from "next/headers";
import { WebhookReceiver } from "livekit-server-sdk";
import { db } from "@/lib/db";

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY!;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET!;

const receiver = new WebhookReceiver(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const headerPayload = await headers(); 
        const authorization = headerPayload.get("authorization");

        if (!authorization) {
            return new Response("Missing Authorization header", { status: 400 });
        }

        const event = await receiver.receive(body, authorization);

        switch (event.event) {
            case "ingress_started":
                console.log("Ingress started:", event.ingressInfo?.ingressId);
                await db.stream.update({
                    where: { ingressId: event.ingressInfo?.ingressId ?? "" },
                    data: { isLive: true },
                });
                break;

            case "ingress_ended":
                console.log("Ingress ended:", event.ingressInfo?.ingressId);
                await db.stream.update({
                    where: { ingressId: event.ingressInfo?.ingressId ?? "" },
                    data: { isLive: false },
                });
                break;

            case "participant_joined":
                console.log("Participant joined:", event.participant?.identity);
                break;

            case "participant_left":
                console.log("Participant left:", event.participant?.identity);
                break;

            case "room_finished":
                console.log("Room finished:", event.room?.name);
                break;

            default:
                console.log("Unhandled event:", event.event);
        }


        return new Response("OK", { status: 200 });
    } catch (error) {
        console.error("Webhook error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}