import {
  AUTH_ERROR,
  AUTH_NOTOKEN,
  AUTH_TOKENINVALID
} from "../../exceptions/authException.js";
import { jwtVerify } from "../../security/jwtBuilder";
import { BASE_URL } from "../../config/constants";

export default (req, res, next) => {
  // all routes */auth/* dont have jwt security
  if (req.url.split("/").indexOf("auth") >= 0 || req.url + "/" === BASE_URL) {
    return next();
  }

  // get jwt token from header or body
  const authHeader =
    req.headers.authentication || req.body.authentication || req.body.token;

  if (!authHeader) return res.status(401).send(AUTH_NOTOKEN);

  const parts = authHeader.split(" ");

  // verify if the authentication have two partes 'Bearer' and 'token'
  if (!parts.length === 2) return res.status(401).send(AUTH_TOKENINVALID);

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) return res.status(401).send(AUTH_TOKENINVALID);

  try {
    // verify id jwt token is válid
    const id = jwtVerify(token);
    if (!id) throw new Error();

    //set userId in request
    req.userId = id;
    // call the next router
    return next();
  } catch (e) {
    return res.status(401).send(AUTH_ERROR);
  }
};
