export function validatePassword(password: string): { valid: boolean; message: string } {
  if (!password) {
    return { valid: false, message: "Password is required" };
  }
  return { valid: true, message: "" };
}

export const PASSWORD_REQUIREMENTS = "Enter any password";
