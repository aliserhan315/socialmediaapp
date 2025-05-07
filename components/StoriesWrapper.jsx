"use client";

import { useState } from "react";
import { Modal, Avatar, Typography } from "antd";
import Image from "next/image";

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
    <div className="p-4 bg-white rounded-lg shadow-md overflow-x-auto scrollbar-hide">
      {/* Horizontal user list */}
      <div className="flex gap-4 overflow-x-auto w-full scrollbar-hide">
  {userList.map(({ user, stories }) => (
    <div
      key={user.id}
      className="flex flex-col items-center cursor-pointer w-20 shrink-0"
      onClick={() => setOpenUser({ user, stories })}
    >
      <Avatar size={64} src={user.image_url} alt={user.username} />
      <Typography.Text className="mt-1 text-xs truncate text-center w-full">
        {user.username}
      </Typography.Text>
    </div>
  ))}
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
          <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
            {openUser.stories.map((story) => (
              <div
                key={story.id}
                className="flex justify-center items-center"
              >
                <Image src={story.img}
                  alt="Story"
                  width={300}
                  height={300}
                  className="max-w-full max-h-[20] rounded"/>
               
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StoriesWrapper;
