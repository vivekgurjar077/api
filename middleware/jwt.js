
import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return next(createError(401,"You are not authenticated!"))

  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    if (err) return next(createError(403,"Token is not valid!"))
    // Attach userId only if it's present in the payload
    if (payload.id) {
      req.userId = payload.id;
    }
    req.admin = payload.admin;
    next()
  });
};
