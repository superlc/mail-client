import { SelectProps, message, AutoComplete, Input } from "antd";
import { useEffect, useState } from "react";
import { getDomains } from "../../app/apis";

export default function DomainsSelect(props: Omit<SelectProps, "options">) {
  const [domains, setDomains] = useState<string[]>([]);

  useEffect(() => {
    getDomains()
      .then((res) => {
        setDomains(res.domains || []);
      })
      .catch((err) => message.error(err));
  }, []);

  return (
    <AutoComplete
      {...props}
      options={domains.map((d) => {
        return {
          value: d,
          label: d,
        };
      })}
      filterOption={(inputValue, option) =>
        (option!.value as string)
          .toLowerCase()
          .indexOf(inputValue.toLowerCase()) !== -1
      }
    >
      <Input allowClear />
    </AutoComplete>
  );
}
