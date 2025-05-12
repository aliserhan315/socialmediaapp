"use server";
import { auth } from "@clerk/nextjs/server";
import { db } from "../lib/db";

export const addStory = async (img) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User is not authenticated!");
  }

  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      await db.user.create({ data: { id: userId } });
    }
    const createdStory = await db.story.create({
      data: {
        userId,
        img,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        //expiresAt: addHours(new Date(), 24),
      },
      include: {
        user: true,
      },
    });
    console.log("Story created:", createdStory);
    return createdStory;
  } catch (err) {
    console.error("Failed to add story:", err.message, err.stack);
    throw new Error("Failed to add story");
  }
};
