import { Switch, Table, Tag, message } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import PageHeader from "../../components/header/Header";
import { ProviderType, UserType } from "../../types";

import "./index.scss";
import { useEffect, useState } from "react";
import { getUsers, updateScan } from "../../app/apis";
import { useImmer } from "use-immer";

interface TableParams {
  pagination?: TablePaginationConfig;
}

export default function Users() {
  const columns: ColumnsType<
    UserType & {
      updatingScan?: boolean;
    }
  > = [
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
      title: "Admin",
      dataIndex: "admin",
      width: "20%",
      render: (admin: boolean) => {
        return <>{admin ? <Tag>YES</Tag> : <Tag>NO</Tag>}</>;
      },
    },
    {
      title: "Scannable",
      dataIndex: "scan",
      width: "20%",
      render: (
        scan: boolean,
        record: UserType & {
          updatingScan?: boolean;
        }
      ) => {
        return (
          <Switch
            checked={scan}
            size="small"
            loading={record.updatingScan}
            onClick={(targetValue) => {
              if (record.updatingScan) {
                return;
              }
              setUsers((users) => {
                const user = users.find((u) => u.id === record.id);
                user!.updatingScan = true;
              });
              updateScan(record.id, targetValue)
                .then((res) => {
                  setUsers((users) => {
                    const user = users.find((u) => u.id === record.id);
                    user!.scan = res.scan;
                  });
                  message.success(
                    `${record.email}'s scan has been set ${res.scan}`
                  );
                })
                .catch((err) => message.error(err))
                .finally(() => {
                  setUsers((users) => {
                    const user = users.find((u) => u.id === record.id);
                    user!.updatingScan = false;
                  });
                });
            }}
          />
        );
      },
    },
  ];

  const [users, setUsers] = useImmer<
    (UserType & {
      updatingScan?: boolean;
    })[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useImmer<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  useEffect(() => {
    setLoading(true);
    getUsers(
      tableParams.pagination?.current! - 1,
      tableParams.pagination?.pageSize
    )
      .then((res) => {
        setUsers(res.users || []);
        setTableParams((params) => {
          params.pagination!.total = res.total_count;
        });
      })
      .catch((err) => message.error(err))
      .finally(() => setLoading(false));
  }, [JSON.stringify(tableParams)]);

  return (
    <div className="users">
      <div className="users-header">
        <PageHeader current="users" />
      </div>
      <div className="users-body">
        <div className="users-main">
          <Table
            columns={columns}
            loading={loading}
            dataSource={users}
            rowKey={(r) => r.id}
            pagination={tableParams.pagination}
            onChange={(pagination: TablePaginationConfig) => {
              setTableParams((params) => {
                params.pagination = { ...pagination };
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
