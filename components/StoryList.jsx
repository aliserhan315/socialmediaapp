"use client";

import { addStory } from "@/actions/addStory";
import { useUser } from "@clerk/nextjs";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useOptimistic, useState } from "react";
import ImageUploader from "./ImageUploader";

const StoryList = ({ stories, userId }) => {
  const [storyList, setStoryList] = useState(stories || []);
  const [img, setImg] = useState(null);

  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(false); // Added state for loading
  const [error, setError] = useState(null); // Added state for error handling
  const handleImageUpload = (uploadedImg) => {
    setImg(uploadedImg);
  };

  const add = async () => {
    if (!img?.secure_url) return;

    setIsLoading(true); // Start loading state
    setError(null);

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
        cover: "",
        description: "",
        name: "",
        surname: "",
        city: "",
        work: "",
        school: "",
        website: "",
        createdAt: new Date(),
      },
    });

    try {
      const createdStory = await addStory(img.secure_url);
      setStoryList((prev) => [createdStory, ...prev]);
      setImg(null);
    } catch (err) {
      console.error(err);
      setError("Failed to upload story. Please try again.");
    }
  };

  const [optimisticStories, addOptimisticStory] = useOptimistic(
    storyList,
    (state, value) => [value, ...state]
  );

  return (
    <>
      {error && <div className="error-message">{error}</div>}
      <ImageUploader onUpload={handleImageUpload} user={user}>
        {img ? (
          <button
            className="text-xs bg-blue-500 p-1 rounded-md text-white"
            onClick={add} // Use the working `add()` function
          >
            Send
          </button>
        ) : (
          <span className="font-medium">Add a Story</span>
        )}
      </ImageUploader>

      {/* STORY */}
      {optimisticStories.length > 0 ? (
        optimisticStories.map((story) => (
          <div
            className="flex flex-col items-center gap-2 cursor-pointer"
            key={story.id}
          >
            <Image
              src={story.user.avatar || "/noAvatar.png"}
              alt=""
              width={80}
              height={80}
              className="w-20 h-20 rounded-full ring-2"
            />
            <span className="font-medium">
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
        ))
      ) : (
        <p>No stories to show.</p>
      )}
    </>
  );
};

export default StoryList;
