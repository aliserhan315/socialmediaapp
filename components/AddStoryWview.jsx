"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { addStory } from "@/actions/addStory";
import ImageUploader from "./ImageUploader";
import Image from "next/image";

const AddStoryWview = ({ userId, onStoryAdded }) => {
  const [img, setImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser();

  const handleImageUpload = (uploadedImg) => {
    setImg(uploadedImg);
  };

  const handleAddStory = async () => {
    if (!img?.secure_url) return;

    setIsLoading(true);
    setError(null);

    try {
      const newStory = await addStory(img.secure_url);
      onStoryAdded?.(newStory);
      setImg(null);
    } catch (err) {
      console.error(err);
      setError("Failed to upload story. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4">
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <ImageUploader onUpload={handleImageUpload} user={user}>
        {img ? (
          <div className="flex flex-col items-center gap-2">
            <Image
              src={img.secure_url}
              alt="Preview"
              width={128}
              height={128}
              className="object-cover rounded-md"
            />
            <button
              onClick={handleAddStory}
              disabled={isLoading}
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 text-sm"
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        ) : (
          <span className="text-sm font-medium text-blue-500 underline cursor-pointer">
            Upload a Story
          </span>
        )}
      </ImageUploader>
    </div>
  );
};

export default AddStoryWview;
