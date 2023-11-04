import "./home.scss";
import HomeEmailDetail from "./HomeEmailDetail";

import HomeEmailList from "./HomeEmailList";
import { EmailProvider } from "./HomeProvider";

export default function Home() {
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
