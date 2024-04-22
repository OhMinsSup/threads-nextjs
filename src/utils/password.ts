'server-only';

import bcrypt from 'bcryptjs';

export function generateSalt() {
  return bcrypt.genSaltSync(16);
}

export async function generateHash(password: string, salt: string) {
  return await bcrypt.hash(password, salt);
}

export function secureCompare(a: string, b: string): boolean {
  if (
    typeof a !== 'string' ||
    typeof b !== 'string' ||
    !a ||
    !b ||
    a.length !== b.length
  ) {
    return false;
  }

  try {
    return bcrypt.compareSync(a, b);
  } catch (exception) {
    return false;
  }
}
