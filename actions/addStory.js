import { auth } from "@clerk/nextjs/server";
import { db } from "../lib/db";

export const addStory = async (img) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User is not authenticated!");
  }

  try {
    const existingStory = await db.story.findFirst({
      where: {
        userId,
      },
    });

    if (existingStory) {
      await db.story.delete({
        where: {
          id: existingStory.id,
        },
      });
    }

    const createdStory = await db.story.create({
      data: {
        userId,
        img,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      include: {
        user: true,
      },
    });

    return createdStory;
  } catch (err) {
    console.error("Failed to add story:", err);
    throw new Error("Failed to add story");
  }
};
