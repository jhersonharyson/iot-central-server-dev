import { AUTH_ERROR } from "../exceptions/authException";
import { UNEXPECTED_ERROR } from "../exceptions/serverException";
import {
  EMAIL_ISINVALID,
  NAME_ISINVALID,
  PASSWORD_ISINVALID,
  USER_NOTFOUND,
  ACCOUNT_ISINVALID
} from "../exceptions/userException";
import { MAC_ISINVALID, MAC_ISNOTFOUND } from "../exceptions/deviceException";

import User from "../models/user";
import Device from "../models/device";

import { jwtBuilder, jwtVerify } from "../security/jwtBuilder";

// verify if token is valid
export async function verify(req, res) {
  // get jwt token from header or body
  const authHeader =
    req.headers.authentication || req.body.authentication || req.body.token;

  if (!authHeader) return res.status(401).json(AUTH_ERROR);

  const parts = authHeader.split(" ");

  // verify if the authentication have two partes 'Bearer' and 'token'
  if (!parts.length === 2) return res.status(401).json(AUTH_ERROR);

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) return res.status(401).json(AUTH_ERROR);

  try {
    // verify id jwt token is válid
    const id = jwtVerify(token);
    if (!id) throw new Error();
    const user = await User.findById(id);
    return res.status(200).json({ authenticated: true, user });
  } catch (e) {
    return res.status(401).json(AUTH_ERROR);
  }
}

// give a jwt token
export function signin(req, res) {
  const { email, password, cpf } = req.body;

  if ((!email || email == "") && (!cpf || cpf == ""))
    return res.status(400).jwt(ACCOUNT_ISINVALID);

  if (!password || password == "")
    return res.status(400).jwt(PASSWORD_ISINVALID);
  try {
    //find all user that have the same name
    User.findOne({ email }, (err, user) => {
      if (err) throw err;
      if (!user) return res.send(USER_NOTFOUND);

      user.comparePassword(password, user.password, (err, isMatch) => {
        if (err) throw err;

        // if true create a jwt token
        if (isMatch) {
          const token = jwtBuilder({ id: user.id });
          user.password = undefined;

          return res.send({
            token: token,
            user
          });
        }

        return res.status(401).send(AUTH_ERROR);
      });
    });
  } catch (e) {
    console.warn(e);
    res.send(UNEXPECTED_ERROR);
  }
}

// build a user
export async function signup(req, res) {
  const { name, password, email } = req.body;
  if (!name || name == "" || name.length < 3 || name.length > 80)
    return res.status(400).jwt(NAME_ISINVALID);

  if (!password || password == "" || password.length < 3 || password.length > 6)
    return res.status(400).jwt(PASSWORD_ISINVALID);

  if (!email || email == "") return res.status(400).jwt(EMAIL_ISINVALID);

  try {
    const user = await new User({
      name,
      email,
      password
    }).save();

    return res.status(201).json(user);
  } catch (e) {
    return res.status(400).send(UNEXPECTED_ERROR);
  }
}

// give a jwt token
export async function users(req, res) {
  const users = await User.find({});
  res.send({ users });
}

export async function iot(req, res) {
  try {
    console.log("+++++++++++++++++++++++++++++++++++++");

    if (req.params.mac && req.params.mac.length == 17) {
      const mac = req.params.mac;
      const device = await Device.findOne({ mac });

      if (!device) throw new Error(MAC_ISNOTFOUND.error);

      const token = jwtBuilder({ id: req.params.mac });
      const resp = {
        token
      };
      return res.status(200).send(resp);
    }
    throw new Error(MAC_ISINVALID.error);
  } catch (e) {
    console.log(e);

    return res.status(301).json({ e });
  }
}
