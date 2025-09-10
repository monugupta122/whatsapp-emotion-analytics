import React from "react";
import { Avatar, Typography, Tag, Empty } from "antd";
import { Chat } from "../types/chat";

const { Text } = Typography;

interface ChatWindowProps {
  chat: Chat | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chat }) => {
  if (!chat) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <Empty
          description="Select a chat to view messages"
          className="text-gray-400"
        />
      </div>
    );
  }

  const getOtherParticipant = (chat: Chat) => {
    return (
      chat.Conversation.find((p) => p.IsIncoming)?.ContactName || "Unknown"
    );
  };

  const otherUser = getOtherParticipant(chat);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case "happy":
        return "green";
      case "sad":
        return "blue";
      case "angry":
        return "red";
      default:
        return "default";
    }
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case "happy":
        return "😊";
      case "sad":
        return "😢";
      case "angry":
        return "😠";
      default:
        return "😐";
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <Avatar
            src={"https://ui-avatars.com/api/?name=User&background=random"}
            size={40}
            className="border border-gray-200"
          />
          <div>
            <Text className="font-medium text-gray-900 block">{otherUser}</Text>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.Conversation.map((message) => {
          const isCurrentUser = !message.IsIncoming;

          console.log("Message:", message);
          return (
            <div
              key={message.MessageID}
              className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isCurrentUser
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <div className="mb-2">
                  <Text
                    className={`text-sm ${
                      isCurrentUser ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {message.MessageBody}
                  </Text>
                </div>

                <div className="flex items-center justify-between space-x-2 mt-2">
                  <Tag
                    color={getEmotionColor(message.Emotion)}
                    className="text-xs border-0 px-2 py-0"
                  >
                    {getEmotionIcon(message.Emotion)} {message.Emotion}
                  </Tag>

                  <Text
                    className={`text-xs ${
                      isCurrentUser ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {formatTimestamp(message.Timestamp)}
                  </Text>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatWindow;
