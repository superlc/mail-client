import InfiniteScroll from "react-infinite-scroll-component";
import EmailList from "../../components/email-list/EmailList";
import { FilterOutlined, LoadingOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { getEmails } from "../../app/apis";
import { useAppSelector } from "../../app/hooks";
import { Input, message, Select } from "antd";
import { EmailType, OperationType } from "../../types";
import { useEmailDispatch } from "./HomeProvider";

export default function HomeEmailList() {
  const pageNumber = useRef(1);
  const pageSize = useRef(20);

  const userInfo = useAppSelector((state) => state.user.data);
  const [emails, setEmails] = useState<EmailType[] | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const dispatchEmailDetail = useEmailDispatch();

  const [loading, setLoading] = useState(false);
  const [operationType, setOperationType] = useState<OperationType>("receiver");

  const onSearch = (val: string) => {
    if (loading) {
      return;
    }
    setLoading(true);

    getEmails({
      operation: operationType,
      value: val,
      pageSize: pageSize.current,
      pageNumber: 1,
    })
      .then((res) => {
        pageNumber.current = 1;
        setEmails(res.emails);
        setTotalCount(res.total_count);

        if (res.emails.length > 0) {
          dispatchEmailDetail!({ type: "set", payload: res.emails[0] });
        }
      })
      .catch((err) => {
        message.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getEmails({
      operation: "receiver",
      value: userInfo?.email || "",
      pageSize: pageSize.current,
      pageNumber: pageNumber.current,
    })
      .then((res) => {
        // add the page number after searching page data
        pageNumber.current += 1;
        setEmails(res.emails);
        setTotalCount(res.total_count);

        // show the first email by default
        if (res.emails.length > 0) {
          dispatchEmailDetail!({ type: "set", payload: res.emails[0] });
        }
      })
      .catch((err) => {
        message.error(err);
      });
  }, []);

  return (
    // <InfiniteScroll
    //   dataLength={0}
    //   next={fetchMore}
    //   loader={
    //     <div className="emails-list-loading-more">
    //       <LoadingOutlined /> Loading...
    //     </div>
    //   }
    // >
    //   <EmailList list={[]} />
    // </InfiniteScroll>
    <>
      <div className="home-email-list">
        <div className="home-email-list-header">
          <Select
            value={operationType}
            onChange={(val) => setOperationType(val as OperationType)}
            options={[
              {
                value: "text",
                label: "text",
              },
              {
                value: "domain",
                label: "domain",
              },
              {
                value: "receiver",
                label: "receiver",
              },
            ]}
          />
          <Input.Search
            placeholder="input search text"
            onSearch={onSearch}
            loading={loading}
            enterButton
          />
        </div>
        {loading && (
          <div className="home-email-list-loading">
            <LoadingOutlined color="#fff" />
          </div>
        )}
        <EmailList list={emails || []} />
      </div>
    </>
  );
}
