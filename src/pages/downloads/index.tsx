import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Table,
  TablePaginationConfig,
  Tag,
  message,
} from "antd";
import PageHeader from "../../components/header/Header";
import { useImmer } from "use-immer";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { DownloadStatusType, DownloadType, OperationType } from "../../types";
import {
  createDownloadTask,
  downloadEmailsFile,
  getDownloads,
} from "../../app/apis";
import { ColumnsType } from "antd/es/table";

import "./index.scss";
import UsersSelect from "../../components/users-select/UsersSelect";
import DomainsSelect from "../../components/domains-select/DomainsSelect";
import dayjs, { Dayjs } from "dayjs";
import { DownloadOutlined, LoadingOutlined } from "@ant-design/icons";
import { random } from "lodash";

const { RangePicker } = DatePicker;

interface TableParams {
  pagination?: TablePaginationConfig;
}

const OperationTag = ({ operationType }: { operationType: OperationType }) => {
  const text = operationType.toUpperCase();
  if (operationType === "text") return <Tag color="#2db7f5">{text}</Tag>;
  if (operationType === "domain") return <Tag color="#87d068">{text}</Tag>;
  return <Tag color="#108ee9">{text}</Tag>;
};

export default function Downloads() {
  const columns: ColumnsType<DownloadType> = [
    {
      title: "Email",
      dataIndex: "email",
      width: "20%",
    },
    {
      title: "Date range",
      dataIndex: "dateRange",
      width: "20%",
      render: (_, record) => {
        const { start_date, end_date } = record;
        return (
          <>
            <div className="downloads-date-range">
              <span>From: </span>
              {`${start_date}`}
            </div>
            <div className="downloads-date-range">
              <span>To: </span>
              {`${end_date}`}
            </div>
          </>
        );
      },
    },
    {
      title: "Operation",
      dataIndex: "operation",
      width: "10%",
      render: (operation: OperationType) => {
        return <OperationTag operationType={operation} />;
      },
    },
    {
      title: "Value",
      dataIndex: "value",
      width: "20%",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "10%",
      render: (status: DownloadStatusType, record) => {
        return (
          <Tag
            icon={status === "doing" && <LoadingOutlined />}
            color={
              status === "error"
                ? "#ff4d4f"
                : status === "done"
                ? "#0CBF5B"
                : "#FF7800"
            }
          >
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => {
        return (
          <>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => {
                const { id } = record;
                downloadEmailsFile(id);
              }}
              disabled={record.status !== "done"}
            >
              Download
            </Button>
          </>
        );
      },
    },
  ];
  const [downloads, setDownloads] = useImmer<DownloadType[]>([]);
  // const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useImmer<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const fetchDownloads = (offset?: number, count?: number) => {
    // setLoading(true);
    getDownloads(
      typeof offset === "undefined"
        ? tableParams.pagination?.current! - 1
        : offset,
      typeof count === "undefined" ? tableParams.pagination?.pageSize! : count
    )
      .then((res) => {
        setDownloads(res.downloads || []);
        setTableParams((params) => {
          params.pagination!.total = res.total_count;
        });
      })
      .catch((err) => message.error(err));
  };

  useEffect(() => {
    fetchDownloads();
  }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showDialogFlag, setShowDialogFlag] = useState(false);

  const [operationType, setOperationType] = useState<
    OperationType | undefined
  >();

  const [receiverValue, setReceiverValue] = useState<string | undefined>();
  const [textValue, setTextValue] = useState<string | undefined>();
  const [domainValue, setDomainValue] = useState<string | undefined>();

  // 获取当前时间
  const today = dayjs();

  const [startDate, setStartDate] = useState<Dayjs>(today.subtract(30, "d"));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());

  const formRef = useRef(null);

  const resetForm = useCallback(() => {
    // @ts-ignore
    formRef.current.resetFields();
    // reset date range
    setStartDate(dayjs().subtract(30, "d"));
    setStartDate(dayjs());
  }, []);

  const handleCancel = () => {
    setShowDialogFlag(false);
    resetForm();
  };

  const handleOk = () => {
    const sDate = startDate.format("YYYY-MM-DD");
    const eDate = endDate.format("YYYY-MM-DD");
    const operationValue =
      operationType === "text"
        ? textValue
        : operationType === "domain"
        ? domainValue
        : receiverValue;

    if (!operationType || !operationValue) {
      return message.warning(
        "Please be sure the operation and value are not empty"
      );
    }

    setConfirmLoading(true);
    createDownloadTask({
      start_date: sDate,
      end_date: eDate,
      operation: operationType,
      value: operationValue,
    })
      .then(() => {
        setShowDialogFlag(false);
        // update the download tasks table
        fetchDownloads(0, 10);
      })
      .catch((err) => message.error(err))
      .finally(() => setConfirmLoading(false));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      fetchDownloads();
    }, 5 * 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="downloads">
        <div className="downloads-header">
          <PageHeader current="downloads" />
        </div>
        <div className="downloads-body">
          <div className="downloads-main">
            <div className="downloads-main-header">
              <div className="downloads-main-header-filters"></div>
              <div className="downloads-main-header-actions">
                <Button
                  type="primary"
                  onClick={() => {
                    setShowDialogFlag(true);
                  }}
                >
                  New Task
                </Button>
              </div>
            </div>
            <Table
              columns={columns}
              // loading={loading}
              dataSource={downloads}
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
        title="New Task"
        open={showDialogFlag}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={582}
      >
        <div className="download-task">
          <Form layout="horizontal" labelCol={{ span: 6 }} ref={formRef}>
            <Form.Item label="Pick date range" name="dateRange">
              <RangePicker
                defaultValue={[startDate, endDate]}
                disabledDate={(date) => {
                  return date > dayjs();
                }}
                onChange={(val) => {
                  // @ts-ignore
                  const [sDate, eDate] = val;
                  // console.log((sDate as dayjs.Dayjs).format("YYYY-MM-DD"));
                  // console.log((eDate as dayjs.Dayjs).format("YYYY-MM-DD"));
                  setStartDate(sDate);
                  setEndDate(eDate);
                }}
                allowClear={false}
                style={{
                  width: 400,
                }}
              />
            </Form.Item>
            <Form.Item label="Operation" name="operationType">
              <Radio.Group
                value={operationType}
                onChange={(e) => {
                  const operationType = e.target.value;
                  setOperationType(operationType);
                }}
              >
                <Radio.Button value="text">text</Radio.Button>
                <Radio.Button value="domain">domain</Radio.Button>
                <Radio.Button value="receiver">receiver</Radio.Button>
              </Radio.Group>
            </Form.Item>
            {operationType === "receiver" && (
              <Form.Item key="receiver" label="Receiver" name="receiver">
                <UsersSelect
                  onChange={(val) => {
                    setReceiverValue(val);
                  }}
                  style={{
                    width: 400,
                  }}
                />
              </Form.Item>
            )}
            {operationType === "domain" && (
              <Form.Item key="domains" label="Domains" name="domains">
                <DomainsSelect
                  onChange={(d) => {
                    setDomainValue(d);
                  }}
                  style={{
                    width: 400,
                  }}
                />
              </Form.Item>
            )}
            {operationType === "text" && (
              <Form.Item key="text" label="Value" name="text">
                <Input
                  placeholder="Please input text value"
                  value={textValue}
                  onChange={(e) => {
                    setTextValue(e.target.value);
                  }}
                  style={{
                    width: 400,
                  }}
                />
              </Form.Item>
            )}
          </Form>
        </div>
      </Modal>
    </>
  );
}
