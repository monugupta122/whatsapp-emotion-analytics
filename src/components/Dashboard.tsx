import React from "react";
import { Card, Row, Col, Statistic, Progress, Typography } from "antd";
// import {
//   SmileOutlined,
//   FrownOutlined,
//   MehOutlined,
// } from '@ant-design/icons';
import { EmotionStats } from "../types/chat";

const { Title } = Typography;

interface DashboardProps {
  emotionStats: EmotionStats;
}

const Dashboard: React.FC<DashboardProps> = ({ emotionStats }) => {
  const total = Object.values(emotionStats).reduce(
    (sum: number, count) => sum + (Number(count) || 0),
    0
  );

  const getPercentage = (count: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  const emotionData = [
    {
      emotion: "Happy",
      count: emotionStats?.happy || 0,
      color: "#52c41a",
    },
    {
      emotion: "Sad",
      count: emotionStats?.sad || 0,
      color: "#1890ff",
    },
    {
      emotion: "Angry",
      count: emotionStats?.angry || 0,
      color: "#f5222d",
    },
    {
      emotion: "Neutral",
      count: emotionStats?.neutral || 0,
      color: "#8c8c8c",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Title level={2} className="mb-6 text-gray-800">
          Dashboard
        </Title>

        {/* Overview Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center border-0 shadow-md">
              <Statistic
                title="Total Messages"
                value={total}
                className="text-gray-700"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center border-0 shadow-md">
              <Statistic
                title="Most Common"
                value={
                  emotionData.reduce((prev, current) =>
                    prev.count > current.count ? prev : current
                  ).emotion
                }
                className="text-gray-700"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center border-0 shadow-md">
              <Statistic
                title="Positive Rate"
                value={getPercentage(
                  (emotionStats?.happy || 0) + (emotionStats?.positive || 0) ||
                    0
                )}
                suffix="%"
                className="text-gray-700"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center border-0 shadow-md">
              <Statistic
                title="Negative Rate"
                value={getPercentage(
                  Number(emotionStats?.sad || 0) + (emotionStats?.angry || 0)
                )}
                suffix="%"
                className="text-gray-700"
              />
            </Card>
          </Col>
        </Row>

        {/* Emotion Breakdown */}
        <Row gutter={[16, 16]}>
          {emotionData.map((item) => (
            <Col xs={24} sm={12} lg={6} key={item.emotion}>
              <Card
                className="border-0 shadow-md hover:shadow-lg transition-shadow"
                style={{ borderTop: `4px solid ${item.color}` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div style={{ color: item.color }}>{/* {item.icon} */}</div>
                  <Statistic value={item.count} className="text-right" />
                </div>

                <div className="mb-2">
                  <span className="text-gray-600 font-medium">
                    {item.emotion}
                  </span>
                </div>

                <Progress
                  percent={getPercentage(item.count)}
                  strokeColor={item.color}
                  showInfo={false}
                  className="mb-2"
                />

                <div className="text-sm text-gray-500">
                  {getPercentage(item.count)}% of all messages
                </div>
              </Card>
            </Col>
          ))}

          {/* Other Emotions */}
          <Col xs={24} sm={12} lg={6}>
            <Card
              className="border-0 shadow-md hover:shadow-lg transition-shadow"
              style={{ borderTop: `4px solid #d9d9d9` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div style={{ color: "#d9d9d9" }}>{/* <MehOutlined /> */}</div>
                <Statistic
                  value={
                    total -
                    emotionData.reduce((sum, item) => sum + item.count, 0)
                  }
                  className="text-right"
                />
              </div>

              <div className="mb-2">
                <span className="text-gray-600 font-medium">Other</span>
              </div>

              <Progress
                percent={getPercentage(
                  total - emotionData.reduce((sum, item) => sum + item.count, 0)
                )}
                strokeColor="#d9d9d9"
                showInfo={false}
                className="mb-2"
              />

              <div className="text-sm text-gray-500">
                {getPercentage(
                  total - emotionData.reduce((sum, item) => sum + item.count, 0)
                )}
                % of all messages
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
