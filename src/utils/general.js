export function validatePassword(pwd, confirmPwd) {
  if (pwd && !confirmPwd) return false;
  if (!pwd && confirmPwd) return false;
  if (pwd !== confirmPwd) return false;
  return true;
}
