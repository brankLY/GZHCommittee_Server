export function getResponse(success: boolean, message?: string, payload?: any) {
  const res: any = {};
  if (success === undefined || typeof success !== 'boolean') {
    throw new Error('Response Must have Property "success" of type boolean');
  }
  res.success = success;
  if (message) {
    res.message = message;
  }
  if (payload) {
    res.payload = payload;
  }
  return res;
}
