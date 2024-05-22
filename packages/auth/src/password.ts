import bcrypt from "bcryptjs";

export function generateSalt() {
  return bcrypt.genSalt(6);
}

export async function generateHash(password: string, salt: string) {
  return await bcrypt.hash(password, salt);
}

export async function secureCompare(a: string, b: string) {
  try {
    return await bcrypt.compare(a, b);
  } catch (exception) {
    return false;
  }
}
