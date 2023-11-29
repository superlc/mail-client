import { Input, Select } from "antd";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  setOperation,
  setOperationValue as setOperationValueOfStore,
} from "../../../features/email/emailSlice";
import { useEffect, useRef, useState } from "react";
import { OperationType } from "../../../types";
import DomainsSelect from "../../../components/domains-select/DomainsSelect";
import UsersSelect from "../../../components/users-select/UsersSelect";

const Operations = ["text", "domain", "receiver"];

export default function SearchFilter() {
  // update operation state in this component
  const defaultReceiver = useAppSelector((state) => state.user.data?.email);
  const [operationType, setOperationType] = useState<OperationType>("receiver");

  const [domain, setDomain] = useState<string | undefined>(undefined);
  const [receiver, setReceiver] = useState<string | undefined>(defaultReceiver);
  // const [text, setText] = useState<string | undefined>(undefined);

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
        operationType: "receiver",
        operationValue: defaultReceiver || "",
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
            <DomainsSelect
              key={"domain"}
              value={domain}
              onChange={(val) => {
                setDomain(domain);
                dispatch(setOperationValueOfStore(val));
              }}
              style={{ width: 400, textAlign: "left" }}
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
              style={{ width: 400, textAlign: "left" }}
              showSearch
            />
          )}
        </div>
      )}
    </>
  );
}
