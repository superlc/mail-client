import { Button, Input, Select } from "antd";
import { useState } from "react";
import DomainsSelect from "../../components/domains-select/DomainsSelect";
import { SearchOutlined } from "@ant-design/icons";
import SenderSelect from "../../components/sender-select/SenderSelect";

const options = [
  {
    value: "sender",
    label: "Query by one sender",
  },
  {
    value: "text",
    label: "Query by text",
  },
  {
    value: "domain",
    label: "Query by domain",
  },
  {
    value: "secure_level",
    label: "Query by secure level",
  },
] as const;

export type QueryType = (typeof options)[number]["value"];

export default function RuleFilter(props: {
  onClick: (
    queryType: QueryType | undefined,
    queryValue: string | undefined
  ) => void;
  onClear: () => void;
}) {
  const { onClick, onClear } = props;
  const [queryType, setQueryType] = useState<QueryType | undefined>(undefined);
  const [queryValue, setQueryValue] = useState<string | undefined>(undefined);

  return (
    <>
      <Select
        options={options as any}
        placeholder="Please select a query type"
        onChange={(val) => {
          setQueryType(val);
          setQueryValue(undefined);

          if (!val && typeof onClear === "function") {
            onClear();
          }
        }}
        style={{
          width: 320,
          marginRight: 20,
        }}
        allowClear
      />
      {queryType === "sender" && (
        <SenderSelect
          key="sender"
          onChange={(val) => {
            setQueryValue(val);
            if (typeof onClick === "function") {
              onClick(queryType, val);
            }
          }}
          style={{
            width: 320,
          }}
        />
      )}
      {queryType === "domain" && (
        <DomainsSelect
          key="domain"
          onChange={(val) => {
            setQueryValue(val);
            if (typeof onClick === "function") {
              onClick(queryType, val);
            }
          }}
          style={{
            width: 320,
          }}
        />
      )}
      {queryType === "secure_level" && (
        <Select
          options={[
            {
              value: "delete",
              label: "DELETE",
            },
            {
              value: "trash",
              label: "TRASH",
            },
          ]}
          onChange={(val) => {
            setQueryValue(val);
            if (typeof onClick === "function") {
              onClick(queryType, val);
            }
          }}
          style={{
            width: 320,
          }}
        />
      )}
      {queryType === "text" && (
        <Input.Search
          placeholder="Please input rule text"
          // onChange={(e) => {
          //   setQueryValue(e.target.value);
          // }}
          style={{
            width: 320,
          }}
          onSearch={(val) => {
            setQueryValue(val);

            if (typeof onClick === "function") {
              onClick(queryType, val);
            }
          }}
          allowClear
        />
      )}
      {/* {queryType && (
        <Button
          icon={<SearchOutlined />}
          style={{ marginLeft: 20 }}
          onClick={() => {
            if (typeof onClick === "function") {
              onClick(queryType, queryValue);
            }
          }}
        >
          Query rules
        </Button>
      )} */}
    </>
  );
}
