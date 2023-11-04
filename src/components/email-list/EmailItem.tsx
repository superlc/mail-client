import { Avatar } from "antd";
import { useState } from "react";
import { PaperClipOutlined } from "@ant-design/icons";

import "./EmailItem.scss";

import { randomRgb } from "../../utils/random";
import { EmailType } from "../../types";

export function EmailItem({
  sender,
  send_time,
  attachments,
  subject,
}: EmailType) {
  const [senderAvatar] = useState(sender[0].toUpperCase());

  return (
    <div className="email-item">
      <div className="email-item-avatar">
        <Avatar size={16} style={{ backgroundColor: `${randomRgb()}` }}>
          {senderAvatar}
        </Avatar>
      </div>
      <div className="email-item-detail">
        <div className="email-item-detail-sender">
          <div className="email-item-detail-sender-name">{sender}</div>
          {!!attachments && (
            <div className="email-item-detail-sender-tag">
              <PaperClipOutlined />
            </div>
          )}
        </div>
        <div className="email-item-detail-extra">
          <div className="email-item-detail-extra-type">{subject}</div>
          <div className="email-item-detail-extra-date">{send_time}</div>d
        </div>
      </div>
    </div>
  );
}
