"use client";

import { useState } from "react";
import { Modal, Button, Flex, Avatar, Typography } from "antd";
import Image from "next/image";
import Link from "next/link";
import Iconify from "./Iconify";
import { useRouter } from "next/navigation";
import Box from "./Box";
import css from "@/styles/PostGenerator.module.css";

const StoriesWrapper = ({ stories, currentUserId }) => {
  const router = useRouter();

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
    <Box className={css.container}>
      <div className="min-h-screen bg-white p-4 text-black">
        {/*  <Button type="primary" className="mb-8" onClick={() => router.back()}>
        <Flex align="center" gap={".5rem"}>
          <Iconify icon="iconamoon:send-fill" width="1.2rem" />
          <Typography
            className="typoSubtitle2 flex py-4"
            style={{ color: "white" }}
          >
            Back
          </Typography>
        </Flex>
      </Button> */}

        {/* Horizontal user list */}
        <div className="mt-10 overflow-x-auto">
          <div className="flex gap-10 px-6 py-2">
            {userList.map(({ user, stories }) => (
              <div
                key={user.id}
                onClick={() => setOpenUser({ user, stories })}
                className="flex-shrink-0 w-fit flex flex-col items-center text-center cursor-pointer"
              >
                <div className="py-2 ">
                  <Avatar size={64} src={user.image_url} alt={user.username} />
                </div>

                <div>
                  <Typography.Text className="mt-1 text-sm truncate max-w-[64px]">
                    {user.username}
                  </Typography.Text>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal with vertical stories */}
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
                <div
                  key={story.id}
                  className="flex justify-center items-center"
                >
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
    </Box>
  );
};

export default StoriesWrapper;
