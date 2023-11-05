import EmailDetail from "../../components/email-detail/EmailDetail";
import { useEmailContext } from "./HomeProvider";
export default function HomeEmailDetail() {
  const email = useEmailContext();
  return <>{email && <EmailDetail {...email} />}</>;
}
