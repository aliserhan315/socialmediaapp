"use client";
import Iconify from "@/components/Iconify";
import React, { useRef, useState } from "react";
import { Avatar, Button, Flex, Image, Spin, Typography } from "antd";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import css from "@/styles/PostGenerator.module.css"; // reuse PostGenerator styles
import Box from "@/components/Box";
import { createStory } from "@/actions/createStory";
import { db } from "@/lib/db";

const StoryUploader = () => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const queryClient = useQueryClient();
  const { user } = useUser();

  const { mutate: uploadStory, isPending } = useMutation({
    mutationFn: (data) => createStory(data),
    onSuccess: () => {
      toast.success("Story uploaded!");
      setSelectedFile(null);
      queryClient.invalidateQueries(["stories"]);
    },
    onError: () => toast.error("Failed to upload story"),
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setSelectedFile(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error("No image selected");
      return;
    }
    uploadStory({ media: selectedFile });
  };

  const handleRemove = () => setSelectedFile(null);

  return (
    <Spin spinning={isPending} tip="Uploading...">
      <div className={css.postGenWrapper}>
        <Box className={css.container}>
          <Flex direction="column" gap="1rem">
            <Flex align="center" gap="1rem">
              <Avatar src={user?.imageUrl} size="large" />
              <Typography className="typoSubtitle2">Upload a Story</Typography>
            </Flex>

            {selectedFile && (
              <div className={css.previewContainer}>
                <Button className={css.remove} onClick={handleRemove}>
                  <Typography className="typoCaption">Remove</Typography>
                </Button>
                <Image
                  src={selectedFile}
                  className={css.preview}
                  alt="Story Preview"
                  height={"350px"}
                  width={"100%"}
                />
              </div>
            )}

            <Flex justify="space-between" align="center" className={css.bottom}>
              <Button
                type="text"
                style={{
                  background: "#f0f0f0",
                  borderRadius: "8px",
                }}
                onClick={() => fileInputRef.current.click()}
              >
                <Flex align="center" gap="0.5rem">
                  <Iconify icon="solar:gallery-linear" width="1.2rem" />
                  <Typography className="typoSubtitle2">
                    Choose Image
                  </Typography>
                </Flex>
              </Button>

              <Button
                type="primary"
                onClick={handleUpload}
                disabled={!selectedFile}
              >
                <Flex align="center" gap="0.5rem">
                  <Iconify icon="material-symbols:upload" width="1.2rem" />
                  <Typography
                    className="typoSubtitle2"
                    style={{ color: "white" }}
                  >
                    Share Story
                  </Typography>
                </Flex>
              </Button>
            </Flex>
          </Flex>
        </Box>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
      </div>
    </Spin>
  );
};

export default StoryUploader;
