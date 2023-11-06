import { VList, VListProps } from "virtua";
import { useEmailContext } from "../../pages/home/HomeProvider";
import { EmailType } from "../../types";
import { EmailItem } from "./EmailItem";
import { LoadingOutlined } from "@ant-design/icons";
import classNames from "classnames";

export default function EmailList({
  list = [],
  loading: loadingMore,
  className,
  ...restProps
}: {
  list: EmailType[];
  loading?: boolean;
  className?: string;
} & Omit<VListProps, "children">) {
  const email = useEmailContext();
  const current = !email ? 0 : list.findIndex((item) => item.id === email.id);

  return (
    <VList className={classNames("email-list", className)} {...restProps}>
      {list.map((item, index) => (
        <EmailItem key={index} {...item} active={current === index} />
      ))}
      {loadingMore && (
        <div className="email-list-loading-more">
          <LoadingOutlined />
        </div>
      )}
    </VList>
  );
}
