import { useEmailContext } from "../../pages/home/HomeProvider";
import { EmailType } from "../../types";
import { EmailItem } from "./EmailItem";

export default function EmailList({ list }: { list: EmailType[] }) {
  const email = useEmailContext();
  const current = !email ? 0 : list.findIndex((item) => item.id === email.id);

  return (
    <div className="email-list">
      {list.map((item, index) => (
        <EmailItem key={index} {...item} active={current === index} />
      ))}
    </div>
  );
}
