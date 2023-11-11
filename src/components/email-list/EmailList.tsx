import { VList as WVList, VListProps as WVListProps } from "virtua";
import { useEmailContext } from "../../pages/home/HomeProvider";
import { EmailType } from "../../types";
import { EmailItem } from "./EmailItem";
import { LoadingOutlined } from "@ant-design/icons";
import classNames from "classnames";
import { FixedSizeList } from "react-window";
import { forwardRef } from "react";

export default forwardRef(function EmailList(
  {
    list = [],
    loading: loadingMore,
    className,
    totalCount,
    ...restProps
  }: {
    list: EmailType[];
    totalCount: number;
    loading?: boolean;
    className?: string;
    onItemsRenderd?: any;
  },
  ref: any
) {
  const email = useEmailContext();
  const current = !email ? 0 : list.findIndex((item) => item.id === email.id);

  return (
    <FixedSizeList
      ref={ref}
      itemCount={list.length}
      itemSize={68}
      height={800}
      width={"100%"}
      className={classNames("email-list", className)}
      {...restProps}
    >
      {({ index, style }) =>
        index < totalCount ? (
          <EmailItem {...list[index]} style={style} />
        ) : (
          <div className="email-list-loading-more">
            <LoadingOutlined />
          </div>
        )
      }
      {/* {loadingMore && (
        <div className="email-list-loading-more">
          <LoadingOutlined />
        </div>
      )} */}
    </FixedSizeList>
  );
});
