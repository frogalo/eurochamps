export function getAdminHeaders(userName: string | null, contentType = false) {
  return {
    ...(contentType ? { "Content-Type": "application/json" } : {}),
    "x-user-name": userName ?? "",
  };
}
