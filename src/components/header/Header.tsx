import { useState } from "react";
import classNames from "classnames";

import "./Header.scss";
import { useAppSelector } from "../../app/hooks";
import { UserOutlined } from "@ant-design/icons";

const Navs = ["home", "users", "downloads"] as const;

type PageRouteKey = (typeof Navs)[number];

export default function PageHeader({
  current = "home",
  center,
}: {
  current?: PageRouteKey;
  center?: React.ReactNode;
}) {
  const [navs] = useState(Navs);
  const userInfo = useAppSelector((state) => state.user.data);

  return (
    <div className="page-header">
      <div className="page-header-navs">
        {navs.map((nav, index) => (
          <a
            key={index}
            className={classNames("page-header-nav", {
              active: current === nav,
            })}
          >
            {`${nav[0].toUpperCase()}${nav.substring(1)}`}
          </a>
        ))}
      </div>
      <div className="page-header-center">{center}</div>
      <div className="page-header-logo">
        <UserOutlined />
        <span className="page-header-user-name">{userInfo?.email}</span>
      </div>
    </div>
  );
}
