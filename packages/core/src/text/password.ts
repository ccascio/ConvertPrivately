export interface PasswordOptions {
  length?: number;
  uppercase?: boolean;
  lowercase?: boolean;
  digits?: boolean;
  symbols?: boolean;
  excludeAmbiguous?: boolean;
}

const CHARS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{}|;:,.<>?",
  ambiguous: "0O1lI",
};

export function generatePassword(opts: PasswordOptions = {}): string {
  const {
    length = 20,
    uppercase = true,
    lowercase = true,
    digits = true,
    symbols = true,
    excludeAmbiguous = false,
  } = opts;

  let upper = CHARS.upper;
  let lower = CHARS.lower;
  let digs = CHARS.digits;

  if (excludeAmbiguous) {
    for (const c of CHARS.ambiguous) {
      upper = upper.replace(c, "");
      lower = lower.replace(c, "");
      digs = digs.replace(c, "");
    }
  }

  let charset = "";
  const required: string[] = [];

  function cryptoRandIndex(max: number): number {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0]! % max;
  }

  if (uppercase) { charset += upper; required.push(upper[cryptoRandIndex(upper.length)]!); }
  if (lowercase) { charset += lower; required.push(lower[cryptoRandIndex(lower.length)]!); }
  if (digits) { charset += digs; required.push(digs[cryptoRandIndex(digs.length)]!); }
  if (symbols) { charset += CHARS.symbols; required.push(CHARS.symbols[cryptoRandIndex(CHARS.symbols.length)]!); }

  if (!charset) charset = CHARS.lower;

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  const password = Array.from(array).map((n) => charset[n % charset.length]!);

  required.forEach((ch, i) => {
    if (i < password.length) password[i] = ch;
  });

  const shuffleArr = new Uint32Array(password.length);
  crypto.getRandomValues(shuffleArr);
  for (let i = password.length - 1; i > 0; i--) {
    const j = shuffleArr[i] % (i + 1);
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join("");
}

export function generatePasswords(count: number, opts: PasswordOptions = {}): string[] {
  return Array.from({ length: count }, () => generatePassword(opts));
}

export type PasswordStrength = "weak" | "fair" | "strong" | "very-strong";

export function getPasswordStrength(password: string): PasswordStrength {
  if (password.length < 8) return "weak";
  let score = 0;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 16) score++;
  if (password.length >= 24) score++;
  if (score <= 2) return "weak";
  if (score === 3) return "fair";
  if (score === 4) return "strong";
  return "very-strong";
}
