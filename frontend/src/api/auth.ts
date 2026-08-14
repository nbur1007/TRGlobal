import { api } from "./client";
import { type AuthStatus, type AuthorizationPayload, type LoginResponse } from "./types";

export function login(payload: AuthorizationPayload) {
  return api.post<LoginResponse>("/auth/login", payload);
}

export function status() {
    return api.get<AuthStatus>("/auth/status")
}
