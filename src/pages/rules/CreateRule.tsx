import { Form, Input, Radio } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import UsersSelect from "../../components/users-select/UsersSelect";
import DomainsSelect from "../../components/domains-select/DomainsSelect";
import { SecureLevelType } from "../../types";
import { useAppSelector } from "../../app/hooks";
import SenderSelect from "../../components/sender-select/SenderSelect";

export default forwardRef(function CreateRule(props, ref) {
  const userInfo = useAppSelector((state) => state.user.data);

  const [operationType, setOperationType] = useState<
    "text" | "domain" | "sender" | undefined
  >(undefined);
  const [secureLevel, setSecureLevel] = useState<SecureLevelType | undefined>(
    undefined
  );
  const [users, setUsers] = useState<string[]>(
    userInfo?.admin ? [] : [userInfo?.email!]
  );

  const [textValue, setTextValue] = useState<string | undefined>(undefined);
  const [domainValue, setDomainValue] = useState<string | undefined>(undefined);
  const [senderValue, setSenderValue] = useState<string | undefined>(undefined);

  useImperativeHandle(ref, () => {
    return {
      getCreateParams: () => {
        return {
          operation: operationType,
          secure_level: secureLevel,
          users: users,
          value:
            operationType === "text"
              ? textValue
              : operationType === "domain"
              ? domainValue
              : senderValue,
        };
      },
    };
  });

  return (
    <div className="create-rule">
      <Form layout="horizontal" labelCol={{ span: 6 }}>
        {operationType !== "sender" && userInfo?.admin && (
          <Form.Item label="Users" name="users">
            <UsersSelect
              mode="multiple"
              onChange={(e) => {
                setUsers(e);
              }}
            />
          </Form.Item>
        )}
        <Form.Item label="Operation Type" name="operationType">
          <Radio.Group
            value={operationType}
            onChange={(e) => {
              const operationType = e.target.value;
              setOperationType(operationType);
            }}
          >
            <Radio.Button value="text">text</Radio.Button>
            <Radio.Button value="domain">domain</Radio.Button>
            <Radio.Button value="sender">sender</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Secure Level" name="secureLevel">
          <Radio.Group
            value={secureLevel}
            onChange={(e) => {
              setSecureLevel(e.target.value);
            }}
          >
            <Radio.Button value="delete">delete</Radio.Button>
            <Radio.Button value="trash">trash</Radio.Button>
          </Radio.Group>
        </Form.Item>
        {operationType === "sender" && (
          <Form.Item key="sender" label="Sender" name="sender">
            <SenderSelect
              onChange={(val) => {
                setSenderValue(val);
                // 按 sender 时，用户只有 sender 一个
                setUsers([val]);
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
  );
});
