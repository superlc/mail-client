import { SelectProps, message, AutoComplete, Input, InputProps } from "antd";
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
    <AutoComplete
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
    >
      <Input onInput={onInput} allowClear />
    </AutoComplete>
  );
}
