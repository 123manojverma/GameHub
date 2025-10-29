"use client"

import { createIngress } from "@/actions/ingress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IngressInput } from "livekit-server-sdk"
import { AlertTriangle } from "lucide-react"
import { ElementRef, useRef, useState, useTransition } from "react"
import { toast } from "sonner"

const RTMP = String(IngressInput.RTMP_INPUT)
const WHIP = String(IngressInput.WHIP_INPUT)

type IngressType = typeof RTMP | typeof WHIP;


export const ConnectModal=()=>{
    const closeRef=useRef<ElementRef<"button">>(null);
    const [isPending,startTransition]=useTransition();
    const [ingressType,setingressType]=useState<IngressType>(RTMP)

    const onSubmit=async()=>{
        startTransition(()=>{
            createIngress(parseInt(ingressType))
            .then(()=>{
                toast.success('Ingress Created');
                closeRef.current?.click()
            })
            .catch(()=>toast.error("Something Went Wrong"))
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="primary">
                    Generate connection
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate connection</DialogTitle>
                </DialogHeader>
                <Select
                    disabled={isPending}
                    value={ingressType}
                    onValueChange={(value)=>setingressType(value as IngressType)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Ingress Type"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={RTMP}>RTMP</SelectItem>
                        <SelectItem value={WHIP}>WHIP</SelectItem>
                    </SelectContent>
                </Select>
                <Alert className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Warning!</AlertTitle>
                    <AlertDescription>
                        This action will reset all active streams using the current connection
                    </AlertDescription>
                </Alert>
                <div className="flex justify-between">
                    <DialogClose ref={closeRef} asChild>
                        <Button variant="ghost" disabled={isPending}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={onSubmit}
                        variant="primary"
                        disabled={isPending}
                    >
                        {isPending?"Generating...":"Generate"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}