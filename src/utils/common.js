export const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/;
export const _isValidEmail = (string) => {
  return emailRegex.test(string);
};