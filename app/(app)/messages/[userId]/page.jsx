"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { getMessagesWithUser, getUserById } from "@/actions/messages";
import { sendMessageToUser } from "@/actions/messages";
import Image from "next/image";
import Box from "@/components/Box";

export default function ChatPage() {
  const { userId: otherUserId } = useParams();
  const { user } = useUser();
  const chatEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load messages and user info once
  useEffect(() => {
    if (!otherUserId) return;
    const loadChat = async () => {
      try {
        const userInfo = await getUserById(otherUserId);
        setOtherUser(userInfo);
        const chatHistory = await getMessagesWithUser(otherUserId);
        setMessages(chatHistory);
      } catch (err) {
        console.error("Error loading chat:", err);
      }
    };
    loadChat();
  }, [otherUserId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await sendMessageToUser({
        senderId: user.id,
        receiverId: otherUserId,
        content,
      });
      setContent("");
      // Refresh messages after sending
      const chatHistory = await getMessagesWithUser(otherUserId);
      console.log("Fetched chatHistory after send:", chatHistory); // Debug line
      setMessages(chatHistory);
    } catch (err) {
      console.error("Failed to send:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", borderRadius: 18, boxShadow: "0 4px 24px #0002", background: "#fff", display: "flex", flexDirection: "column", height: "80vh", overflow: "hidden" }}>
      {/* Header */}
      <Box type="boxBg" style={{ padding: "28px 24px 16px 24px", display: "flex", alignItems: "center", borderBottom: "1px solid #f0f0f0" }}>
        {otherUser?.image_url && (
          <Image src={otherUser.image_url} alt="User avatar" width={52} height={52} style={{ borderRadius: "50%", objectFit: "cover", border: "2px solid #1677ff", marginRight: 16 }} />
        )}
        <span style={{ fontWeight: 700, fontSize: 22, color: "#222" }}>
          {otherUser?.first_name} {otherUser?.last_name}
        </span>
      </Box>

      {/* Chat */}
      <Box type="boxBg" style={{ flex: 1, overflowY: "auto", padding: "32px 18px 20px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((msg, idx) => {
          const isUser = msg.senderId === user?.id;
          const avatar = isUser ? user?.imageUrl : otherUser?.image_url;
          const name = isUser ? `${user?.firstName} ${user?.lastName}` : `${otherUser?.first_name} ${otherUser?.last_name}`;
          return (
            <div key={msg.id || idx} style={{ display: "flex", flexDirection: isUser ? "row-reverse" : "row", alignItems: "flex-end", gap: 10 }}>
              <Image src={avatar || "/default-avatar.png"} alt="Chat avatar" width={36} height={36} style={{ borderRadius: "50%", objectFit: "cover", border: isUser ? "2px solid #1677ff" : "2px solid #eaeaea" }} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", maxWidth: "68%" }}>
                <span style={{ fontSize: 13, color: "#888", marginBottom: 3 }}>{name}</span>
                <Box type={isUser ? "colorPrimaryBg" : "boxBg"} style={{ color: isUser ? "#fff" : "#111", borderRadius: 18, padding: "11px 18px", fontSize: 16, wordBreak: "break-word", backgroundColor: isUser ? "#1677ff" : "#f1f1f1", boxShadow: isUser ? "0 1px 10px #1677ff33" : "0 1px 10px #bbb4" }}>
                  {msg.content}
                </Box>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </Box>

      {/* Input */}
      <Box type="boxBg" style={{ borderTop: "1px solid #ececec", padding: 14, display: "flex", background: "#fff" }}>
        <form onSubmit={handleSend} style={{ display: "flex", flex: 1, gap: 10 }}>
          <input
            type="text"
            placeholder="Type your message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              flex: 1,
              padding: "12px 18px",
              border: "1px solid #ddd",
              borderRadius: 22,
              outline: "none",
              fontSize: 16,
              background: "#f9f9f9",
              color: "#222",
            }}
          />
          <button
            type="submit"
            style={{
              background: "#1677ff",
              color: "#fff",
              border: "none",
              borderRadius: 22,
              padding: "12px 26px",
              fontWeight: "bold",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </Box>
    </div>
  );
}