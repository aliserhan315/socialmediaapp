"use client";

import { addStory } from "@/actions/addStory";
import { useUser } from "@clerk/nextjs";
import { useOptimistic, useState } from "react";
import ImageUploader from "./ImageUploader";
import Image from "next/image";

const StoryList = ({ stories, userId }) => {
  const [storyList, setStoryList] = useState(stories || []);
  const [img, setImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useUser();

  const [optimisticStories, addOptimisticStory] = useOptimistic(
    storyList,
    (state, value) => [value, ...state]
  );

  const handleImageUpload = (uploadedImg) => {
    setImg(uploadedImg);
  };

  const add = async () => {
    if (!img?.secure_url) return;

    setIsLoading(true);
    setError(null);

    // Add temporary optimistic story
    addOptimisticStory({
      id: Date.now().toString(),
      img: img.secure_url,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      userId: userId,
      user: {
        id: userId,
        username: "Sending...",
        avatar: user?.imageUrl || "/noAvatar.png",
        name: "",
      },
    });

    try {
      const createdStory = await addStory(img.secure_url);
      setStoryList((prev) => [createdStory, ...prev]);
      setImg(null);
    } catch (err) {
      console.error(err);
      setError("Failed to upload story. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && <div className="text-red-500 text-sm">{error}</div>}

      {/* Upload area */}
      <ImageUploader onUpload={handleImageUpload} user={user}>
        {img ? (
          <button
            className="text-xs bg-blue-500 p-1 rounded-md text-white mt-2"
            onClick={add}
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Send"}
          </button>
        ) : (
          <span className="font-medium text-sm">Click to upload a new story</span>
        )}
      </ImageUploader>

      {/* Stories grid */}
      {optimisticStories.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {optimisticStories.map((story) => (
            <div
              className="flex flex-col items-center gap-2 cursor-pointer"
              key={story.id}
            >
              <Image
                src={story.user.avatar || "/noAvatar.png"}
                alt="User avatar"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full ring-2"
              />
              <span className="font-medium text-sm">
                {story.user.name || story.user.username}
              </span>
              <Image
                src={story.img}
                alt="Story"
                width={200}
                height={200}
                className="rounded-md"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-gray-500">No stories to show.</p>
      )}
    </>
  );
};

export default StoryList;
