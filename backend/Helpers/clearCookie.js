// helpers/cookie.js
export const clearCookie = (res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: process.env.NODE_ENV === "production",
  });
};
