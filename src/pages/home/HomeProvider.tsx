import {
  Dispatch,
  Reducer,
  createContext,
  useContext,
  useReducer,
} from "react";
import { EmailType } from "../../types";

const EmailContext = createContext<EmailType | null>(null);
const DispatchEmailContext = createContext<Dispatch<any> | null>(null);

export const useEmailContext = () => useContext(EmailContext);

export interface EmailActionType {
  type: "set" | "reset";
  payload?: EmailType | null;
}

const mailReducer: Reducer<EmailType | null, EmailActionType> = (
  state,
  action
) => {
  switch (action.type) {
    case "set":
      return { ...action.payload! };
    case "reset":
      return null;
    default:
      throw new Error("Invalid mail action type!");
  }
};

export const EmailProvider = ({ children }: { children: React.ReactNode }) => {
  const [email, dispatch] = useReducer<
    Reducer<EmailType | null, EmailActionType>
  >(mailReducer, null);
  return (
    <EmailContext.Provider value={email}>
      <DispatchEmailContext.Provider value={dispatch}>
        {children}
      </DispatchEmailContext.Provider>
    </EmailContext.Provider>
  );
};
