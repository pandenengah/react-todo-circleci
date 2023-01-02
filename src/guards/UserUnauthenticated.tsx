import authStorage from "../pages/auth/services/authStorage";
import { Navigate } from "react-router-dom";
import { ReactElement } from "react";

type UserUnauthenticatedProps = {
  children: ReactElement
}

export const UserUnauthenticated = ({ children }: UserUnauthenticatedProps) => {
  return (
    (authStorage.isUserHasAccessToken()) ? (
      <Navigate to={'/'}/>
    ) : (
      children
    )
  )
}