"use client"

import { useViewerToken } from "@/hooks/use-viewer-token";
import { Stream, User } from "@prisma/client"

interface StreamPlayerProps{
    user:User & {stream:Stream | null};
    stream:Stream;
    isFollowing:boolean;
}

export const StreamPlayer = ({
    user,
    stream,
    isFollowing
}:StreamPlayerProps) => {
    const {
        token,
        name,
        identity
    } = useViewerToken(user.id);

    console.log(identity)
    
    if(!token || !name || !identity){
        return(
            <div>
                Cannot watch the stram
            </div>
        )
    }

    return (
        <div>
            Allowed to watch the stream
        </div>
    )
}