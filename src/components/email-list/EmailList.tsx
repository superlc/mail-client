import { EmailType } from "../../types";
import { EmailItem } from "./EmailItem";

export default function EmailList({ list }: { list: EmailType[] }) {
  return (
    <div className="email-list">
      {list.map((item, index) => (
        <EmailItem key={index} {...item} />
      ))}
    </div>
  );
}
