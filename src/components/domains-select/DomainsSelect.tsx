import { Select, SelectProps, message } from "antd";
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
    <Select
      {...props}
      options={domains.map((d) => {
        return {
          value: d,
          label: d,
        };
      })}
    />
  );
}
