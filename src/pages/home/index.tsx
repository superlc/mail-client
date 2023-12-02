import { useState } from "react";

import "./home.scss";

import HomeEmailDetail from "./HomeEmailDetail";
import HomeEmailList from "./HomeEmailList";
import { EmailProvider } from "./HomeProvider";
import PageHeader from "../../components/header/Header";
import SearchFilter from "./components/SearchFilter";

import SplitPane, { Pane } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";

export default function Home() {
  const [sizes, setSizes] = useState([360, "auto"]);
  return (
    <EmailProvider>
      <div className="home-page">
        <div className="home-header">
          <PageHeader current="emails" center={<SearchFilter />} />
        </div>
        <div className="home-body">
          <SplitPane
            split="vertical"
            sizes={sizes}
            onChange={setSizes}
            sashRender={(index: number, active: boolean) => <></>}
          >
            <div className="home-aside">
              <HomeEmailList />
            </div>
            <div className="home-main">
              <HomeEmailDetail />
            </div>
          </SplitPane>
        </div>
      </div>
    </EmailProvider>
  );
}
