import {
  SelectProps,
  message,
  AutoComplete,
  Input,
  InputProps,
  Select,
  Checkbox,
} from "antd";
import { useEffect, useState } from "react";
import { UserType } from "../../types";
import { getUsers } from "../../app/apis";

export default function UsersSelect(
  props: Omit<SelectProps, "options"> & Pick<InputProps, "onInput">
) {
  const [users, setUsers] = useState<UserType[]>([]);

  const { onInput, ...restProps } = props;

  useEffect(() => {
    getUsers(-1, -1)
      .then((res) => setUsers(res.users || []))
      .catch((err) => message.error(err));
  }, []);

  return (
    <Select
      {...restProps}
      options={users.map((u) => {
        return {
          value: u.email,
          label: u.email,
        };
      })}
      filterOption={(inputValue, option) =>
        (option!.value as string)
          .toLowerCase()
          .indexOf(inputValue.toLowerCase()) !== -1
      }
      // optionRender={(option, info) => {
      //   console.log("---------", option, info);
      //   return (
      //     <div key={info.index}>
      //       <Checkbox>{option.label}</Checkbox>
      //     </div>
      //   );
      // }}
      allowClear
    >
      {/* <Input onInput={onInput} allowClear /> */}
    </Select>
  );
}
