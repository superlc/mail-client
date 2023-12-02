import { Button, Input, Select, Tooltip } from "antd";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  setOperation,
  setOperationValue as setOperationValueOfStore,
  setForceReload,
  setOperationValue,
} from "../../../features/email/emailSlice";
import { useEffect, useRef, useState } from "react";
import { OperationType } from "../../../types";
import DomainsSelect from "../../../components/domains-select/DomainsSelect";
import UsersSelect from "../../../components/users-select/UsersSelect";
import { ReloadOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";

const Operations = ["text", "domain", "receiver"];

export default function SearchFilter() {
  // update operation state in this component
  const defaultReceiver = useAppSelector((state) => state.user.data?.email);
  const location = useLocation();

  const [operationType, setOperationType] = useState<OperationType>(
    location.state?.type
  );

  const [domain, setDomain] = useState<string | undefined>(undefined);
  const [receiver, setReceiver] = useState<string | undefined>(undefined);
  const [text, setText] = useState<string | undefined>(undefined);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (operationType === "domain" && !!domain) {
      dispatch(
        setOperation({
          operationType,
          operationValue: domain!,
        })
      );
    }
    if (operationType === "receiver" && !!receiver) {
      dispatch(
        setOperation({
          operationType,
          operationValue: receiver,
        })
      );
    }
  }, [domain, receiver]);

  useEffect(() => {
    // dispatch the operation update
    dispatch(
      setOperation({
        operationType: location.state?.type || "receiver",
        operationValue: location.state?.value || defaultReceiver,
      })
    );
  }, [location.state, defaultReceiver]);

  useEffect(() => {
    if (location.state?.value) {
      setReceiver(location.state?.value);
    }
  }, []);

  return (
    <>
      {!!operationType && (
        <div className="search-filter">
          <Select
            value={operationType}
            onChange={(val) => {
              console.log("----------- ", val);
              setOperationType(val);

              if (val === "domain") {
                setDomain(undefined);
              } else if (val === "receiver") {
                setReceiver(undefined);
              } else {
                setText(undefined);
              }

              dispatch(
                setOperation({
                  operationType: val,
                  operationValue: "",
                })
              );
            }}
            options={Operations.map((item) => ({
              value: item,
              label: item,
            }))}
            style={{ width: 120, marginRight: 10, textAlign: "left" }}
          />
          {operationType === "text" && (
            <Input.Search
              placeholder="Please select the item"
              style={{ width: 320 }}
              onSearch={(val) => {
                dispatch(
                  setOperation({
                    operationType: "text",
                    operationValue: val,
                  })
                );
              }}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                dispatch(setOperationValueOfStore(e.target.value));
              }}
              enterButton
            />
          )}
          {operationType === "domain" && (
            <DomainsSelect
              key={"domain"}
              value={domain}
              onChange={(val) => {
                setDomain(domain);
                dispatch(setOperationValueOfStore(val));
              }}
              style={{ width: 320, textAlign: "left" }}
              showSearch
            />
          )}
          {operationType === "receiver" && (
            <UsersSelect
              key={"receiver"}
              value={receiver}
              onChange={(val) => {
                setReceiver(val);
                dispatch(setOperationValueOfStore(val));
              }}
              style={{ width: 320, textAlign: "left" }}
              showSearch
            />
          )}
          <Tooltip title="Reload emails">
            <Button
              icon={<ReloadOutlined />}
              style={{ marginLeft: 10 }}
              onClick={() => {
                dispatch(setForceReload());
              }}
            />
          </Tooltip>
        </div>
      )}
    </>
  );
}
