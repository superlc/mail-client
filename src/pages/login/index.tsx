import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setToken } from "../../features/token/tokenSlice";

import "./index.css";
import { useAppDispatch } from "../../app/hooks";
import { AppDispatch } from "../../app/store";
import { getUserInfo, login } from "../../app/apis";
import { setUserInfo } from "../../features/user/userSlice";
import { useState } from "react";

const googleLoginPath = process.env.REACT_APP_GOOG_LOGIN_PATH;
const officeLoginPath = "";

export default function Login() {
  const dispath: AppDispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParasm] = useSearchParams();
  const token = searchParasm.get("token");

  const [logining, setLogining] = useState(false);

  const loginWithToken = (token: string) => {
    dispath(setToken(token));
    // 获取用户信息后再跳转
    getUserInfo()
      .then((userInfo) => {
        dispath(setUserInfo(userInfo));
        setLogining(false);
        navigate("/", { replace: true });
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

  return (
    <div className="login-page">
      <p className="title">Sign in with Email</p>
      <Form name="normal_login" className="login-form" onFinish={onFinish}>
        <Form.Item name="" style={{ display: "none" }}>
          <Input
            readOnly={true}
            autoComplete="off"
            style={{ display: "none" }}
          />
        </Form.Item>
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
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={logining}
          >
            Continue
          </Button>
        </Form.Item>
      </Form>
      <p className="des">OR</p>
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
  );
}
