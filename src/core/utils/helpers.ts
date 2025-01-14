import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { v1 as uuidv1 } from 'uuid';

const SALT_ROUNDS = 10;

/**
 * Creates a random key in hexadecimal format.
 * @param {number} bytes - The number of bytes to generate.
 * @returns {string} The generated random key in hexadecimal format.
 */
export function createRandomKey(bytes: number = 8): string {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Generates a bcrypt hash for the given password.
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} The hashed password.
 */
export async function generateHash(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares a password with a stored hash.
 * @param {string} pass - The password to compare.
 * @param {string} hash - The stored hash.
 * @returns {Promise<boolean>} Whether the password matches the hash.
 */
export async function compareHash(
  pass: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(pass, hash);
}

/**
 * Generates a unique identifier using UUID v1.
 * @returns {string} The generated UUID.
 */
export const uuid = (): string => uuidv1();
