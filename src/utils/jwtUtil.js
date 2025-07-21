import { jwtDecode } from "jwt-decode";

export function getUserIdFromToken() {
  const userInfo = getUserInfoFromToken();
  if (!userInfo) return null;
  return userInfo.sub;
}

export function getUserNameFromToken() {
  const userInfo = getUserInfoFromToken();
  if (!userInfo) return null;
  return userInfo.name;
}

export function getUserRoleFromToken() {
  const userInfo = getUserInfoFromToken();
  if (!userInfo) return null;
  return userInfo.role;
}

export function getUserInfoFromToken() {
    
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}
