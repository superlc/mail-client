import InfiniteScroll from "react-infinite-scroll-component";
import EmailList from "../../components/email-list/EmailList";
import { LoadingOutlined } from "@ant-design/icons";
import { useRef } from "react";
// const size =
export default function HomeEmailList() {
  const pointer = useRef(0);

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
    <EmailList list={[]} />
  );
}
