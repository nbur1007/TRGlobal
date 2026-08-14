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

export function getSelf(id: string) {
  return api.get<User>("/user/me", { id });
}

export function listUsersByRole(role: string) {
  return api.get<UserListResponse>("/user/list-by-role", { role });
}

export function getAllUsers() {
  return api.get<UserListResponse>("/user/all-users");
}

export function createAdmin(data: AdminCreationData) {
  return api.get<User>("/user/create-admin", data);
}

export function deleteSelf(id: string) {
  return api.delete<User>("/user/delete-self", { id });
}

export function deleteUser(id: string) {
    return api.delete<User>("/user/delete-user", { id });
}
