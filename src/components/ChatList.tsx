import React from "react";
import { List, Avatar, Badge, Typography } from "antd";
import { Chat } from "../types/chat";

const { Text } = Typography;

interface ChatListProps {
  chats: Chat[];
  selectedUserChat: string | null;
  onChatSelect: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  selectedUserChat,
  onChatSelect,
}) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getOtherParticipant = (chat: Chat) => {
    return (
      chat.Conversation.find((p) => p.IsIncoming)?.ContactName || "Unknown"
    );
  };

  return (
    <div className="h-full bg-white">
      <div className="p-4 border-b border-gray-200">
        <Text className="text-lg font-semibold text-gray-800">Chats</Text>
      </div>
      <List
        className="chat-list"
        itemLayout="horizontal"
        dataSource={chats}
        renderItem={(chat) => {
          const otherUser = getOtherParticipant(chat);
          const isSelected = selectedUserChat === chat.UserPhoneNumber;

          return (
            <List.Item
              className={`cursor-pointer transition-colors hover:bg-gray-50 px-4 py-3 ${
                isSelected ? "bg-blue-50 border-r-2 border-blue-500" : ""
              }`}
              onClick={() => onChatSelect(chat.UserPhoneNumber)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={
                      "https://ui-avatars.com/api/?name=User&background=random"
                    }
                    size={48}
                    className="border border-gray-200"
                  />
                }
                title={
                  <div className="flex justify-between items-center">
                    <Text className="font-medium text-gray-900">
                      {otherUser}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {/* {formatTime(chat.LastMessage.Timestamp)} */}
                    </Text>
                  </div>
                }
                description={
                  <div className="mt-1">
                    <Text className="text-sm text-gray-600 line-clamp-1">
                      {chat.LastMessage?.MessageBody}
                    </Text>
                    {/* <div className="flex items-center mt-1">
                      {otherUser.LastSeen && (
                        <Text className="text-xs text-gray-400">
                          Last seen {otherUser.LastSeen}
                        </Text>
                      )}
                    </div> */}
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default ChatList;
