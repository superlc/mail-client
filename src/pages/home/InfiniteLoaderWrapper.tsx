import React, { useLayoutEffect } from "react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { EmailType } from "../../types";
import { EmailItem } from "../../components/email-list/EmailItem";
import { LoadingOutlined } from "@ant-design/icons";

interface InfiniteLoaderWrapperProps<T> {
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  items: Array<T>;
  loadNextPage: (start: number, end: number) => void;
  height: number;
}

export default function InfiniteLoaderWrapper({
  // Are there more items to load?
  // (This information comes from the most recent API request.)
  hasNextPage,

  // Are we currently loading a page of items?
  // (This may be an in-flight flag in your Redux store for example.)
  isNextPageLoading,

  // Array of items loaded so far.
  items,

  // Callback function responsible for loading the next page of items.
  loadNextPage,

  // 容器高度
  height,
}: InfiniteLoaderWrapperProps<EmailType>) {
  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const itemCount = hasNextPage ? items.length + 1 : items.length;

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  // Every row is loaded except for our loading indicator row.
  const isItemLoaded = (index: number) => !hasNextPage || index < items.length;

  // Render an item or a loading indicator.
  const Item = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    let content;
    if (!isItemLoaded(index)) {
      content = (
        <div className="home-email-list-loading-more" style={style}>
          <LoadingOutlined />
        </div>
      );
    } else {
      content = <EmailItem {...items[index]} style={style} />;
    }

    return <>{content}</>;
  };

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
      threshold={8}
    >
      {({ onItemsRendered, ref }) => (
        <List
          className="List"
          height={height}
          itemCount={itemCount}
          itemSize={68}
          onItemsRendered={onItemsRendered}
          ref={ref}
          width={"100%"}
        >
          {Item}
        </List>
      )}
    </InfiniteLoader>
  );
}
