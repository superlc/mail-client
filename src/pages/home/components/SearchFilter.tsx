import { Input, Select, message } from "antd";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  setOperation,
  setOperationValue as setOperationValueOfStore,
} from "../../../features/email/emailSlice";
import { useEffect, useState } from "react";
import { getDomains, getUsers } from "../../../app/apis";
import { OperationType } from "../../../types";

const Operations = ["text", "domain", "receiver"];

export default function SearchFilter() {
  const defaultReceiver = useAppSelector((state) => state.user.data?.email);
  const [operationType, setOperationType] = useState<OperationType>("receiver");
  const [operationValue, setOperationValue] = useState<string>(
    defaultReceiver || ""
  );

  const dispatch = useAppDispatch();

  const [domains, setDomains] = useState<string[]>([]);
  const [receivers, setReceivers] = useState<string[]>([]);

  useEffect(() => {
    if (operationType === "receiver") {
      getUsers()
        .then((res) => {
          setReceivers((res.users || []).map((user) => user.email));
        })
        .catch((err) => message.error(err))
        .finally(() => {});
    }
    if (operationType === "domain") {
      getDomains()
        .then((res) => {
          setDomains(res.domains || []);
        })
        .catch((err) => message.error(err))
        .finally(() => {});
    }
  }, [operationType]);

  useEffect(() => {
    // dispatch the operation update
    console.log("dispatch set operation ");
    dispatch(
      setOperation({
        operationType: "receiver",
        operationValue: defaultReceiver,
      })
    );
  }, []);

  return (
    <>
      {!!operationType && (
        <div className="search-filter">
          <Select
            value={operationType}
            onChange={(val) => {
              setOperationType(val);
              dispatch(
                setOperation({
                  operationType: val,
                  operationValue: val === "receiver" ? defaultReceiver : "",
                })
              );
            }}
            options={Operations.map((item) => ({
              value: item,
              label: item,
            }))}
            style={{ width: 100, marginRight: 10 }}
          />
          {operationType === "text" && (
            <Input.Search
              placeholder="Please select the item"
              style={{ width: 240 }}
              enterButton
            />
          )}
          {operationType === "domain" && (
            <Select
              value={operationValue || domains[0]}
              options={domains.map((item) => ({
                value: item,
                label: item,
              }))}
              onChange={(val) => {
                setOperationValue(val);
                dispatch(setOperationValueOfStore(val));
              }}
              style={{ width: 240 }}
              showSearch
            />
          )}
          {operationType === "receiver" && (
            <Select
              value={operationValue || receivers[0]}
              options={receivers.map((item) => ({
                value: item,
                label: item,
              }))}
              onChange={(val) => {
                setOperationValue(val);
                dispatch(setOperationValueOfStore(val));
              }}
              style={{ width: 240 }}
              showSearch
            />
          )}
        </div>
      )}
    </>
  );
}
