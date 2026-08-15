import { api } from "./client";
import {
  type UserListResponse,
  type User,
  type UserCreationData,
  type AdminCreationData,
} from "./types";

export function createUser(data: UserCreationData) {
  return api.post<User>("/user/create", data);
}

export function getSelf() {
  return api.get<User>("/user/me");
}

export function listUsersByRole(role: string, skip: number, take: number) {
  return api.get<UserListResponse>("/user/list-by-role", { role, skip, take });
}

export function getAllUsers(skip: number, take: number) {
  return api.get<UserListResponse>("/user/all-users", { skip, take });
}

export function createAdmin(data: AdminCreationData) {
  return api.post<User>("/user/create-admin", data);
}

export function deleteSelf() {
  return api.delete<User>("/user/delete-self");
}

export function deleteUser(id: string) {
  return api.delete<User>("/user/delete-user", { id });
}
