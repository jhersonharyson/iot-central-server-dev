import { sign, verify } from "jsonwebtoken";
import { SECRET } from "./constants";

// sign with RSA SHA256
export function jwtBuilder(
  data = {},
  exp = Math.floor(Date.now() / 1000) + 3600 * 24 * 7
) {
  const token = sign(
    {
      data: { ...data },
      exp: exp
    },
    SECRET,
    { algorithm: "HS256" }
  );
  return token;
}

export function jwtVerify(token = "") {
  return verify(token, SECRET, (err, decoded) => {
    if (err) throw new Error("Token Inválid.");
    return decoded.data.id;
  });
}
