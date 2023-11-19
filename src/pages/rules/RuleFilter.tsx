import { Button, Input, Select } from "antd";
import { forwardRef, useState } from "react";
import UsersSelect from "../../components/users-select/UsersSelect";
import DomainsSelect from "../../components/domains-select/DomainsSelect";
import { SearchOutlined } from "@ant-design/icons";

const options = [
  {
    value: "receiver",
    label: "Query by one receiver",
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

export default forwardRef(function RuleFilter(
  props: {
    onClick: (
      queryType: QueryType | undefined,
      queryValue: string | undefined
    ) => void;
  },
  ref
) {
  const { onClick } = props;
  const [queryType, setQueryType] = useState<QueryType | undefined>(undefined);
  const [queryValue, setQueryValue] = useState<string | undefined>(undefined);

  return (
    <>
      <Select
        options={options as any}
        placeholder="Please select a query type"
        onChange={(val) => {
          setQueryType(val);
        }}
        style={{
          width: 200,
          marginRight: 20,
        }}
      />
      {queryType === "receiver" && (
        <UsersSelect
          key="receiver"
          onChange={(val) => {
            setQueryValue(val);
          }}
          style={{
            width: 200,
          }}
        />
      )}
      {queryType === "domain" && (
        <DomainsSelect
          key="domain"
          onChange={(val) => {
            setQueryValue(val);
          }}
          style={{
            width: 200,
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
          }}
          style={{
            width: 200,
          }}
        />
      )}
      {queryType === "text" && (
        <Input
          placeholder="Please input rule text"
          onChange={(e) => {
            setQueryValue(e.target.value);
          }}
          style={{
            width: 200,
          }}
        />
      )}
      {queryType && (
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
      )}
    </>
  );
});
