import { SelectProps, message, AutoComplete, Input, InputProps } from "antd";
import { useEffect, useState } from "react";
import { getSenders } from "../../app/apis";

export default function SenderSelect(
  props: Omit<SelectProps, "options"> & Pick<InputProps, "onInput">
) {
  const [senders, setSenders] = useState<string[]>([]);

  const { onInput, ...restProps } = props;

  useEffect(() => {
    getSenders()
      .then((res) => setSenders(res.senders || []))
      .catch((err) => message.error(err));
  }, []);

  return (
    <AutoComplete
      {...restProps}
      options={senders.map((u) => {
        return {
          value: u,
          label: u,
        };
      })}
      filterOption={(inputValue, option) =>
        (option!.value as string)
          .toLowerCase()
          .indexOf(inputValue.toLowerCase()) !== -1
      }
      placeholder="Please select the sender"
    >
      <Input onInput={onInput} allowClear />
    </AutoComplete>
  );
}
