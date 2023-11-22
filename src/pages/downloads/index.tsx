import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Table,
  TablePaginationConfig,
  Tag,
  message,
} from "antd";
import PageHeader from "../../components/header/Header";
import { useImmer } from "use-immer";
import { useEffect, useRef, useState } from "react";
import { DownloadStatusType, DownloadType, OperationType } from "../../types";
import { getDownloads } from "../../app/apis";
import { ColumnsType } from "antd/es/table";

import "./index.scss";
import UsersSelect from "../../components/users-select/UsersSelect";
import DomainsSelect from "../../components/domains-select/DomainsSelect";

const { RangePicker } = DatePicker;

interface TableParams {
  pagination?: TablePaginationConfig;
}

export default function Downloads() {
  const columns: ColumnsType<DownloadType> = [
    {
      title: "Email",
      dataIndex: "email",
      width: "20%",
    },
    {
      title: "File Name",
      dataIndex: "filename",
      width: "20%",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "20%",
      render: (status: DownloadStatusType) => {
        return (
          <>
            {status === "doing" ? (
              <Button loading>Downloading</Button>
            ) : status === "done" ? (
              <Button type="primary">Download</Button>
            ) : (
              <Tag color="#ff4d4f">{"Download error"}</Tag>
            )}
          </>
        );
      },
    },
  ];
  const [downloads, setDownloads] = useImmer<DownloadType[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useImmer<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  useEffect(() => {
    setLoading(true);
    getDownloads(
      tableParams.pagination?.current! - 1,
      tableParams.pagination?.pageSize!
    )
      .then((res) => {
        setDownloads(res.downloads || []);
        setTableParams((params) => {
          params.pagination!.total = res.total_count;
        });
      })
      .catch((err) => message.error(err))
      .finally(() => setLoading(false));
  }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showDialogFlag, setShowDialogFlag] = useState(false);

  const [operationType, setOperationType] = useState<
    OperationType | undefined
  >();
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [receiverValue, setReceiverValue] = useState<string | undefined>();
  const [textValue, setTextValue] = useState<string | undefined>();
  const [domainValue, setDomainValue] = useState<string | undefined>();

  const handleCancel = () => {
    setShowDialogFlag(false);
  };
  const handleOk = () => {
    console.log(startDate);
    console.log(endDate);
    console.log(receiverValue);
    console.log(domainValue);
    console.log(textValue);
  };

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
                  Create A New Downloading Task
                </Button>
              </div>
            </div>
            <Table
              columns={columns}
              loading={loading}
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
        title="New Downloading Task"
        open={showDialogFlag}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={720}
      >
        <div className="download-task">
          <Form layout="horizontal" labelCol={{ span: 6 }}>
            <Form.Item label="Pick date range" name="dateRange">
              <RangePicker
                onChange={(val) => {
                  console.log(val);
                }}
              />
            </Form.Item>
            <Form.Item label="Operation type" name="operationType">
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
                />
              </Form.Item>
            )}
            {operationType === "domain" && (
              <Form.Item key="domains" label="Domains" name="domains">
                <DomainsSelect
                  onChange={(d) => {
                    setDomainValue(d);
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
                />
              </Form.Item>
            )}
          </Form>
        </div>
      </Modal>
    </>
  );
}
