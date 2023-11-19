import { Select, SelectProps, message } from "antd";
import { useEffect, useState } from "react";
import { UserType } from "../../types";
import { getUsers } from "../../app/apis";

export default function UsersSelect(props: Omit<SelectProps, "options">) {
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    getUsers(-1, -1)
      .then((res) => setUsers(res.users || []))
      .catch((err) => message.error(err));
  }, []);

  return (
    <Select
      {...props}
      options={users.map((u) => {
        return {
          value: u.email,
          label: u.email,
        };
      })}
    />
  );
}
