import { Avatar } from "antd";
import { useState } from "react";
import { PaperClipOutlined } from "@ant-design/icons";
import classNames from "classnames";

import "./EmailItem.scss";

import { hashAvatarBgColor } from "../../utils/random";
import { EmailType } from "../../types";
import { useEmailDispatch } from "../../pages/home/HomeProvider";

export function EmailItem(
  props: EmailType & { active?: boolean; style?: React.CSSProperties }
) {
  console.log("--------- email item props:", props);
  const { sender, send_time, attachments, subject, active, style } = props;

  const [senderAvatar] = useState((sender || "a")[0].toUpperCase());
  const dispatchEmailDetail = useEmailDispatch();
  if (sender) {
    return (
      <div
        className={classNames("email-item", { active: active })}
        style={style ?? {}}
        onClick={() => {
          dispatchEmailDetail!({
            type: "set",
            payload: props,
          });
        }}
      >
        <div className="email-item-avatar">
          <Avatar
            size={16}
            style={{ backgroundColor: `${hashAvatarBgColor(senderAvatar)}` }}
          >
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
  return <div style={style}>Hello</div>;
}
