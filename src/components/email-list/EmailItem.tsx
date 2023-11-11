import { Avatar, Tooltip, message } from "antd";
import { useState } from "react";
import {
  DownloadOutlined,
  PaperClipOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import classNames from "classnames";
import { debounce } from "lodash";

import "./EmailItem.scss";

import { hashAvatarBgColor } from "../../utils/random";
import { EmailType } from "../../types";
import { useEmailDispatch } from "../../pages/home/HomeProvider";
import { downloadEmail } from "../../app/apis";
import { download } from "../../utils/file";

export function EmailItem(
  props: EmailType & { active?: boolean; style?: React.CSSProperties }
) {
  const { sender, send_time, attachments, subject, active, style, id } = props;

  const [senderAvatar] = useState((sender || "a")[0].toUpperCase());
  const dispatchEmailDetail = useEmailDispatch();

  if (sender) {
    const saveEmail = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();

      downloadEmail(id, encodeURIComponent(subject))
        .then((res) => {
          download(res, encodeURIComponent(subject));
        })
        .catch((err) => message.error(err));
    };

    return (
      <div
        id={`email-item-${id}`}
        className={classNames("email-item")}
        style={style ?? {}}
        onClick={() => {
          const currentItem = document.querySelector(`#email-item-${id}`);
          if (currentItem?.classList.contains("active")) {
            return;
          }
          const currentActiveItem =
            document.querySelector(".email-item.active");
          currentActiveItem?.classList.remove("active");
          currentItem?.classList.add("active");

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
            <div className="email-item-detail-sender-tag">
              {!!attachments && <PaperClipOutlined className="show-default" />}
              <Tooltip title="Click icon to download email" placement="right">
                <DownloadOutlined
                  className="show-hover"
                  onClick={debounce(saveEmail, 300)}
                />
              </Tooltip>
            </div>
          </div>
          <div className="email-item-detail-extra">
            <div className="email-item-detail-extra-type">{subject}</div>
            <div className="email-item-detail-extra-date">{send_time}</div>
          </div>
        </div>
      </div>
    );
  }
  return <div style={style}>Hello</div>;
}
