import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setToken } from "../../features/token/tokenSlice";

import "./index.scss";
import { useAppDispatch } from "../../app/hooks";
import { AppDispatch } from "../../app/store";
import { getUserInfo, login } from "../../app/apis";
import { setUserInfo } from "../../features/user/userSlice";
import { useState } from "react";

const googleLoginPath = process.env.REACT_APP_GOOG_LOGIN_PATH;
const officeLoginPath = process.env.REACT_APP_MSFT_LOGIN_PATH;

export default function Login() {
  const dispath: AppDispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParasm] = useSearchParams();
  const token = searchParasm.get("token");
  const newUser = searchParasm.get("newcomer");
  const newUserUrl = searchParasm.get("inner");

  const [logining, setLogining] = useState(false);

  const loginWithToken = (token: string) => {
    dispath(setToken(token));
    // 获取用户信息后再跳转
    getUserInfo()
      .then((userInfo) => {
        dispath(setUserInfo(userInfo));
        setLogining(false);
        navigate("/", {
          replace: true,
          state: {
            isNewUser: newUser,
            innerUrl: newUserUrl,
          },
        });
      })
      .catch((err) => {
        console.error(err);
        setLogining(false);
        message.error(JSON.stringify(err));
      });
  };

  if (token) {
    loginWithToken(token);
  }

  const onFinish = (form: any) => {
    const { email, password } = form;
    setLogining(true);
    login({ email, password })
      .then(({ token }) => {
        loginWithToken(token);
      })
      .catch((err) => {
        console.error(err);
        setLogining(false);
        message.error(JSON.stringify(err));
      });
  };

  // login page background styles: https://evankarageorgos.github.io/hue/grid.html
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        background: `linear-gradient(-173deg, rgba(255,255,255,0.20) 0%, #000000 100%),
          linear-gradient(72deg, rgba(255,255,255,0.25) 25%, rgba(0,0,0,0.25) 100%),
          radial-gradient(47% 102%, rgba(255,255,255,0.50) 0%, rgba(21,24,32,0.60) 120%)`,
        backgroundBlendMode: "multiply, screen",
      }}
    >
      <div className="login-page">
        <p className="title">Welcome back</p>
        <Form name="normal_login" className="login-form" onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Username.",
              },
            ]}
          >
            <Input
              autoComplete="new-password"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
              style={{ height: 52 }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password.",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              style={{ height: 52 }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={logining}
              style={{ height: 52, fontWeight: "bold" }}
            >
              Continue
            </Button>
          </Form.Item>
        </Form>
        <p className="des">
          <span>OR</span>
        </p>
        <Button className="google-btn">
          <span className="google-icon"></span>
          <a className="google-txt" href={`${googleLoginPath}`}>
            Continue with Google
          </a>
        </Button>
        <Button className="google-btn">
          <span className="office-icon"></span>
          <a className="google-txt" href={`${officeLoginPath}`}>
            Continue with Office 365
          </a>
        </Button>
      </div>
    </div>
  );
}
