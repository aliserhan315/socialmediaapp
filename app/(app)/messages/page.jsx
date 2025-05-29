"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { getAllFollowersAndFollowings } from "@/actions/user";
import Box from "@/components/Box";
import css from "@/styles/PostGenerator.module.css";
import SearchBox from "@/components/SearchBox";
import CardList from "@/components/CardList";

export default function MessagesPage() {
  const { user } = useUser();
  const [followingUsers, setFollowingUsers] = useState([]);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user", user?.id, "followInfo"],
    queryFn: () => {
      if (!user?.id) throw new Error("User ID is undefined");
      return getAllFollowersAndFollowings(user.id);
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (data?.following && Array.isArray(data.following)) {
      const validUsers = data.following
        .map((f) => f.following)
        .filter((person) => person?.id);
      setFollowingUsers(validUsers);
    }
  }, [data]);

  const filteredUsers = followingUsers.filter((person) => {
    const fullName = `${person.first_name} ${person.last_name}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-red-500">Failed to load messages.</span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Box className={css.container}>
        <h1
          className="text-xl font-bold mb-14 bg-blue-600 p-4 rounded-t-lg bg-primary"
          style={{ color: "#0070f3" }}
        >
          Messages
        </h1>
      </Box>
      <div>
        <br />
      </div>
      <Box className={css.container}>
        <div className=" flex justify-center mb-8">
          <SearchBox
            placeholder="Search by name"
            onChangeHandler={(e) => setSearch(e.target.value)}
          />
        </div>

        <CardList listcomponent={filteredUsers} />
      </Box>
    </div>
  );
}
