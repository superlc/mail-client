import { Avatar } from "antd";
import { EmailType } from "../../types";
import { useState } from "react";

import "./EmailDetail.scss";
import { hashAvatarBgColor, randomRgb } from "../../utils/random";

export default function EmailDetail({
  attachments,
  created_at,
  message_body,
  receiver,
  sender,
  send_time,
  subject,
  updated_at,
}: EmailType) {
  console.log(message_body);
  const [emailContent] = useState(
    URL.createObjectURL(new Blob([message_body], { type: "text/html" }))
  );

  const avatarChar = sender[0].toUpperCase();

  return (
    <div className="email-detail">
      <div className="email-detail-header">
        <div className="email-detail-header-subject">{subject}</div>
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
              <span>To: </span>
              {receiver}
            </div>
          </div>
          <div className="email-detail-header-summary-date">{send_time}</div>
        </div>
      </div>
      <div className="email-detail-body">
        <iframe
          id="email-render"
          src={emailContent}
          frameBorder={0}
          style={{ border: "none", width: "100%", height: "calc(100% - 24px)" }}
        ></iframe>
      </div>
    </div>
  );
}
