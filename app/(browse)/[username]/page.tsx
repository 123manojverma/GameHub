import { isFollowingUser } from "@/lib/follow-service";
import { getUserByUsername } from "@/lib/user-service";
import { notFound } from "next/navigation";
import { isBlocedByUser } from "@/lib/block-service";
import { StreamPlayer } from "@/components/stream-player";

export default async function UserPage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;

  if (!username) notFound();

  const user = await getUserByUsername(username);
  if (!user || !user.stream) notFound();

  const [isFollowing, isBlocked] = await Promise.all([
    isFollowingUser(user.id),
    isBlocedByUser(user.id),
  ]);

  if (isBlocked) notFound();

  return (
    <div>
      <StreamPlayer
        user={user}
        stream={user.stream}
        isFollowing={isFollowing}
      />
    </div>
  );
}