const buildException = exception => {
  return { error: exception };
};

export const MAC_ISINVALID = buildException("the mac is invalid.");
export const MAC_ISNOTFOUND = buildException("the device is unknow.");
