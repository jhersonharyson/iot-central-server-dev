const buildException = exception => {
  return { error: exception };
};

export const AUTH_ERROR = buildException("unauthorized.");
