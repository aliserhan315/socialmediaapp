"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { uploadFile } from "./uploadFile";

export const createStory = async ({ media }) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Not authenticated");

    const { public_id, secure_url } = await uploadFile(
      media,
      `/stories/${user.id}`
    );

    const newStory = await db.story.create({
      data: {
        //media: secure_url,
        //cld_id: public_id,
        img: secure_url,
        user: {
          connect: { id: user.id },
        },
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // <-- Add this line
      },
    });

    return { data: newStory };
  } catch (error) {
    console.error("Error creating story:", error);
    throw new Error("Failed to upload story");
  }
};
