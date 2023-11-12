import { Table, TableColumnType } from "antd";
import PageHeader from "../../components/header/Header";
import { UserType } from "../../types";

export default function Users() {
  // const columns: TableColumnType<UserType> = [
  //   {
  //     title: "User name",
  //     dataIndex: "userName",
  //     width: "20%",
  //   },
  // ];

  return (
    <div className="users">
      <div className="users-header">
        <PageHeader current="users" />
      </div>
      <div className="users-body">
        <Table />
      </div>
    </div>
  );
}
