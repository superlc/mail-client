import PageHeader from "../../components/header/Header";

export default function Users() {
  return (
    <div className="users">
      <div className="users-header">
        <PageHeader current="users" />
      </div>
      <div className="users-body">users body</div>
    </div>
  );
}
