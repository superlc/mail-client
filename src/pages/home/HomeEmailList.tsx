import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getEmails } from "../../app/apis";
import { useAppSelector } from "../../app/hooks";
import { message } from "antd";
import { EmailType } from "../../types";
import { useEmailDispatch } from "./HomeProvider";
import InfiniteLoaderWrapper from "./InfiniteLoaderWrapper";
import { connect } from "react-redux";
import { RootState, store } from "../../app/store";

const pageSize = 10;

function HomeEmailList() {
  const pageNumber = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  const userInfo = useAppSelector((state) => state.user.data);
  const [emails, setEmails] = useState<EmailType[] | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  const dispatchEmailDetail = useEmailDispatch();

  const [loadingMore, setLoadingMore] = useState(false);
  const { operationType, operationValue } = store.getState().email;

  console.log("=====================", operationType, operationValue);

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

  useLayoutEffect(() => {
    if (containerRef.current) {
      const boundingRect = containerRef.current.getBoundingClientRect();
      setContainerHeight(boundingRect.height);
    }
  }, []);

  return (
    <>
      <div className="home-email-list">
        <div className="home-email-list-body" ref={containerRef}>
          {!!emails && (
            <InfiniteLoaderWrapper
              height={containerHeight}
              hasNextPage={emails.length < totalCount}
              isNextPageLoading={loadingMore}
              items={emails}
              loadNextPage={(start: number, end: number) => {
                console.log("--------- end:", end);
                console.log("--------- vlaue:", operationValue);
                if (!!operationValue) {
                  setLoadingMore(true);
                  getEmails({
                    operation: operationType,
                    value: operationValue ?? "",
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
                }
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default connect((state: RootState) => state)(HomeEmailList);
