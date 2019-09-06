import { AUTH_ERROR } from "../../exceptions/authException.js";
import { jwtVerify } from "../../security/jwtBuilder";
import { BASE_URL } from "../../config/constants";

export default (req, res, next) => {
  // all routes */auth/* dont have jwt security
  if (req.url.split("/").indexOf("auth") >= 0 || req.url.match(BASE_URL)) {
    return next();
  }

  // get jwt token from reader or body
  const authHeader = req.headers.authorization || req.body.authorization;

  if (!authHeader) return res.status(401).send(AUTH_ERROR);

  const parts = authHeader.split(" ");

  // verify if the authorization have two partes 'Bearer' and 'token'
  if (!parts.length === 2) return res.status(401).send(AUTH_ERROR);

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) return res.status(401).send(AUTH_ERROR);

  try {
    // verify id jwt token is válid
    const id = jwtVerify(token);
    //set userId in request
    req.userId = id;
    // call the next router
    return next();
  } catch (e) {
    return res.status(401).send(AUTH_ERROR);
  }
};
