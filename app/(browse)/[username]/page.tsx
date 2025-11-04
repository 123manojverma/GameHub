import { isFollowingUser } from "@/lib/follow-service";
import { getUserByUsername } from "@/lib/user-service";
import { notFound } from "next/navigation";
import { isBlocedByUser } from "@/lib/block-service";
import { StreamPlayer } from "@/components/stream-player";

interface UserPageProps{
    params:{
        username:string;
    };
};


const UserPage=async({
    params
}:UserPageProps)=>{
    const user=await getUserByUsername(params.username);
    if(!user || !user.stream){
        notFound();
    }

    const isFollowing=await isFollowingUser(user.id);
    const isBlocked=await isBlocedByUser(user.id)

    // To block the user to can't see the page of who blocked him
    if(isBlocked){
        notFound();
    }

    return (
        <div>
            <StreamPlayer 
                user={user}
                stream={user.stream}
                isFollowing={isFollowing}
            />
        </div>
    )
}

export default UserPage;