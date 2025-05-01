import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const sendMessage = async (receiverId, content) => {
  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");

  const message = await db.message.create({
    data: {
      senderId: userId,
      receiverId,
      content,
    },
  });

  return message;
};
