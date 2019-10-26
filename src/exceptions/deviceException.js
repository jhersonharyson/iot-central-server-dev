const buildException = exception => {
  return { error: exception };
};

export const MAC_ISINVALID = buildException("the mac is invalid.");
export const MAC_EXIST = buildException("the mac exist.");
export const MAC_ISNOTFOUND = buildException("the device is unknow.");
export const NAMED_ISINVALID = buildException("the name is invalid.");
export const DESCRIPTION_ISEMPTY = buildException("the description is empty.");
export const LOCATION_ISINVALID = buildException("the location is invalid.");
export const POSITION_ISINVALID = buildException("the position is invalid.");
