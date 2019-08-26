const buildException = exception => {
  return { error: exception };
};

export const UNEXPECTED_ERROR = buildException("unexpected error.");
