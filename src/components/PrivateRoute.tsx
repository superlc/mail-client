import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const token = useAppSelector((state) => state.token.token);
  // const token = "123";

  const { pathname } = useLocation();
  return token ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" state={{ returnURL: pathname }} />
  );
}
