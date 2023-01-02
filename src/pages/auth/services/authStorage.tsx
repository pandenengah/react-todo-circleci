import { User } from "../../../models/user.interface";
import { env } from "../../../app/env";


const getUser = (): User => {
  return JSON.parse(localStorage.getItem(env.userLocalStorageName) || '{}')
}

const setUser = (user: User): void => {
  localStorage.setItem(env.userLocalStorageName, JSON.stringify(user))
}

const isUserHasAccessToken = (): boolean => {
  const user = getUser()
  return !!user.accessToken
}

const getUserAccessToken = (): string => {
  const user = getUser()
  return user?.accessToken || ''
}

const removeUser = (): void => {
  localStorage.removeItem(env.userLocalStorageName)
}

const authStorage = {
  setUser, removeUser, isUserHasAccessToken, getUser, getUserAccessToken
}

export default authStorage