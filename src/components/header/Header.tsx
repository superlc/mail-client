import { useState } from "react";
import classNames from "classnames";

import "./Header.scss";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  CaretDownOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "antd";
import { setToken } from "../../features/token/tokenSlice";

const Navs = ["users", "emails", "rules", "downloads"] as const;

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
  const dispatch = useAppDispatch();
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
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                label: "Logout",
                icon: <LogoutOutlined />,
                onClick: () => {
                  // console.log("logout");
                  dispatch(setToken(""));
                },
              },
            ],
          }}
        >
          <CaretDownOutlined
            style={{ marginLeft: 8, marginTop: 2, cursor: "pointer" }}
          />
        </Dropdown>
      </div>
    </div>
  );
}
