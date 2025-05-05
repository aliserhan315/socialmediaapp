import React, { Suspense } from "react";
import css from "@/styles/Home.module.css";
import PostGenerator from "@/components/Post/PostGenerator";
import Posts from "@/components/Post/Posts";
import PopularTrends from "@/components/PopularTrends";
import FriendsSuggestion from "@/components/FriendsSuggestion";
import { Space, Spin, Typography } from "antd";
import Stories from "@/components/Stories";
import StoryList from "@/components/StoryList";
import ImageUploader from "@/components/ImageUploader";

const HomeView = () => {
  return (
    <div className={css.wrapper}>
      <div className={css.postsArea}>
        <div className="flex flex-col gap-6">
          <Stories />
        </div>
        <div className="flex flex-col gap-6">
          <PostGenerator />
          <Posts />
        </div>
      </div>

      <div className={css.rightSide}>
        <Suspense
          fallback={
            <Space direction="vertical">
              <Spin />
              <Typography className="typoH4">Loading trends...</Typography>
            </Space>
          }
        >
          <PopularTrends />
        </Suspense>

        <FriendsSuggestion />
      </div>
    </div>
  );
};

export default HomeView;
