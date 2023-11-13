import { Avatar, Button, Dropdown } from "antd";
import { EmailType } from "../../types";

import "./EmailDetail.scss";
import { hashAvatarBgColor } from "../../utils/random";
import Attachment from "./Attachment";
import {
  EllipsisOutlined,
  MoreOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { downloadEmail } from "../../app/apis";

export default function EmailDetail({
  attachments,
  // created_at,
  message_body,
  receiver,
  sender,
  send_time,
  subject,
  id,
}: // updated_at,
EmailType) {
  const avatarChar = sender[0].toUpperCase();

  return (
    <div className="email-detail">
      <div className="email-detail-header">
        <div className="email-detail-header-subject">
          <div className="email-detail-header-subject-title">{subject}</div>
        </div>
        <div className="email-detail-header-summary">
          <Avatar
            size={48}
            style={{ backgroundColor: `${hashAvatarBgColor(avatarChar)}` }}
          >
            {avatarChar}
          </Avatar>
          <div className="email-detail-header-summary-account">
            <div className="email-detail-header-summary-account-sender">
              {sender}
            </div>
            <div className="email-detail-header-summary-account-receiver">
              <span style={{ color: "rgba(0,0,0,0.8" }}>To: </span>
              {receiver}
            </div>
          </div>
          <div className="email-detail-header-summary-date">{send_time}</div>
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: "Download this email",
                  icon: <SaveOutlined />,
                  onClick: () => {
                    downloadEmail(id);
                  },
                },
              ],
            }}
          >
            <div className="email-detail-header-actions">
              <div className="email-detail-header-actions-item">
                <MoreOutlined />
              </div>
            </div>
          </Dropdown>
        </div>
        {attachments?.length > 0 && (
          <div className="email-detail-header-attachments">
            {attachments.map((item, index) => (
              <Attachment key={index} {...item} />
            ))}
          </div>
        )}
      </div>
      <div className="email-detail-body">
        <iframe
          id="email-render"
          src={URL.createObjectURL(
            new Blob([message_body], { type: "text/html" })
          )}
          frameBorder={0}
          style={{ border: "none", width: "100%", height: "calc(100% - 24px)" }}
        ></iframe>
      </div>
    </div>
  );
}
