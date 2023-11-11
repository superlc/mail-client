import { DownloadOutlined } from "@ant-design/icons";
import { getAttachment } from "../../app/apis";
import { AttachmentType } from "../../types";

import "./Attachment.scss";
import { ReactNode } from "react";
import { message } from "antd";
import { download, getSizeDes } from "../../utils/file";
import {
  BsFiletypeDoc,
  BsFiletypeDocx,
  BsFiletypePpt,
  BsFiletypePptx,
  BsFiletypeXls,
  BsFiletypeXlsx,
  BsFiletypeCsv,
  BsFiletypePsd,
  BsFiletypePdf,
  BsFiletypeExe,
  BsFiletypeGif,
  BsFiletypeJpg,
  BsFiletypePng,
  BsFiletypeSvg,
  BsFiletypeTxt,
  BsFiletypeJson,
  BsFiletypeJs,
  BsFiletypeKey,
  BsFiletypeMd,
  BsFiletypeMdx,
  BsFiletypeMov,
  BsFiletypeMp3,
  BsFiletypeMp4,
  BsFiletypeXml,
  BsFiletypeYml,
  BsFileText,
} from "react-icons/bs";

const FileTypes: { [k: string]: ReactNode } = {
  csv: <BsFiletypeCsv />,
  doc: <BsFiletypeDoc />,
  docx: <BsFiletypeDocx />,
  ppt: <BsFiletypePpt />,
  pptx: <BsFiletypePptx />,
  xls: <BsFiletypeXls />,
  xlsx: <BsFiletypeXlsx />,
  psd: <BsFiletypePsd />,
  pdf: <BsFiletypePdf />,
  exe: <BsFiletypeExe />,
  gif: <BsFiletypeGif />,
  jpg: <BsFiletypeJpg />,
  png: <BsFiletypePng />,
  svg: <BsFiletypeSvg />,
  txt: <BsFiletypeTxt />,
  json: <BsFiletypeJson />,
  js: <BsFiletypeJs />,
  key: <BsFiletypeKey />,
  md: <BsFiletypeMd />,
  mdx: <BsFiletypeMdx />,
  mov: <BsFiletypeMov />,
  mp3: <BsFiletypeMp3 />,
  mp4: <BsFiletypeMp4 />,
  xml: <BsFiletypeXml />,
  yml: <BsFiletypeYml />,
};

function getIcon(fileName: string): React.ReactNode {
  const pathSplits = fileName.split(".");
  const fileType =
    pathSplits.length <= 1 ? "unknown" : pathSplits[pathSplits.length - 1];
  return FileTypes[fileType] || <BsFileText />;
}

export default function Attachment({
  id,
  content_type,
  name,
  size,
}: AttachmentType) {
  return (
    <div
      className="attachment-item"
      onClick={() => {
        getAttachment(id)
          .then((res: Blob) => {
            download(res, name);
          })
          .catch((err) => message.error(err));
      }}
    >
      <div className="attachment-item-icon">{getIcon(name)}</div>
      <div className="attachment-item-detail" title={name}>
        <div className="attachment-item-name">{name}</div>
        <div className="attachment-item-size">{getSizeDes(size)}</div>
      </div>
      <DownloadOutlined />
    </div>
  );
}
