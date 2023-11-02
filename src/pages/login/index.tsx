import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Navigate, useSearchParams } from "react-router-dom";
import { setToken } from "../../features/token/tokenSlice";

import "./index.css";
import { useAppDispatch } from "../../app/hooks";
import { AppDispatch } from "../../app/store";

const googleLoginPath = process.env.REACT_APP_GOOG_LOGIN_PATH;
const officeLoginPath = "";

export default function Login() {
  const onFinish = () => {};

  const dispath: AppDispatch = useAppDispatch();
  const [searchParasm] = useSearchParams();
  const token = searchParasm.get("token");

  if (token) {
    dispath(setToken(token));
    return <Navigate to="/" />;
  }

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
