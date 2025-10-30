import Cookies from "js-cookie";

const COOKIE_OPTIONS = {
  secure: true,
  sameSite: "strict" as const,
  expires: 7,
  path: "/", 
};

// ======= USER TOKEN =======

// Save user token
export const setUserToken = (token: string) => {
  Cookies.set("kn_auth_token", token, COOKIE_OPTIONS);
};

// Get user token
export const getUserToken = () => Cookies.get("kn_auth_token");

// Clear user token
export const clearUserToken = () => {
  Cookies.remove("kn_auth_token", { path: "/" });
};


// ======= ADMIN TOKEN =======

// Save admin token
export const setAdminToken = (token: string) => {
  Cookies.set("kn_admin_token", token, COOKIE_OPTIONS);
};

// Get admin token
export const getAdminToken = () => Cookies.get("kn_admin_token");

// Clear admin token
export const clearAdminToken = () => {
  Cookies.remove("kn_admin_token", { path: "/" });
};
