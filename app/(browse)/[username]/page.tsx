import { isFollowingUser } from "@/lib/follow-service";
import { getUserByUsername } from "@/lib/user-service";
import { notFound } from "next/navigation";
import { Actions } from "./_components/actions";
import { isBlocedByUser } from "@/lib/block-service";

interface UserPageProps{
    params:{
        username:string;
    };
};


const UserPage=async({
    params
}:UserPageProps)=>{
    const user=await getUserByUsername(params.username);
    if(!user){
        notFound();
    }

    const isFollowing=await isFollowingUser(user.id);
    const isBlocked=await isBlocedByUser(user.id)

    // To block the user to can't see the page of who blocked him
    // if(isBlocked){
    //     notFound();
    // }

    return (
        <div className="flex flex-col gap-y-4">
            <p>Username: {user.username}</p>
            <p>User ID: {user.id}</p>
            <p>is following: {`${isFollowing}`}</p>
            <p>is blocked by this user: {`${isBlocked}`}</p>
            <Actions userId={user.id} isFollowing={isFollowing}/>
        </div>
    )
}

export default UserPage;