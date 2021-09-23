export function validatePassword(pwd, confirmPwd) {
  if (pwd && !confirmPwd) return false;
  if (!pwd && confirmPwd) return false;
  if (pwd !== confirmPwd) return false;
  return true;
}

export const MONTHS = {
  1: "JANEIRO",
  2: "FEVEREIRO",
  3: "MARÇO",
  4: "ABRIL",
  5: "MAIO",
  6: "JUNHO",
  7: "JULHO",
  8: "AGOSTO",
  9: "SETEMBRO",
  10: "OUTUBRO",
  11: "NOVEMBRO",
  12: "DEZEMBRO",
}
