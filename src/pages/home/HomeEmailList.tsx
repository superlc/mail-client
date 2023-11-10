import EmailList from "../../components/email-list/EmailList";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getEmails } from "../../app/apis";
import { useAppSelector } from "../../app/hooks";
import { Input, message, Select } from "antd";
import { EmailType, OperationType } from "../../types";
import { useEmailDispatch } from "./HomeProvider";
import { debounce } from "lodash";
import InfiniteLoader from "react-window-infinite-loader";
import InfiniteLoaderWrapper from "./InfiniteLoaderWrapper";

const pageSize = 10;

export default function HomeEmailList() {
  const pageNumber = useRef(0);

  const userInfo = useAppSelector((state) => state.user.data);
  const [emails, setEmails] = useState<EmailType[] | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const dispatchEmailDetail = useEmailDispatch();

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [operationType, setOperationType] = useState<OperationType>("receiver");
  const [operationValue, setOperationValue] = useState<string>(
    userInfo?.email ?? ""
  );

  const onSearch = (val: string) => {
    if (loading) {
      return;
    }
    setLoading(true);
    pageNumber.current = 0;

    getEmails({
      operation: operationType,
      value: val,
      limit: pageSize,
      offset: 0,
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
    if (userInfo) {
      getEmails({
        operation: "receiver",
        value: userInfo?.email || "",
        limit: pageSize,
        offset: 0,
      })
        .then((res) => {
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
    }

    return () => {
      pageNumber.current = 0;
    };
  }, [userInfo]);

  console.log("has next page:", (emails?.length ?? 0) < totalCount);

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
        <div className="home-email-list-body">
          {!!emails && (
            <InfiniteLoaderWrapper
              hasNextPage={emails.length < totalCount}
              isNextPageLoading={loadingMore}
              items={emails}
              loadNextPage={(start: number, end: number) => {
                console.log("start and end: ", start, " ", end);
                setLoadingMore(true);
                getEmails({
                  operation: operationType,
                  value: operationValue,
                  offset: Math.ceil(end / pageSize),
                  limit: pageSize,
                })
                  .then((res) => {
                    pageNumber.current = Math.ceil(end / pageSize);
                    setEmails((preEmails) => [
                      ...(preEmails ?? []),
                      ...(res.emails ?? []),
                    ]);
                  })
                  .catch((err) => {
                    message.error(err);
                  })
                  .finally(() => setLoadingMore(false));
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
