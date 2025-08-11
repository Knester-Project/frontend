import Cookies from "js-cookie";

// Save tokens
export const setTokens = (accessToken: string) => {
  Cookies.set("accessToken", accessToken, {
    secure: true,
    sameSite: "strict",
    expires: 1,
  });
};


// Get token
export const getAccessToken = () => Cookies.get("accessToken");

// Clear tokens
export const clearTokens = () => {
  Cookies.remove("accessToken");
};


//Save Admin Token
export const setAdminTokens = (accessToken: string) => {
  Cookies.set("_access", accessToken, {
    secure: true,
    sameSite: "strict",
    expires: 1,
  });
};

// Get admin token
export const getAdminAccessToken = () => Cookies.get("_access");

// Clear tokens
export const clearAdminTokens = () => {
  Cookies.remove("_access");
};