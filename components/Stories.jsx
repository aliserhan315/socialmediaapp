import { db } from "../lib/db";
import { auth } from "@clerk/nextjs/server";
import StoriesWrapper from "./StoriesWrapper";

const Stories = async () => {
  const { userId: currentUserId } = auth();
  if (!currentUserId) return null;

  const stories = await db.story.findMany({
    where: {
      expiresAt: {
        gt: new Date(),
      },
      OR: [
        {
          user: {
            followers: {
              some: {
                followerId: currentUserId,
              },
            },
          },
        },
        {
          userId: currentUserId,
        },
      ],
    },
    include: {
      user: true,
    },
  });

  return <StoriesWrapper stories={stories} currentUserId={currentUserId} />;
};

export default Stories;
