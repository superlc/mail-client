import { Suspense } from "react";

import "./home.scss";

import HomeEmailDetail from "./HomeEmailDetail";
import HomeEmailList from "./HomeEmailList";
import { EmailProvider } from "./HomeProvider";
import { useAppSelector } from "../../app/hooks";

export default function Home() {
  const userInfo = useAppSelector((state) => state.user.data);
  console.log(userInfo);
  return (
    <EmailProvider>
      <div className="home-page">
        <div className="home-header">header</div>
        <div className="home-body">
          <div className="home-aside">
            <HomeEmailList />
          </div>
          <div className="home-main">
            <HomeEmailDetail />
          </div>
        </div>
      </div>
    </EmailProvider>
  );
}
