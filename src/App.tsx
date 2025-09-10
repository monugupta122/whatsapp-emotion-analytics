import { useState, useMemo, useEffect } from "react";
import { Layout, Menu } from "antd";
import { MessageOutlined, BarChartOutlined } from "@ant-design/icons";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import Dashboard from "./components/Dashboard";
import { useApi } from "./hooks/useApi";
import { useRESTQuery } from "./hooks/useRESTQuery";
import { errorToast } from "./utils/toast";
import { Chat } from "./types/chat";

const { Sider, Content } = Layout;

type ViewType = "chats" | "dashboard";

function App() {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [selectedUserChat, setSelectedUserChat] = useState<string | null>(null);

  const {
    isLoading: isChatsLoading,
    data: chatsData,
    isError: isChatsError,
  } = useRESTQuery(["chats"], useApi("getWebhook"), {
    params: { action: "CHATS" },
  });

  const {
    isLoading: isAnalyticsLoading,
    data: analyticsData,
    isError: isAnalyticsError,
  } = useRESTQuery(["analytics"], useApi("getWebhook"), {
    params: { action: "ANALYTICS" },
  });

  console.log("Chats Data:", chatsData);
  console.log("Analytics Data:", analyticsData);

  const generateChats = (userChats: Chat[]) => {
    if (userChats && userChats.length > 0) {
      const participantsMap: { [key: string]: any } = {};

      userChats.forEach((chat) => {
        chat.Conversation.forEach((message) => {
          if (!participantsMap[message.SenderPhoneNumber]) {
            participantsMap[message.SenderPhoneNumber] = {
              PhoneNumber: message.SenderPhoneNumber,
              ContactName: message.ContactName,
            };
          }
        });
      });

      console.log("Participants Map:", Object.values(participantsMap));

      return userChats.map((chat) => ({
        ...chat,
        LastMessage:
          (chat.Conversation && chat.Conversation.length > 0
            ? chat.Conversation[chat.Conversation.length - 1]
            : null),
        Participants: Object.values(participantsMap),
      }));
    }
  };

  const chats = useMemo(() => {
    if (chatsData?.data && Array.isArray(chatsData?.data)) {
      return generateChats(chatsData.data) || [];
    } else if (chatsData?.data && typeof chatsData?.data === "object") {
      return generateChats([chatsData.data]) || [];
    }
    return [];
  }, [chatsData]);

  const selectedChat =
    chats?.find((chat) => chat.UserPhoneNumber === selectedUserChat) || null;

  const menuItems = [
    {
      key: "dashboard",
      icon: <BarChartOutlined />,
      label: "Analytics",
    },
    {
      key: "chats",
      icon: <MessageOutlined />,
      label: "Chats",
    },
  ];

  const handleMenuClick = (e: { key: string }) => {
    setCurrentView(e.key as ViewType);
    if (e.key === "dashboard") {
      setSelectedUserChat(null);
    }
  };

  const handleChatSelect = (userPhone: string) => {
    setSelectedUserChat(userPhone);
  };

  useEffect(() => {
    if (isAnalyticsError || isChatsError) {
      errorToast("Error fetching data. Please try again later.");
    }
  }, [isAnalyticsError, isChatsError]);

  return isAnalyticsLoading || isChatsLoading ? (
    <div className="h-screen flex items-center justify-center flex-col space-y-4">
      <div className="animate-spin rounded-full border-8 border-t-8 border-gray-200 border-t-blue-500 h-32 w-32"></div>
      <div>Getting Chats...</div>
    </div>
  ) : (
    <Layout className="min-h-screen">
      {/* Navigation Sidebar */}
      <Sider width={180} theme="light" className="border-r border-gray-200">
        <div className="p-4 text-center border-b border-gray-200">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mx-auto">
            <MessageOutlined className="text-white text-lg" />
          </div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[currentView]}
          items={menuItems}
          onClick={handleMenuClick}
          className="border-r-0 pt-4"
        />
      </Sider>

      <Layout>
        {currentView === "chats" ? (
          <>
            {/* Chat List Sidebar */}
            <Sider
              width={350}
              theme="light"
              className="border-r border-gray-200"
            >
              <ChatList
                chats={chats}
                selectedUserChat={selectedUserChat}
                onChatSelect={handleChatSelect}
              />
            </Sider>

            {/* Chat Window */}
            <Content>
              <ChatWindow chat={selectedChat} />
            </Content>
          </>
        ) : (
          /* Dashboard */
          <Content>
            <Dashboard emotionStats={analyticsData.data?.EmotionStatistics} />
          </Content>
        )}
      </Layout>
    </Layout>
  );
}

export default App;
