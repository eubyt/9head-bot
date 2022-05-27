export const queryParamsToString = (params: any) =>
  Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${params[key]}`)
    .join('&');

export const getQueryParams = () => {};
