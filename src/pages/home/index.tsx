import { Suspense } from "react";

import "./home.scss";

import HomeEmailDetail from "./HomeEmailDetail";
import HomeEmailList from "./HomeEmailList";
import { EmailProvider } from "./HomeProvider";
import { useAppSelector } from "../../app/hooks";
import PageHeader from "../../components/header/Header";
import SearchFilter from "./components/SearchFilter";

export default function Home() {
  const userInfo = useAppSelector((state) => state.user.data);
  return (
    <EmailProvider>
      <div className="home-page">
        <div className="home-header">
          <PageHeader center={<SearchFilter />} />
        </div>
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
