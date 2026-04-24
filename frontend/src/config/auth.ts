export const getToken = (): string | null => localStorage.getItem("token");

export const authHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`
});
