"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";

// Send a message
export const sendMessageToUser = async ({ senderId, receiverId, content }) => {
  try {
    const message = await db.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
    });
    return message;
  } catch (e) {
    console.error("Failed to send message:", e);
    throw e;
  }
};

// Get all messages between current user and a specific user
export const getMessagesWithUser = async (otherUserId) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Not authenticated");

    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: user.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: user.id },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return messages;
  } catch (e) {
    console.error("Failed to fetch messages:", e);
    throw e;
  }
};

// Fetch user info by ID (used in chat header)
export const getUserById = async (id) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        image_url: true,
        username: true,
      },
    });
    return user;
  } catch (e) {
    console.error("Failed to get user:", e);
    throw e;
  }
};
