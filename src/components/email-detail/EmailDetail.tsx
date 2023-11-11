import { Avatar } from "antd";
import { EmailType } from "../../types";
import { useState } from "react";

import "./EmailDetail.scss";
import { hashAvatarBgColor, randomRgb } from "../../utils/random";
import Attachment from "./Attachment";

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
              <span style={{ color: "rgba(0,0,0,0.8" }}>To: </span>
              {receiver}
            </div>
          </div>
          <div className="email-detail-header-summary-date">{send_time}</div>
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
