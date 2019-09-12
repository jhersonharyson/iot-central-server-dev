const buildException = exception => {
  return { error: exception };
};

export const NAME_ISINVALID = buildException("the name is invalid.");
export const NAME_SHORT = buildException("the name is too short.");
export const NAME_LARGE = buildException("the name is too large.");
export const PASSWORD_ISINVALID = buildException("the password is invalid.");
export const PASSWORD_SHORT = buildException("the password is too short.");
export const PASSWORD_LARGE = buildException("the password is too large.");
export const EMAIL_ISINVALID = buildException("the email is invalid.");
export const USER_NOTFOUND = buildException("the user is not found.");
export const ACCOUNT_ISINVALID = buildException("the account is invalid.");
