import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Empty, message } from "antd";
import { connect } from "react-redux";

import { getEmails } from "../../app/apis";
import { useAppSelector } from "../../app/hooks";

import { EmailType } from "../../types";
import { useEmailDispatch } from "./HomeProvider";
import InfiniteLoaderWrapper from "./InfiniteLoaderWrapper";
import { RootState } from "../../app/store";

const pageSize = 20;

function HomeEmailList() {
  const pageNumber = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  const [emails, setEmails] = useState<EmailType[] | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  const dispatchEmailDetail = useEmailDispatch();

  const [firstLoading, setFirstLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const { operationType, operationValue } = useAppSelector(
    (state) => state.email
  );

  useEffect(() => {
    if (!!operationValue) {
      setFirstLoading(true);
      getEmails({
        operation: operationType,
        value: operationValue,
        limit: pageSize,
        offset: 0,
      })
        .then((res) => {
          setEmails(res.emails);
          setTotalCount(res.total_count);

          // show the first email by default
          if (res.emails.length > 0) {
            dispatchEmailDetail!({ type: "set", payload: res.emails[0] });
          } else {
            dispatchEmailDetail!({ type: "reset" });
          }
        })
        .catch((err) => {
          message.error(err);
        })
        .finally(() => setFirstLoading(false));
    }

    return () => {
      pageNumber.current = 0;
    };
  }, [operationType, operationValue]);

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
          {(emails || [])?.length > 0 ? (
            <InfiniteLoaderWrapper
              height={containerHeight}
              hasNextPage={(emails || []).length < totalCount}
              isNextPageLoading={loadingMore}
              items={emails || []}
              loadNextPage={(start: number, end: number) => {
                if (!!operationValue) {
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
                }
              }}
            />
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
        </div>
      </div>
    </>
  );
}

export default connect((state: RootState) => state)(HomeEmailList);
