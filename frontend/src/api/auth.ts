import { api } from "./client";
import { type AuthStatus, type AuthorizationPayload } from "./types";

export function login(payload: AuthorizationPayload) {
  return api.post<AuthorizationPayload>("/auth/login", payload);
}

export function status() {
    return api.get<AuthStatus>("/auth/status")
}
