"use client";

import { useState } from "react";
import { Modal, Avatar, Typography } from "antd";
import Image from "next/image";
import AddStoryWview from "./AddStoryWview";
import Box from "./Box";
import css from "@/styles/PostGenerator.module.css";

const StoriesWrapper = ({ stories, currentUserId }) => {
  const [openUser, setOpenUser] = useState(null);

  const storiesByUser = stories.reduce((acc, story) => {
    const { user } = story;
    if (!acc[user.id]) {
      acc[user.id] = { user, stories: [] };
    }
    acc[user.id].stories.push(story);
    return acc;
  }, {});

  const userList = Object.values(storiesByUser);

  return (
    <div style={{ height: "100vh", overflowY: "auto", background: "white" }}>
      <div className="w-full overflow-x-auto px-4">
        <AddStoryWview />
      </div>

      <div className="mt-10 w-full">
        <div
          style={{
            height: "300px",
            overflowX: "auto",
            background: "#eee",
            display: "flex",
            gap: "1rem",
            padding: "0.5rem 1rem",
            minWidth: "max-content",
          }}
        >
          {userList.map(({ user, stories }) => (
            <Box key={user.id} className={css.container}>
              <div
                onClick={() => setOpenUser({ user, stories })}
                className="flex flex-col items-center text-center cursor-pointer flex-shrink-0 w-[80px]"
              >
                <Box key={user.id} className={css.container}>
                  <Avatar size={64} src={user.image_url} alt={user.username} />
                </Box>
                <Box key={user.id} className={css.container}>
                  {" "}
                  <Typography.Text className="mt-1 text-xs truncate w-full">
                    {user.username}
                  </Typography.Text>
                </Box>
              </div>
            </Box>
          ))}
        </div>
      </div>

      <Modal
        open={!!openUser}
        title={`${openUser?.user.username}'s Stories`}
        footer={null}
        onCancel={() => setOpenUser(null)}
        centered
        width={400}
      >
        {openUser && (
          <div className="flex flex-row gap-4 max-w-full overflow-x-auto">
            {openUser.stories.map((story) => (
              <div key={story.id} className="flex justify-center items-center">
                <Image
                  src={story.img}
                  alt="Story"
                  width={300}
                  height={300}
                  className="max-w-full max-h-[600px] rounded"
                />
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StoriesWrapper;
