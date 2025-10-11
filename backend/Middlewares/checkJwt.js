import jwt from "jsonwebtoken";

export const checkJwt = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        message: "Authorization failed!"
      })
    };

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, email } = decoded;

    req.user = { userId, email };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    };
    res.status(401).json({
      message: "JWT authentication failed!",
    });
  }
}