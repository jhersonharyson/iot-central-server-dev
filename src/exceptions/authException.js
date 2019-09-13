const buildException = exception => {
  return { error: exception };
};

export const AUTH_ERROR = buildException("unauthorized.");
export const AUTH_NOTOKEN = buildException("no token.");
export const AUTH_TOKENINVALID = buildException("token is invalid.");
