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
  // update operation state in this component
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
          const { users = [] } = res;
          setOperationValue(users[0].email);
          setReceivers(users.map((user) => user.email));
          dispatch(
            setOperation({
              operationType,
              operationValue: users[0].email || defaultReceiver || "",
            })
          );
        })
        .catch((err) => message.error(err))
        .finally(() => {});
    }
    if (operationType === "domain") {
      getDomains()
        .then((res) => {
          const { domains = [] } = res;
          setOperationValue(domains[0]);
          setDomains(domains);
          dispatch(
            setOperation({
              operationType,
              operationValue: domains[0],
            })
          );
        })
        .catch((err) => message.error(err))
        .finally(() => {});
    }
  }, [operationType]);

  useEffect(() => {
    // dispatch the operation update
    dispatch(
      setOperation({
        operationType: "receiver",
        operationValue: defaultReceiver || "",
      })
    );
  }, [defaultReceiver]);

  return (
    <>
      {!!operationType && (
        <div className="search-filter">
          <Select
            value={operationType}
            onChange={(val) => {
              setOperationType(val);
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
              style={{ width: 400 }}
              onSearch={(val) => {
                dispatch(
                  setOperation({
                    operationType: "text",
                    operationValue: val,
                  })
                );
              }}
              enterButton
            />
          )}
          {operationType === "domain" && (
            <Select
              key={"domain"}
              value={operationValue || domains[0]}
              options={domains.map((item) => ({
                value: item,
                label: item,
              }))}
              onChange={(val) => {
                setOperationValue(val);
                dispatch(setOperationValueOfStore(val));
              }}
              style={{ width: 400, textAlign: "left" }}
              showSearch
            />
          )}
          {operationType === "receiver" && (
            <Select
              key={"receiver"}
              value={operationValue || receivers[0]}
              options={receivers.map((item) => ({
                value: item,
                label: item,
              }))}
              onChange={(val) => {
                setOperationValue(val);
                dispatch(setOperationValueOfStore(val));
              }}
              style={{ width: 400, textAlign: "left" }}
              showSearch
            />
          )}
        </div>
      )}
    </>
  );
}
