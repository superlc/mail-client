import { useState } from "react";
import classNames from "classnames";

import "./Header.scss";
import { useAppSelector } from "../../app/hooks";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Navs = ["emails", "users", "rules", "downloads"] as const;

type PageRouteKey = (typeof Navs)[number];

export default function PageHeader({
  current = "users",
  center,
}: {
  current?: PageRouteKey;
  center?: React.ReactNode;
}) {
  const [navs] = useState(Navs);
  const userInfo = useAppSelector((state) => state.user.data);
  const navigate = useNavigate();

  return (
    <div className="page-header">
      {userInfo?.admin ? (
        <div className="page-header-navs">
          {navs.map((nav, index) => (
            <a
              key={index}
              className={classNames("page-header-nav", {
                active: current === nav,
              })}
              onClick={(e) => {
                e.preventDefault();

                if (current === nav) {
                  return;
                }

                navigate(`/${nav}`);
              }}
            >
              {`${nav[0].toUpperCase()}${nav.substring(1)}`}
            </a>
          ))}
        </div>
      ) : (
        <div className="page-header-navs">
          {navs.slice(1, 3).map((nav, index) => (
            <a
              key={index}
              className={classNames("page-header-nav", {
                active: current === nav,
              })}
              onClick={(e) => {
                e.preventDefault();

                if (current === nav) {
                  return;
                }

                navigate(`/${nav}`);
              }}
            >
              {`${nav[0].toUpperCase()}${nav.substring(1)}`}
            </a>
          ))}
        </div>
      )}
      <div className="page-header-center">{center}</div>
      <div className="page-header-logo">
        <UserOutlined />
        <span className="page-header-user-name">{userInfo?.email}</span>
      </div>
    </div>
  );
}
