export const queryValidation = (data: any): any => {
  const query: Record<string, any> = {};

  // Apply conditions and set query properties
  if (data.where) query.where = safelyParseJSON(data.where);
  if (data.attributes) query.attributes = safelyParseJSON(data.attributes);
  if (data.offset) query.offset = parseInt(data.offset, 10) || 0;
  if (data.limit) query.limit = parseInt(data.limit, 10) || 10;
  if (data.sort)
    query.sort = Array.isArray(data.sort) ? data.sort : [data.sort];
  if (data.populate) query.populate = data.populate || [];
  if (data.include) query.include = data.include || [];
  if (data.hardDelete) query.hardDelete = isStringBoolean(data.hardDelete);

  return query;
};

const safelyParseJSON = (input: string): any => {
  try {
    return JSON.parse(input);
  } catch {
    return undefined;
  }
};

export const isEmptyObject = (obj: any) => {
  for (let key in obj) {
    if (obj[key]) return false;
  }
  return true;
};

export const isStringBoolean = (val: string | boolean): any => {
  if (val === 'true') return true;
  if (val === 'false') return false;
};
