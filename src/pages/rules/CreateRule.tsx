import { Checkbox, Form, Input, Radio, Switch, Tooltip } from "antd";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import UsersSelect from "../../components/users-select/UsersSelect";
import DomainsSelect from "../../components/domains-select/DomainsSelect";
import { SecureLevelType } from "../../types";
import { useAppSelector } from "../../app/hooks";
import SenderSelect from "../../components/sender-select/SenderSelect";
import { QuestionCircleOutlined } from "@ant-design/icons";

export default forwardRef(function CreateRule(props, ref) {
  const userInfo = useAppSelector((state) => state.user.data);

  const [operationType, setOperationType] = useState<
    "text" | "domain" | "sender" | undefined
  >(undefined);
  const [secureLevel, setSecureLevel] = useState<SecureLevelType | undefined>(
    undefined
  );
  const [selectAllUsersFlag, setSelectAllUsersFlag] = useState(false);
  const [users, setUsers] = useState<string[]>(
    userInfo?.admin ? [] : [userInfo?.email!]
  );

  const [textValue, setTextValue] = useState<string | undefined>(undefined);
  const [domainValue, setDomainValue] = useState<string | undefined>(undefined);
  const [senderValue, setSenderValue] = useState<string | undefined>(undefined);

  const formRef = useRef(null);

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
      reset: () => {
        if (formRef.current) {
          // @ts-ignore
          formRef.current.resetFields();
        }
      },
    };
  });

  return (
    <div className="create-rule">
      <Form layout="horizontal" labelCol={{ span: 6 }} ref={formRef}>
        {userInfo?.admin && (
          <Form.Item label="Users" name="users">
            <>
              <UsersSelect
                mode="multiple"
                onChange={(e) => {
                  setUsers(e);
                }}
                style={{
                  width: 320,
                }}
                disabled={selectAllUsersFlag}
              />
              <Checkbox
                title="all users"
                defaultChecked={selectAllUsersFlag}
                onChange={(e) => {
                  const val = e.target.checked;
                  setSelectAllUsersFlag(val);
                  if (val) {
                    setUsers([]);
                  }
                }}
                className="checkbox-all-users"
                style={{
                  display: "block",
                  marginTop: 10,
                  width: 200,
                }}
              >
                select all
              </Checkbox>
            </>
          </Form.Item>
        )}
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
            <Radio.Button value="sender">sender</Radio.Button>
          </Radio.Group>
        </Form.Item>
        {operationType === "sender" && (
          <Form.Item key="sender" label="Sender" name="sender">
            <SenderSelect
              onChange={(val) => {
                setSenderValue(val);
                // 按 sender 时，用户只有 sender 一个
                // setUsers([val]);
              }}
              style={{
                width: 320,
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
                width: 320,
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
                width: 320,
              }}
            />
          </Form.Item>
        )}
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
      </Form>
    </div>
  );
});
