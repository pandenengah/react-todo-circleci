import authStorage from "../pages/auth/services/authStorage";
import { Navigate } from "react-router-dom";
import { ReactElement } from "react";

type UserAuthenticatedProps = {
  children: ReactElement
}

export const UserAuthenticated = ({ children }: UserAuthenticatedProps) => {
  return (
    (authStorage.isUserHasAccessToken()) ? (
      children
    ) : (
      <Navigate to={'/auth/login'}/>
    )
  )
}