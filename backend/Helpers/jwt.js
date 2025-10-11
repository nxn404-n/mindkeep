import jwt from "jsonwebtoken";

export const generateAndSetToken = (user, res) => {
  const token = jwt.sign(
      {
        userId: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

  res.cookie('jwt', token, {
    httpOnly: true,
    sameSite: 'None',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  });
};