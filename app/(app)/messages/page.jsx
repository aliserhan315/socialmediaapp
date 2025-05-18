"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { getAllFollowersAndFollowings } from "@/actions/user";

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

  if (isLoading) {
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
    <div className="h-screen w-full flex bg-white dark:bg-black text-black dark:text-white">
      <div className="w-full max-w-md border-r border-gray-300 dark:border-white/10 bg-white dark:bg-zinc-900">
        <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-white/10">
          <h2 className="text-xl font-semibold">Chats</h2>
          <button className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
        <div className="p-4 flex justify-center">
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-4/5 bg-gray-200 dark:bg-zinc-800 text-black dark:text-white text-sm px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder:text-gray-500 dark:placeholder:text-zinc-400"
          />
        </div>
        <div className="overflow-y-auto h-[calc(100vh-120px)]">
          {filteredUsers.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-zinc-500">No matching users found.</p>
          ) : (
            <ul className="divide-y divide-gray-300 dark:divide-white/5">
              {filteredUsers.map((person) => {
                const isUnread = Math.random() < 0.5;
                return (
                  <li key={person.id}>
                    <Link
                      href={`/messages/${person.id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-white/5 transition"
                    >
                      {person.image_url && (
                        <Image
                          src={person.image_url}
                          alt={`${person.first_name}'s avatar`}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate font-semibold text-black dark:text-white">
                          {person.first_name} {person.last_name}
                        </p>
                      </div>
                      {isUnread && <span className="h-3 w-3 rounded-full bg-pink-500"></span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <div className="flex-1 hidden lg:flex items-center justify-center bg-gray-100 dark:bg-zinc-950">
        <p className="text-gray-600 dark:text-zinc-600 text-lg">Select a conversation to start chatting</p>
      </div>
    </div>
  );
}
