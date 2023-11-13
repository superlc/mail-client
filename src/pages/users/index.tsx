import { Table, Tag, message } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import PageHeader from "../../components/header/Header";
import { ProviderType, UserType } from "../../types";

import "./index.scss";
import { useEffect, useState } from "react";
import { getUsers } from "../../app/apis";
import { UserOutlined } from "@ant-design/icons";

const pageSize = 20;

export default function Users() {
  const columns: ColumnsType<UserType> = [
    {
      title: "Email",
      dataIndex: "email",
      width: "20%",
    },
    {
      title: "Provider",
      dataIndex: "provider",
      width: "20%",
      render: (provider: ProviderType) => {
        return (
          <Tag color={provider === "GOOG" ? "blue" : "orange"}>{provider}</Tag>
        );
      },
    },
    {
      title: "Role",
      dataIndex: "admin",
      width: "20%",
      render: (admin: boolean) => {
        return <>{admin ? <Tag icon={<UserOutlined />}>admin</Tag> : "-"}</>;
      },
    },
    {
      title: "Scan",
      dataIndex: "scan",
      width: "20%",
    },
  ];

  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    getUsers(0, pageSize)
      .then((res) => {
        setUsers(res.users || []);
        setPageIndex((index) => index + 1);
      })
      .catch((err) => message.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="users">
      <div className="users-header">
        <PageHeader current="users" />
      </div>
      <div className="users-body">
        <div className="users-main">
          <Table columns={columns} loading={loading} dataSource={users} />
        </div>
      </div>
    </div>
  );
}
