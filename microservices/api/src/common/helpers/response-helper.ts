export const encodeResponse = (response: unknown): string => {
  return Object.keys(response).map(k => k + '=' + response[k]).join('&');
};
