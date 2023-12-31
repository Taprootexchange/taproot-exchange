import React from "react";
import { Table, Divider, Tag, Space } from "antd";
import { RightOutlined } from "@ant-design/icons";
const columns = [
  {
    title: "Token",
    dataIndex: "token",
    render: (text, recrod) => (
      <>
        <span className="token-name">{text}</span>
        <Tag className="token-line">{"BRE-20"}</Tag>
      </>
    ),
  },
  {
    title: "Deploy Time",
    dataIndex: "deployTime",
    render: (text, recrod) => (
      <>
        <span className="font-style">{text}</span>
      </>
    ),
  },
  {
    title: "Progress",
    dataIndex: "progress",
  },
  {
    title: "Holders",
    dataIndex: "holders",
    render: (text, recrod) => (
      <>
        <span className="font-style">{text}</span>
      </>
    ),
  },
  {
    title: "Market Cap",
    dataIndex: "marketCap",
    render: (text, recrod) => (
      <>
        <span className="font-style">{text}</span>
      </>
    ),
  },
  {
    width: 20,
    render: () => (
      <Space>
        <RightOutlined style={{ fontSize: "14px", color: "#333333" }} />
      </Space>
    ),
  },
];
const data = [];
const Favorites = () => (
  <div className="content-box">
    <Table columns={columns} dataSource={data} size="middle" />
  </div>
);
export default Favorites;
