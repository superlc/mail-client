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
  const pageNumber = useRef(0);
  const pageSize = useRef(10);

  const userInfo = useAppSelector((state) => state.user.data);
  const [emails, setEmails] = useState<EmailType[] | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const dispatchEmailDetail = useEmailDispatch();

  const [loading, setLoading] = useState(false);

  const [operationType, setOperationType] = useState<OperationType>("receiver");
  const [operationValue, setOperationValue] = useState<string>(
    userInfo?.email ?? ""
  );

  const fetchEmails = () => {
    console.log("--------- fetch more emails ----------");
    getEmails({
      operation: operationType,
      value: operationValue,
      limit: pageSize.current,
      offset: pageNumber.current + 1,
    }).then((res) => {
      setEmails((currentEmails) => [
        ...(currentEmails || []),
        ...(res.emails || []),
      ]);
      if (res.emails.length > 0) {
        pageNumber.current += 1;
      }
    });
  };

  const onSearch = (val: string) => {
    if (loading) {
      return;
    }
    setLoading(true);
    pageNumber.current = 0;

    getEmails({
      operation: operationType,
      value: val,
      limit: pageSize.current,
      offset: pageNumber.current,
    })
      .then((res) => {
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
      limit: pageSize.current,
      offset: pageNumber.current,
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

    return () => {
      pageNumber.current = 0;
    };
  }, []);

  return (
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
        <div
          id="scrollContainer"
          className="home-email-list-wrapper"
          style={{ height: 300, overflow: "auto" }}
        >
          <InfiniteScroll
            dataLength={emails?.length ?? 0}
            next={fetchEmails}
            loader={
              <div className="email-list-loading-more">
                <LoadingOutlined />
              </div>
            }
            scrollableTarget="scrollContainer"
            hasMore={(emails ?? [])?.length < totalCount}
          >
            <EmailList list={emails || []} />
          </InfiniteScroll>
        </div>
      </div>
    </>
  );
}
