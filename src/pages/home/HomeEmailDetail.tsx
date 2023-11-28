import { Empty } from "antd";
import EmailDetail from "../../components/email-detail/EmailDetail";
import { useEmailContext } from "./HomeProvider";
export default function HomeEmailDetail() {
  const email = useEmailContext();
  return (
    <>
      {!!email ? (
        <EmailDetail {...email} />
      ) : (
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Empty />
        </div>
      )}
    </>
  );
}
