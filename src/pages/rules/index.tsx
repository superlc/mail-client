import { Button, Modal, Popconfirm, Select, Table, Tag, message } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import PageHeader from "../../components/header/Header";
import {
  GetRulesParams,
  OperationType,
  RuleType,
  SecureLevelType,
} from "../../types";

import "./index.scss";
import { useEffect, useRef, useState } from "react";
import { createRule, deleteRule, getRules } from "../../app/apis";
import { DeleteOutlined } from "@ant-design/icons";
import { useImmer } from "use-immer";
import CreateRule from "./CreateRule";
import RuleFilter from "./RuleFilter";

interface TableParams {
  pagination?: TablePaginationConfig;
}

const OperationTag = ({
  operationType,
}: {
  operationType: "text" | "domain" | "sender";
}) => {
  const text = operationType.toUpperCase();
  if (operationType === "text") return <Tag color="#2db7f5">{text}</Tag>;
  if (operationType === "domain") return <Tag color="#87d068">{text}</Tag>;
  return <Tag color="#108ee9">{text}</Tag>;
};

export default function Rules() {
  const columns: ColumnsType<RuleType> = [
    {
      title: "Email",
      dataIndex: "email",
      width: "20%",
    },
    {
      title: "Operation",
      dataIndex: "operation",
      width: "20%",
      render: (operationType: "text" | "domain" | "sender") => {
        return <OperationTag operationType={operationType} />;
      },
    },
    {
      title: "Value",
      dataIndex: "value",
      width: "20%",
    },
    {
      title: "Secure Level",
      dataIndex: "secure_level",
      width: "20%",
      render: (secureLevel: SecureLevelType) => {
        return secureLevel === "delete" ? (
          <Tag color="#ff4d4f">DELETE</Tag>
        ) : (
          <Tag color="#faad14">TRASH</Tag>
        );
      },
    },
    {
      title: "Actions",
      width: "20%",
      render: (_, record) => (
        <Popconfirm
          title="Delete the rule"
          description="Are you sure to delete this rule?"
          onConfirm={() => {
            deleteRule(record.id)
              .then(() => {
                message.success("Delete successfully");
                fetchRules();
              })
              .catch((err) => message.error(err));
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button icon={<DeleteOutlined />}>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  const [rules, setRules] = useImmer<RuleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useImmer<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [showDialogFlag, setShowDialogFlag] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const formRef = useRef();

  const fetchRules = (fetchParams?: {
    offset?: number;
    operation?: OperationType;
    email?: string;
    value?: string;
    secure_level?: SecureLevelType;
  }) => {
    setLoading(true);
    getRules({
      offset:
        typeof fetchParams?.offset === "undefined"
          ? tableParams.pagination?.current! - 1
          : fetchParams?.offset,
      limit: tableParams.pagination?.pageSize!,
      ...fetchParams,
    })
      .then((res) => {
        setRules(res.rules || []);
        setTableParams((params) => {
          params.pagination!.total = res.total_count;
        });
      })
      .catch((err) => message.error(err))
      .finally(() => setLoading(false));
  };

  const handleOk = () => {
    // setShowDialogFlag(false);
    // @ts-ignore
    // console.log(formRef.current.getCreateParams());
    setConfirmLoading(true);
    // @ts-ignore
    createRule(formRef.current.getCreateParams())
      .then((res) => {
        fetchRules();
        setShowDialogFlag(false);
      })
      .catch((err) => message.error(err))
      .finally(() => setConfirmLoading(false));
  };
  const handleCancel = () => {
    setShowDialogFlag(false);
  };

  useEffect(() => {
    fetchRules();
  }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

  return (
    <>
      <div className="rules">
        <div className="rules-header">
          <PageHeader current="rules" />
        </div>
        <div className="rules-body">
          <div className="rules-main">
            <div className="rules-main-header">
              <div className="rules-main-header-filters">
                <RuleFilter
                  onClick={(queryType, queryValue) => {
                    const fetchParams: Omit<GetRulesParams, "limit"> = {
                      offset: 0,
                    };
                    if (queryType === "secure_level") {
                      if (!queryValue) {
                        return message.info("Please select secure level");
                      }
                      fetchParams.secure_level = queryValue as SecureLevelType;
                    } else {
                      fetchParams.operation = queryType as OperationType;
                      fetchParams.value = queryValue;
                    }
                    fetchRules(fetchParams);
                  }}
                  onClear={() => {
                    fetchRules();
                  }}
                />
              </div>
              <div className="rules-main-header-actions">
                <Button
                  type="primary"
                  onClick={() => {
                    setShowDialogFlag(true);
                  }}
                >
                  New Rule
                </Button>
              </div>
            </div>

            <Table
              columns={columns}
              loading={loading}
              dataSource={rules}
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
      <Modal
        title="New Rule"
        open={showDialogFlag}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={780}
      >
        <CreateRule ref={formRef} />
      </Modal>
    </>
  );
}
